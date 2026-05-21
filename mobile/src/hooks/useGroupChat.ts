import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';

export interface ChatMessage {
  id: string;
  groupId: string;
  authorId: string;
  authorName: string;
  authorInitial: string;
  authorColor: string;
  text: string;
  timestamp: string;
  verified: boolean;
  isMe?: boolean;
  reported?: boolean;
}

// Seed conversation history per group
const SEED_MESSAGES: Record<string, Omit<ChatMessage, 'groupId'>[]> = {
  'healing-circle-jhb': [
    { id: 's1', authorId: 'm1', authorName: 'Nomvula S.',  authorInitial: 'N', authorColor: '#6C35DE', text: "Welcome everyone. This week's topic: how do we talk about what happened without re-traumatising ourselves?", timestamp: '2026-05-21T08:04:00Z', verified: true },
    { id: 's2', authorId: 'm2', authorName: 'Precious M.', authorInitial: 'P', authorColor: '#C0392B', text: "I've found it helps to write first before speaking. It gives you control over the words.", timestamp: '2026-05-21T08:17:00Z', verified: true },
    { id: 's3', authorId: 'm3', authorName: 'Thandi K.',   authorInitial: 'T', authorColor: '#27AE60', text: "I struggle with that. When I write it I see it, and then I can't unsee it.", timestamp: '2026-05-21T08:31:00Z', verified: true },
    { id: 's4', authorId: 'm2', authorName: 'Precious M.', authorInitial: 'P', authorColor: '#C0392B', text: "That's valid. There's no right way. Some people need to speak it to process.", timestamp: '2026-05-21T08:45:00Z', verified: true },
    { id: 's5', authorId: 'm4', authorName: 'Ayanda R.',   authorInitial: 'A', authorColor: '#E67E22', text: "Has anyone found a therapist who actually gets this? Every one I've tried ends up centring my abuser's feelings.", timestamp: '2026-05-21T09:03:00Z', verified: false },
    { id: 's6', authorId: 'm1', authorName: 'Nomvula S.',  authorInitial: 'N', authorColor: '#6C35DE', text: "That's such a real problem. Trauma-informed therapists exist but you have to specifically ask. Happy to share a list if that helps.", timestamp: '2026-05-21T09:22:00Z', verified: true },
  ],
  'ubuntu-healing-durban': [
    { id: 'u1', authorId: 'm18', authorName: 'Nokukhanya B.', authorInitial: 'N', authorColor: '#27AE60', text: "Our next circle is Thursday at 18:00. This month's theme: Naming It.", timestamp: '2026-05-20T14:00:00Z', verified: true },
    { id: 'u2', authorId: 'm19', authorName: 'Sindi P.',      authorInitial: 'S', authorColor: '#6C35DE', text: "I'll be bringing a poem. Prepare to cry — the good kind.", timestamp: '2026-05-20T14:22:00Z', verified: true },
    { id: 'u3', authorId: 'm20', authorName: 'Thuli M.',      authorInitial: 'T', authorColor: '#C0392B', text: "I'm new. Is it okay to just listen the first time?", timestamp: '2026-05-20T15:11:00Z', verified: false },
    { id: 'u4', authorId: 'm18', authorName: 'Nokukhanya B.', authorInitial: 'N', authorColor: '#27AE60', text: "Always. You contribute just by being present.", timestamp: '2026-05-20T15:18:00Z', verified: true },
  ],
  'know-your-rights-pta': [
    { id: 'p1', authorId: 'm16', authorName: 'Dineo M.',  authorInitial: 'D', authorColor: '#C0392B', text: "Reminder that we have a Q&A session next Wednesday. Submit questions in advance if you can — it helps us prioritise.", timestamp: '2026-05-19T11:00:00Z', verified: true },
    { id: 'p2', authorId: 'm17', authorName: 'Phindi L.', authorInitial: 'P', authorColor: '#E67E22', text: "Mine: what happens if the person named in your protection order moves to a different province?", timestamp: '2026-05-19T11:45:00Z', verified: true },
    { id: 'p3', authorId: 'm16', authorName: 'Dineo M.',  authorInitial: 'D', authorColor: '#C0392B', text: "Great question. A national protection order applies across all provinces in SA. I'll make sure the attorney addresses this specifically.", timestamp: '2026-05-19T12:10:00Z', verified: true },
  ],
  'legal-rights-sa': [
    { id: 'l1', authorId: 'm5', authorName: 'Lindiwe N.',   authorInitial: 'L', authorColor: '#6C35DE', text: "New resource pinned: the NPA's guide to Thuthuzela Care Centres. Updated for 2026.", timestamp: '2026-05-18T09:00:00Z', verified: true },
    { id: 'l2', authorId: 'm7', authorName: 'Zanele M.',    authorInitial: 'Z', authorColor: '#27AE60', text: "Thank you — I've been trying to find the Bellville one. This helped.", timestamp: '2026-05-18T10:30:00Z', verified: true },
    { id: 'l3', authorId: 'm6', authorName: 'Boitumelo P.', authorInitial: 'B', authorColor: '#C0392B', text: "Also worth noting: you don't need a lawyer to apply for a protection order. You can go directly to the magistrate's court.", timestamp: '2026-05-18T11:05:00Z', verified: true },
  ],
};

const AUTHOR_COLORS = ['#6C35DE', '#C0392B', '#27AE60', '#E67E22', '#2980B9', '#8E44AD'];

