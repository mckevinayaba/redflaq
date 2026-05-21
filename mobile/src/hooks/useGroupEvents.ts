import { useState, useCallback } from 'react';
import { EVENTS, GroupEvent } from '../data/events';

const RSVP_KEY     = 'redflaq_rsvps_v1';
const FEEDBACK_KEY = 'redflaq_feedback_v1';

type RsvpMap     = Record<string, string>;  // eventId → ISO timestamp
type FeedbackMap = Record<string, boolean>; // eventId → submitted

export interface EventFeedback {
  eventId: string;
  rating: number;       // 1–5
  notes: string;
  wouldAttendAgain: 'yes' | 'maybe' | 'no';
}

function load<T>(key: string, fallback: T): T {
  try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); } catch { return fallback; }
}

export function useGroupEvents(groupId: string) {
  const events = EVENTS.filter(e => e.groupId === groupId);
  const [rsvps, setRsvps]       = useState<RsvpMap>(() => load(RSVP_KEY, {}));
  const [feedback, setFeedback] = useState<FeedbackMap>(() => load(FEEDBACK_KEY, {}));

  const rsvp = useCallback((eventId: string) => {
    setRsvps(prev => {
      const updated = { ...prev, [eventId]: new Date().toISOString() };
      localStorage.setItem(RSVP_KEY, JSON.stringify(updated));
      return updated;
    });
    // TODO: supabase.from('event_rsvps').upsert({ event_id: eventId, user_id: currentUser.id })
  }, []);

  const unrsvp = useCallback((eventId: string) => {
    setRsvps(prev => {
      const { [eventId]: _, ...rest } = prev;
      localStorage.setItem(RSVP_KEY, JSON.stringify(rest));
      return rest;
    });
  }, []);

  const submitFeedback = useCallback((fb: EventFeedback) => {
    setFeedback(prev => {
      const updated = { ...prev, [fb.eventId]: true };
      localStorage.setItem(FEEDBACK_KEY, JSON.stringify(updated));
      return updated;
    });
    // TODO: supabase.from('event_feedback').insert(fb)
  }, []);

  const hasRsvpd     = (eventId: string) => !!rsvps[eventId];
  const hasFeedback  = (eventId: string) => !!feedback[eventId];

  // Events that are past, were RSVP'd, and haven't received feedback yet
  const pendingFeedback: GroupEvent[] = events.filter(e => {
    const isPast = new Date(e.date + 'T' + e.time) < new Date();
    return isPast && hasRsvpd(e.id) && !hasFeedback(e.id);
  });

  return { events, rsvp, unrsvp, submitFeedback, hasRsvpd, hasFeedback, pendingFeedback };
}
