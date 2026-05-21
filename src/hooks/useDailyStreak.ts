import { useEffect, useState } from "react";

type StreakState = { count: number; lastOpenISO: string | null };

const KEY = "rf_streak_v1";

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

function read(): StreakState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { count: 0, lastOpenISO: null };
    return JSON.parse(raw) as StreakState;
  } catch {
    return { count: 0, lastOpenISO: null };
  }
}

function write(s: StreakState) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {}
}

/**
 * Tracks a daily-open streak in localStorage.
 * Increments once per calendar day. Resets if the user skips a day.
 */
export function useDailyStreak() {
  const [state, setState] = useState<StreakState>(() => read());

  useEffect(() => {
    const prev = read();
    const today = startOfDay(new Date());
    const last = prev.lastOpenISO ? startOfDay(new Date(prev.lastOpenISO)) : null;

    let next: StreakState;
    if (last === today) {
      next = prev; // already counted today
    } else if (last !== null && today - last === 86400000) {
      next = { count: prev.count + 1, lastOpenISO: new Date().toISOString() };
    } else {
      next = { count: 1, lastOpenISO: new Date().toISOString() };
    }
    if (next !== prev) {
      write(next);
      setState(next);
    }
  }, []);

  return state;
}
