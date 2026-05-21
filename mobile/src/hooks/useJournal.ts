import { useState, useEffect, useRef } from 'react';

export interface JournalEntry {
  id: string;
  text: string;
  tags: string[];
  date: string; // YYYY-MM-DD incident date
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'redflaq_journal_v1';
const KEY_STORAGE  = 'redflaq_journal_key';
const HAS_CRYPTO   = typeof crypto !== 'undefined' && !!crypto.subtle;

// ── Crypto helpers ─────────────────────────────────────────────
async function getOrCreateKey(): Promise<CryptoKey> {
  const stored = localStorage.getItem(KEY_STORAGE);
  if (stored) {
    return crypto.subtle.importKey('jwk', JSON.parse(stored), { name: 'AES-GCM' }, true, ['encrypt', 'decrypt']);
  }
  const key = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']);
  const jwk = await crypto.subtle.exportKey('jwk', key);
  localStorage.setItem(KEY_STORAGE, JSON.stringify(jwk));
  return key;
}

async function encryptData(plain: string, key: CryptoKey): Promise<string> {
  const iv      = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(plain);
  const cipher  = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoded);
  const out     = new Uint8Array(iv.length + cipher.byteLength);
  out.set(iv);
  out.set(new Uint8Array(cipher), iv.length);
  return btoa(String.fromCharCode(...out));
}

async function decryptData(b64: string, key: CryptoKey): Promise<string> {
  const buf     = new Uint8Array(atob(b64).split('').map(c => c.charCodeAt(0)));
  const iv      = buf.slice(0, 12);
  const cipher  = buf.slice(12);
  const plain   = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, cipher);
  return new TextDecoder().decode(plain);
}

// ── Hook ───────────────────────────────────────────────────────
export function useJournal() {
  const [entries, setEntries]   = useState<JournalEntry[]>([]);
  const [ready, setReady]       = useState(false);
  const keyRef                  = useRef<CryptoKey | null>(null);

  useEffect(() => {
    async function init() {
      try {
        if (HAS_CRYPTO) {
          keyRef.current = await getOrCreateKey();
          const raw = localStorage.getItem(STORAGE_KEY);
          if (raw) {
            const json = await decryptData(raw, keyRef.current);
            setEntries(JSON.parse(json));
          }
        } else {
          // Fallback: plain JSON (non-secure context)
          const raw = localStorage.getItem(STORAGE_KEY);
          if (raw) setEntries(JSON.parse(raw));
        }
      } catch {
        // Corrupted data — start fresh (key lost or tampered)
      }
      setReady(true);
    }
    init();
  }, []);

  const persist = async (next: JournalEntry[]) => {
    try {
      if (HAS_CRYPTO && keyRef.current) {
        const encrypted = await encryptData(JSON.stringify(next), keyRef.current);
        localStorage.setItem(STORAGE_KEY, encrypted);
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      }
    } catch {
      // Write failure — still update in-memory state
    }
    setEntries(next);
  };

  const add = (entry: { text: string; tags: string[]; date: string }) => {
    const now = new Date().toISOString();
    const newEntry: JournalEntry = {
      ...entry,
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      createdAt: now,
      updatedAt: now,
    };
    return persist([newEntry, ...entries]);
  };

  const update = (id: string, patch: { text?: string; tags?: string[]; date?: string }) => {
    return persist(entries.map(e =>
      e.id === id ? { ...e, ...patch, updatedAt: new Date().toISOString() } : e
    ));
  };

  const remove = (id: string) => persist(entries.filter(e => e.id !== id));

  return { entries, add, update, remove, ready };
}
