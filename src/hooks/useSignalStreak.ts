/**
 * Tracks daily signal reading streak via localStorage.
 * - Records which signals were read and on which dates
 * - Calculates current streak (consecutive days reading at least 1 signal)
 * - Exposes total signals read count
 */

const STORAGE_KEY = "redflaq_signal_streak";

interface StreakData {
  /** ISO date strings of days a signal was read */
  readDates: string[];
  /** Slugs of all signals ever read */
  readSlugs: string[];
  /** Total count of signal reads */
  totalReads: number;
}

const today = () => new Date().toISOString().split("T")[0];

function getData(): StreakData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { readDates: [], readSlugs: [], totalReads: 0 };
    return JSON.parse(raw);
  } catch {
    return { readDates: [], readSlugs: [], totalReads: 0 };
  }
}

function saveData(data: StreakData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/** Calculate consecutive days streak ending today or yesterday */
function calcStreak(dates: string[]): number {
  if (dates.length === 0) return 0;
  const unique = [...new Set(dates)].sort().reverse();
  const todayStr = today();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  // Streak must include today or yesterday
  if (unique[0] !== todayStr && unique[0] !== yesterdayStr) return 0;

  let streak = 1;
  for (let i = 0; i < unique.length - 1; i++) {
    const curr = new Date(unique[i]);
    const prev = new Date(unique[i + 1]);
    const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

export function markSignalRead(slug: string) {
  const data = getData();
  const todayStr = today();
  if (!data.readDates.includes(todayStr)) {
    data.readDates.push(todayStr);
  }
  if (!data.readSlugs.includes(slug)) {
    data.readSlugs.push(slug);
  }
  data.totalReads++;
  saveData(data);
}

export function getStreakInfo() {
  const data = getData();
  return {
    streak: calcStreak(data.readDates),
    totalReads: data.totalReads,
    uniqueSignals: data.readSlugs.length,
    hasReadToday: data.readDates.includes(today()),
  };
}

export function getVisitCount(): number {
  const key = "redflaq_visit_count";
  const countStr = localStorage.getItem(key);
  const count = countStr ? parseInt(countStr, 10) : 0;
  return count;
}

export function incrementVisitCount(): number {
  const key = "redflaq_visit_count";
  const lastVisitKey = "redflaq_last_visit";
  const todayStr = today();
  const lastVisit = localStorage.getItem(lastVisitKey);

  // Only count once per day
  if (lastVisit === todayStr) {
    return getVisitCount();
  }

  const count = getVisitCount() + 1;
  localStorage.setItem(key, count.toString());
  localStorage.setItem(lastVisitKey, todayStr);
  return count;
}
