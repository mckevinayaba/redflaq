import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

export interface JournalEntry {
  id: string;
  text: string;
  tags: string[];
  date: string; // YYYY-MM-DD incident date
  createdAt: string;
  updatedAt: string;
}

const LOCAL_STORAGE_KEY  = 'redflaq_journal_v1';
const LOCAL_KEY_STORAGE  = 'redflaq_journal_key';
const HAS_CRYPTO         = typeof crypto !== 'undefined' && !!crypto.subtle;

// ── Crypto helpers ─────────────────────────────────────────────
function localKeyStorageKey(userId?: string) {
  return userId ? `redflaq_journal_key_${userId}` : LOCAL_KEY_STORAGE;
}

async function getOrCreateKey(userId?: string): Promise<CryptoKey> {
  const storageKey = localKeyStorageKey(userId);
  const stored = localStorage.getItem(storageKey);
  if (stored) {
    return crypto.subtle.importKey('jwk', JSON.parse(stored), { name: 'AES-GCM' }, true, ['encrypt', 'decrypt']);
  }
  const key = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']);
  const jwk = await crypto.subtle.exportKey('jwk', key);
  localStorage.setItem(storageKey, JSON.stringify(jwk));
  return key;
}

async function encryptText(plain: string, key: CryptoKey): Promise<{ encrypted: string; iv: string }> {
  const ivBytes  = crypto.getRandomValues(new Uint8Array(12));
  const encoded  = new TextEncoder().encode(plain);
  const cipher   = await crypto.subtle.encrypt({ name: 'AES-GCM', iv: ivBytes }, key, encoded);
  return {
    encrypted: btoa(String.fromCharCode(...new Uint8Array(cipher))),
    iv:        btoa(String.fromCharCode(...ivBytes)),
  };
}

async function decryptText(encrypted: string, ivB64: string, key: CryptoKey): Promise<string> {
  const cipher = new Uint8Array(atob(encrypted).split('').map(c => c.charCodeAt(0)));
  const iv     = new Uint8Array(atob(ivB64).split('').map(c => c.charCodeAt(0)));
  const plain  = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, cipher);
  return new TextDecoder().decode(plain);
}

// ── Hook ───────────────────────────────────────────────────────
export function useJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [ready, setReady]     = useState(false);
  const keyRef                = useRef<CryptoKey | null>(null);
  const userIdRef             = useRef<string | undefined>(undefined);

  useEffect(() => {
    async function init() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id;
        userIdRef.current = userId;

        if (HAS_CRYPTO) {
          keyRef.current = await getOrCreateKey(userId);
        }

        if (!userId) {
          // Fallback: read from localStorage (whole-blob encryption)
          const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
          if (raw) {
            if (HAS_CRYPTO && keyRef.current) {
              try {
                const iv     = new Uint8Array(atob(raw.slice(0, 16)).split('').map(c => c.charCodeAt(0)));
                const cipher = new Uint8Array(atob(raw.slice(16)).split('').map(c => c.charCodeAt(0)));
                const plain  = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, keyRef.current, cipher);
                setEntries(JSON.parse(new TextDecoder().decode(plain)));
              } catch {
                try { setEntries(JSON.parse(raw)); } catch {}
              }
            } else {
              try { setEntries(JSON.parse(raw)); } catch {}
            }
          }
          setReady(true);
          return;
        }

        // Load from Supabase with per-entry decryption
        const { data } = await supabase
          .from('journal_entries')
          .select('id, encrypted_text, iv, tags, entry_date, created_at, updated_at')
          .eq('user_id', userId)
          .order('entry_date', { ascending: false });

        if (data && data.length > 0) {
          const decrypted: JournalEntry[] = await Promise.all(
            data.map(async row => {
              let text = '';
              if (HAS_CRYPTO && keyRef.current) {
                try { text = await decryptText(row.encrypted_text, row.iv, keyRef.current); } catch {}
              }
              return {
                id:        row.id,
                text,
                tags:      row.tags ?? [],
                date:      row.entry_date,
                createdAt: row.created_at,
                updatedAt: row.updated_at,
              };
            }),
          );
          setEntries(decrypted);
        }
      } catch {
        // Corrupted data or key loss — start fresh
      }
      setReady(true);
    }
    init();
  }, []);

  const add = async (entry: { text: string; tags: string[]; date: string }) => {
    const now = new Date().toISOString();
    const id  = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const newEntry: JournalEntry = { ...entry, id, createdAt: now, updatedAt: now };

    const next = [newEntry, ...entries];
    setEntries(next);

    const userId = userIdRef.current;
    if (!userId || !HAS_CRYPTO || !keyRef.current) {
      persistLocal(next);
      return;
    }

    const { encrypted, iv } = await encryptText(entry.text, keyRef.current);
    await supabase.from('journal_entries').insert({
      id,
      user_id:        userId,
      encrypted_text: encrypted,
      iv,
      tags:           entry.tags,
      entry_date:     entry.date,
      created_at:     now,
      updated_at:     now,
    });
  };

  const update = async (id: string, patch: { text?: string; tags?: string[]; date?: string }) => {
    const now  = new Date().toISOString();
    const next = entries.map(e => e.id === id ? { ...e, ...patch, updatedAt: now } : e);
    setEntries(next);

    const userId = userIdRef.current;
    if (!userId || !HAS_CRYPTO || !keyRef.current) {
      persistLocal(next);
      return;
    }

    const dbPatch: Record<string, unknown> = { updated_at: now };
    if (patch.text !== undefined) {
      const { encrypted, iv } = await encryptText(patch.text, keyRef.current);
      dbPatch.encrypted_text = encrypted;
      dbPatch.iv             = iv;
    }
    if (patch.tags !== undefined) dbPatch.tags       = patch.tags;
    if (patch.date !== undefined) dbPatch.entry_date = patch.date;

    await supabase.from('journal_entries').update(dbPatch).eq('id', id).eq('user_id', userId);
  };

  const remove = async (id: string) => {
    const next = entries.filter(e => e.id !== id);
    setEntries(next);

    const userId = userIdRef.current;
    if (!userId) {
      persistLocal(next);
      return;
    }

    await supabase.from('journal_entries').delete().eq('id', id).eq('user_id', userId);
  };

  function persistLocal(next: JournalEntry[]) {
    try { localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(next)); } catch {}
  }

  return { entries, add, update, remove, ready };
}
