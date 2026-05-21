import { useState, useEffect, useRef } from 'react';
import { SECTIONS, TOTAL_QUESTIONS } from '../data/quiz';
import { supabase } from '../lib/supabase';

export interface QuizState {
  answers: Record<string, number>;
  completedSections: string[];
  completed: boolean;
  startedAt: string | null;
  completedAt: string | null;
}

const LOCAL_KEY = 'redflaq_quiz_v1';

const EMPTY: QuizState = {
  answers: {},
  completedSections: [],
  completed: false,
  startedAt: null,
  completedAt: null,
};

function loadLocal(): QuizState {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    return raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY;
  } catch {
    return EMPTY;
  }
}

export function useQuiz() {
  const [state, setState]     = useState<QuizState>(EMPTY);
  const userIdRef             = useRef<string | undefined>(undefined);
  const debounceRef           = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestAnswersRef      = useRef<Record<string, number>>({});

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      userIdRef.current = userId;

      if (!userId) {
        setState(loadLocal());
        return;
      }

      const { data } = await supabase
        .from('quiz_responses')
        .select('answers, completed_sections, completed, started_at, completed_at')
        .eq('user_id', userId)
        .maybeSingle();

      if (data) {
        const loaded: QuizState = {
          answers:           data.answers ?? {},
          completedSections: data.completed_sections ?? [],
          completed:         data.completed ?? false,
          startedAt:         data.started_at ?? null,
          completedAt:       data.completed_at ?? null,
        };
        setState(loaded);
        latestAnswersRef.current = loaded.answers;
      } else {
        // Fall back to local if no server record yet
        const local = loadLocal();
        setState(local);
        latestAnswersRef.current = local.answers;
      }
    }
    init();

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, []);

  const syncToSupabase = async (next: QuizState) => {
    const userId = userIdRef.current;
    if (!userId) return;
    await supabase.from('quiz_responses').upsert({
      user_id:            userId,
      answers:            next.answers,
      completed_sections: next.completedSections,
      completed:          next.completed,
      started_at:         next.startedAt,
      completed_at:       next.completedAt,
    }, { onConflict: 'user_id' });
  };

  const setAndSaveLocal = (next: QuizState) => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(next));
    setState(next);
  };

  const answer = (questionId: string, optionIndex: number) => {
    const next = { ...state, answers: { ...state.answers, [questionId]: optionIndex } };
    latestAnswersRef.current = next.answers;
    setAndSaveLocal(next);

    // Debounced Supabase sync for frequent answer changes
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => syncToSupabase(next), 1500);
  };

  const completeSection = (letter: string) => {
    const completedSections = [...new Set([...state.completedSections, letter])];
    const allSectionsDone   = SECTIONS.every(s => completedSections.includes(s.letter));
    const now               = new Date().toISOString();
    const next: QuizState   = {
      ...state,
      completedSections,
      completed:   allSectionsDone,
      startedAt:   state.startedAt ?? now,
      completedAt: allSectionsDone ? now : null,
    };
    setAndSaveLocal(next);
    syncToSupabase(next); // Immediate sync for section completion
  };

  const start = () => {
    if (!state.startedAt) {
      const next = { ...state, startedAt: new Date().toISOString() };
      setAndSaveLocal(next);
      syncToSupabase(next);
    }
  };

  const reset = () => {
    setAndSaveLocal(EMPTY);
    syncToSupabase(EMPTY);
  };

  const answeredCount  = Object.keys(state.answers).length;
  const progress       = Math.round((answeredCount / TOTAL_QUESTIONS) * 100);

  const isSectionComplete = (letter: string) => {
    const sec = SECTIONS.find(s => s.letter === letter);
    if (!sec) return false;
    return sec.questions.every(q => state.answers[q.id] !== undefined);
  };

  return { state, answer, completeSection, start, reset, progress, answeredCount, isSectionComplete };
}
