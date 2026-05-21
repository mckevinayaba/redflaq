import { useState, useEffect } from 'react';

export interface SavedSignal {
  id: string;
  title: string;
  category: string;
  categoryLabel: string;
  excerpt: string;
  savedAt: string;
}

const STORAGE_KEY = 'redflaq_saved_signals';

export function useSavedSignals() {
  const [signals, setSignals] = useState<SavedSignal[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try { setSignals(JSON.parse(raw)); } catch {}
    }
  }, []);

  const save = (signal: SavedSignal) => {
    setSignals(prev => {
      const updated = [signal, ...prev.filter(s => s.id !== signal.id)];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const remove = (id: string) => {
    setSignals(prev => {
      const updated = prev.filter(s => s.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const isSaved = (id: string) => signals.some(s => s.id === id);

  return { signals, save, remove, isSaved };
}