function colorForUser(userId: string): string {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) hash = (hash * 31 + userId.charCodeAt(i)) >>> 0;
  return AUTHOR_COLORS[hash % AUTHOR_COLORS.length];
}

const LOCAL_KEY = (groupId: string) => `redflaq_chat_${groupId}_v1`;

export function useGroupChat(groupId: string) {
  const [dbMessages, setDbMessages]     = useState<ChatMessage[]>([]);
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>(() => {
    try { return JSON.parse(localStorage.getItem(LOCAL_KEY(groupId)) || '[]'); } catch { return []; }
  });
  const hasRealMessagesRef = useRef(false);
  const currentUserIdRef   = useRef<string | undefined>(undefined);
  const currentUserNameRef = useRef<string>('You');

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      currentUserIdRef.current = userId;

      if (!userId) return;

      // Fetch user's display name from profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', userId)
        .maybeSingle();
      if (profile?.display_name) currentUserNameRef.current = profile.display_name;

      // Fetch existing messages (author info stored in table)
      const { data: rows } = await supabase
        .from('messages')
        .select('id, user_id, author_name, author_initial, author_color, text, verified, created_at')
        .eq('group_id', groupId)
        .order('created_at', { ascending: true });

      if (rows && rows.length > 0) {
        hasRealMessagesRef.current = true;
        setDbMessages(rows.map(r => ({
          id:            r.id,
          groupId,
          authorId:      r.user_id ?? 'unknown',
          authorName:    r.author_name,
          authorInitial: r.author_initial,
          authorColor:   r.author_color,
          text:          r.text,
          timestamp:     r.created_at,
          verified:      r.verified,
          isMe:          r.user_id === userId,
        })));
      }

      // Subscribe to new messages via Realtime
      const channel = supabase
        .channel(`group-chat-${groupId}`)
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'messages', filter: `group_id=eq.${groupId}` },
          (payload) => {
            const row = payload.new as {
              id: string; user_id: string; author_name: string; author_initial: string;
              author_color: string; text: string; verified: boolean; created_at: string;
            };
            if (row.user_id === currentUserIdRef.current) return; // skip own (already optimistic)

            const msg: ChatMessage = {
              id:            row.id,
              groupId,
              authorId:      row.user_id,
              authorName:    row.author_name,
              authorInitial: row.author_initial,
              authorColor:   row.author_color,
              text:          row.text,
              timestamp:     row.created_at,
              verified:      row.verified,
              isMe:          false,
            };
            hasRealMessagesRef.current = true;
            setDbMessages(prev => [...prev, msg]);
          },
        )
        .subscribe();

      return () => { supabase.removeChannel(channel); };
    }
    init();
  }, [groupId]);

  const seeds = hasRealMessagesRef.current
    ? []
    : (SEED_MESSAGES[groupId] || []).map(m => ({ ...m, groupId }));

  const messages = [...seeds, ...dbMessages, ...localMessages].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );

  const send = useCallback(async (text: string) => {
    const userId   = currentUserIdRef.current;
    const userName = currentUserNameRef.current;
    const trimmed  = text.trim();

    if (userId) {
      // Optimistic add with temp ID
      const tempId = `temp_${Date.now()}`;
      const optimistic: ChatMessage = {
        id:            tempId,
        groupId,
        authorId:      userId,
        authorName:    userName,
        authorInitial: userName.charAt(0).toUpperCase(),
        authorColor:   '#6C35DE',
        text:          trimmed,
        timestamp:     new Date().toISOString(),
        verified:      false,
        isMe:          true,
      };
      hasRealMessagesRef.current = true;
      setDbMessages(prev => [...prev, optimistic]);

      const initial = userName.charAt(0).toUpperCase();
      const { data: inserted } = await supabase
        .from('messages')
        .insert({
          group_id:       groupId,
          user_id:        userId,
          author_name:    userName,
          author_initial: initial,
          author_color:   '#6C35DE',
          text:           trimmed,
          verified:       false,
        })
        .select('id, created_at')
        .single();

      if (inserted) {
        // Replace temp with real ID
        setDbMessages(prev => prev.map(m =>
          m.id === tempId ? { ...m, id: inserted.id, timestamp: inserted.created_at } : m,
        ));
      }
    } else {
      // localStorage fallback when not authenticated
      const msg: ChatMessage = {
        id: `me_${Date.now()}`,
        groupId,
        authorId: 'me',
        authorName: 'You',
        authorInitial: 'Y',
        authorColor: '#6C35DE',
        text: trimmed,
        timestamp: new Date().toISOString(),
        verified: false,
        isMe: true,
      };
      setLocalMessages(prev => {
        const updated = [...prev, msg];
        localStorage.setItem(LOCAL_KEY(groupId), JSON.stringify(updated));
        return updated;
      });
    }
  }, [groupId]);

  const reportMessage = useCallback(async (messageId: string) => {
    setDbMessages(prev => prev.map(m => m.id === messageId ? { ...m, reported: true } : m));
    setLocalMessages(prev => prev.map(m => m.id === messageId ? { ...m, reported: true } : m));

    const userId = currentUserIdRef.current;
    if (!userId) return;

    await supabase.from('message_reports').insert({
      message_id:  messageId,
      reporter_id: userId,
      reason:      'user_report',
    });
  }, []);

  return { messages, send, reportMessage };
}
