import { useState, useEffect } from 'react';
import { SECTIONS, TOTAL_QUESTIONS } from '../data/quiz';

export interface QuizState {
  answers: Record<string, number>; // questionId -> option index
  completedSections: string[];     // section letters completed
  completed: boolean;
  startedAt: string | null;
  completedAt: string | null;
}

const STORAGE_KEY = 'redflaq_quiz_v1';

const EMPTY: QuizState = {
  answers: {},
  completedSections: [],
  completed: false,
  startedAt: null,
  completedAt: null,
};

function load(): QuizState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY;
  } catch {
    return EMPTY;
  }
}

function persist(state: QuizState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function useQuiz() {
  const [state, setState] = useState<QuizState>(EMPTY);

  useEffect(() => { setState(load()); }, []);

  const setAndSave = (next: QuizState) => {
    persist(next);
    setState(next);
  };

  const answer = (questionId: string, optionIndex: number) => {
    setAndSave({ ...state, answers: { ...state.answers, [questionId]: optionIndex } });
  };

  const completeSection = (letter: string) => {
    const completedSections = [...new Set([...state.completedSections, letter])];
    const allSectionsDone = SECTIONS.every(s => completedSections.includes(s.letter));
    const now = new Date().toISOString();
    setAndSave({
      ...state,
      completedSections,
      completed: allSectionsDone,
      startedAt: state.startedAt ?? now,
      completedAt: allSectionsDone ? now : null,
    });
  };

  const start = () => {
    if (!state.startedAt) {
      setAndSave({ ...state, startedAt: new Date().toISOString() });
    }
  };

  const reset = () => setAndSave(EMPTY);

  const answeredCount = Object.keys(state.answers).length;
  const progress = Math.round((answeredCount / TOTAL_QUESTIONS) * 100);

  const isSectionComplete = (letter: string) => {
    const sec = SECTIONS.find(s => s.letter === letter);
    if (!sec) return false;
    return sec.questions.every(q => state.answers[q.id] !== undefined);
  };

  return { state, answer, completeSection, start, reset, progress, answeredCount, isSectionComplete };
}
