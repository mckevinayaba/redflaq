import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface SavedSignal {
  id: string;
  title: string;
  category: string;
  categoryLabel: string;
  excerpt: string;
  savedAt: string;
}

const LOCAL_KEY = 'redflaq_saved_signals';

function dbToSignal(row: Record<string, unknown>): SavedSignal {
  return {
    id: row.signal_id as string,
    title: row.title as string,
    category: row.category as string,
    categoryLabel: row.category_label as string,
    excerpt: row.excerpt as string,
    savedAt: row.saved_at as string,
  };
}

export function useSavedSignals() {
  const [signals, setSignals] = useState<SavedSignal[]>([]);

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      if (!userId) {
        const raw = localStorage.getItem(LOCAL_KEY);
        if (raw) try { setSignals(JSON.parse(raw)); } catch {}
        return;
      }

      const { data } = await supabase
        .from('saved_signals')
        .select('*')
        .eq('user_id', userId)
        .order('saved_at', { ascending: false });

      if (data) setSignals(data.map(dbToSignal));
    }
    init();
  }, []);

  const save = async (signal: SavedSignal) => {
    setSignals(prev => [signal, ...prev.filter(s => s.id !== signal.id)]);

    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;

    if (!userId) {
      setSignals(prev => {
        const updated = [signal, ...prev.filter(s => s.id !== signal.id)];
        localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
        return updated;
      });
      return;
    }

    await supabase.from('saved_signals').upsert({
      user_id: userId,
      signal_id: signal.id,
      title: signal.title,
      category: signal.category,
      category_label: signal.categoryLabel,
      excerpt: signal.excerpt,
      saved_at: signal.savedAt,
    }, { onConflict: 'user_id,signal_id' });
  };

  const remove = async (id: string) => {
    setSignals(prev => prev.filter(s => s.id !== id));

    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;

    if (!userId) {
      setSignals(prev => {
        const updated = prev.filter(s => s.id !== id);
        localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
        return updated;
      });
      return;
    }

    await supabase.from('saved_signals').delete().eq('signal_id', id).eq('user_id', userId);
  };

  const isSaved = (id: string) => signals.some(s => s.id === id);

  return { signals, save, remove, isSaved };
}
