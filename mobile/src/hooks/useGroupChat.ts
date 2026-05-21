import { useState, useCallback } from 'react';

export interface ChatMessage {
  id: string;
  groupId: string;
  authorId: string;
  authorName: string;
  authorInitial: string;
  authorColor: string;
  text: string;
  timestamp: string; // ISO
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
    { id: 'u2', authorId: 'm19', authorName: 'Sindi P.',       authorInitial: 'S', authorColor: '#6C35DE', text: "I'll be bringing a poem. Prepare to cry — the good kind.", timestamp: '2026-05-20T14:22:00Z', verified: true },
    { id: 'u3', authorId: 'm20', authorName: 'Thuli M.',       authorInitial: 'T', authorColor: '#C0392B', text: "I'm new. Is it okay to just listen the first time?", timestamp: '2026-05-20T15:11:00Z', verified: false },
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

const storageKey = (groupId: string) => `redflaq_chat_${groupId}_v1`;

export function useGroupChat(groupId: string) {
  const [userMessages, setUserMessages] = useState<ChatMessage[]>(() => {
    try { return JSON.parse(localStorage.getItem(storageKey(groupId)) || '[]'); } catch { return []; }
  });

  const seeds = (SEED_MESSAGES[groupId] || []).map(m => ({ ...m, groupId }));
  const messages = [...seeds, ...userMessages].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );

  const send = useCallback((text: string) => {
    const msg: ChatMessage = {
      id: `me_${Date.now()}`,
      groupId,
      authorId: 'me',
      authorName: 'You',
      authorInitial: 'Y',
      authorColor: '#6C35DE',
      text: text.trim(),
      timestamp: new Date().toISOString(),
      verified: false,
      isMe: true,
    };
    setUserMessages(prev => {
      const updated = [...prev, msg];
      localStorage.setItem(storageKey(groupId), JSON.stringify(updated));
      return updated;
    });
    // TODO: supabase.channel(`group:${groupId}`).send({ type: 'broadcast', event: 'message', payload: msg })
  }, [groupId]);

  const reportMessage = useCallback((messageId: string) => {
    setUserMessages(prev =>
      prev.map(m => m.id === messageId ? { ...m, reported: true } : m),
    );
    // TODO: supabase.from('message_reports').insert({ message_id: messageId })
  }, []);

  // TODO: replace with supabase.channel().on('broadcast', ...) subscription
  // const subscribe = () => supabase.channel(`group:${groupId}`).on('broadcast', { event: 'message' }, handler).subscribe()

  return { messages, send, reportMessage };
}
