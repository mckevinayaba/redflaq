import { useState, useEffect, useCallback } from 'react';
import { EVENTS, GroupEvent } from '../data/events';
import { supabase } from '../lib/supabase';

const LOCAL_RSVP_KEY     = 'redflaq_rsvps_v1';
const LOCAL_FEEDBACK_KEY = 'redflaq_feedback_v1';

type RsvpMap     = Record<string, string>;  // eventId → ISO timestamp
type FeedbackMap = Record<string, boolean>; // eventId → submitted

export interface EventFeedback {
  eventId: string;
  rating: number;
  notes: string;
  wouldAttendAgain: 'yes' | 'maybe' | 'no';
}

function loadLocal<T>(key: string, fallback: T): T {
  try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); } catch { return fallback; }
}

export function useGroupEvents(groupId: string) {
  const events = EVENTS.filter(e => e.groupId === groupId);
  const [rsvps, setRsvps]       = useState<RsvpMap>(() => loadLocal(LOCAL_RSVP_KEY, {}));
  const [feedback, setFeedback] = useState<FeedbackMap>(() => loadLocal(LOCAL_FEEDBACK_KEY, {}));

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      if (!userId) return;

      const eventIds = EVENTS.map(e => e.id);

      const [{ data: rsvpRows }, { data: fbRows }] = await Promise.all([
        supabase.from('event_rsvps').select('event_id, created_at').eq('user_id', userId).in('event_id', eventIds),
        supabase.from('event_feedback').select('event_id').eq('user_id', userId).in('event_id', eventIds),
      ]);

      if (rsvpRows) {
        const map: RsvpMap = {};
        rsvpRows.forEach(r => { map[r.event_id] = r.created_at; });
        setRsvps(map);
      }
      if (fbRows) {
        const map: FeedbackMap = {};
        fbRows.forEach(r => { map[r.event_id] = true; });
        setFeedback(map);
      }
    }
    init();
  }, []);

  const rsvp = useCallback(async (eventId: string) => {
    const now = new Date().toISOString();
    setRsvps(prev => ({ ...prev, [eventId]: now }));

    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    if (!userId) {
      setRsvps(prev => {
        const updated = { ...prev, [eventId]: now };
        localStorage.setItem(LOCAL_RSVP_KEY, JSON.stringify(updated));
        return updated;
      });
      return;
    }
    await supabase.from('event_rsvps').upsert(
      { user_id: userId, event_id: eventId },
      { onConflict: 'user_id,event_id' },
    );
  }, []);

  const unrsvp = useCallback(async (eventId: string) => {
    setRsvps(prev => { const { [eventId]: _, ...rest } = prev; return rest; });

    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    if (!userId) {
      setRsvps(prev => {
        const { [eventId]: _, ...rest } = prev;
        localStorage.setItem(LOCAL_RSVP_KEY, JSON.stringify(rest));
        return rest;
      });
      return;
    }
    await supabase.from('event_rsvps').delete().eq('user_id', userId).eq('event_id', eventId);
  }, []);

  const submitFeedback = useCallback(async (fb: EventFeedback) => {
    setFeedback(prev => ({ ...prev, [fb.eventId]: true }));

    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    if (!userId) {
      setFeedback(prev => {
        const updated = { ...prev, [fb.eventId]: true };
        localStorage.setItem(LOCAL_FEEDBACK_KEY, JSON.stringify(updated));
        return updated;
      });
      return;
    }
    await supabase.from('event_feedback').upsert({
      user_id: userId,
      event_id: fb.eventId,
      rating: fb.rating,
      notes: fb.notes || null,
      would_attend_again: fb.wouldAttendAgain,
    }, { onConflict: 'user_id,event_id' });
  }, []);

  const hasRsvpd    = (eventId: string) => !!rsvps[eventId];
  const hasFeedback = (eventId: string) => !!feedback[eventId];

  const pendingFeedback: GroupEvent[] = events.filter(e => {
    const isPast = new Date(e.date + 'T' + e.time) < new Date();
    return isPast && hasRsvpd(e.id) && !hasFeedback(e.id);
  });

  return { events, rsvp, unrsvp, submitFeedback, hasRsvpd, hasFeedback, pendingFeedback };
}
