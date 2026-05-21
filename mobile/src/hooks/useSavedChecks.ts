import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface SavedCheck {
  id: string;
  name: string;
  idNumber?: string;
  province?: string;
  riskLevel: 'CLEAR' | 'LOW' | 'MEDIUM' | 'HIGH';
  riskScore: number;
  savedAt: string;
  package: 'single' | 'triple' | 'family';
  notes?: string;
}

const LOCAL_KEY = 'redflaq_saved_checks';

function dbToCheck(row: Record<string, unknown>): SavedCheck {
  return {
    id: row.id as string,
    name: row.name as string,
    idNumber: row.id_number as string | undefined,
    province: row.province as string | undefined,
    riskLevel: row.risk_level as SavedCheck['riskLevel'],
    riskScore: row.risk_score as number,
    savedAt: row.saved_at as string,
    package: row.package as SavedCheck['package'],
    notes: row.notes as string | undefined,
  };
}

function checkToDb(check: SavedCheck, userId: string) {
  return {
    id: check.id,
    user_id: userId,
    name: check.name,
    id_number: check.idNumber ?? null,
    province: check.province ?? null,
    risk_level: check.riskLevel,
    risk_score: check.riskScore,
    saved_at: check.savedAt,
    package: check.package,
    notes: check.notes ?? null,
  };
}

export function useSavedChecks() {
  const [checks, setChecks] = useState<SavedCheck[]>([]);

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      if (!userId) {
        const raw = localStorage.getItem(LOCAL_KEY);
        if (raw) try { setChecks(JSON.parse(raw)); } catch {}
        return;
      }

      const { data } = await supabase
        .from('checks')
        .select('*')
        .eq('user_id', userId)
        .order('saved_at', { ascending: false });

      if (data) setChecks(data.map(dbToCheck));
    }
    init();
  }, []);

  const save = async (check: SavedCheck) => {
    setChecks(prev => [check, ...prev.filter(c => c.id !== check.id)]);

    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;

    if (!userId) {
      setChecks(prev => {
        const updated = [check, ...prev.filter(c => c.id !== check.id)];
        localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
        return updated;
      });
      return;
    }

    await supabase.from('checks').upsert(checkToDb(check, userId), { onConflict: 'id' });
  };

  const remove = async (id: string) => {
    setChecks(prev => prev.filter(c => c.id !== id));

    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;

    if (!userId) {
      setChecks(prev => {
        const updated = prev.filter(c => c.id !== id);
        localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
        return updated;
      });
      return;
    }

    await supabase.from('checks').delete().eq('id', id).eq('user_id', userId);
  };

  const clear = async () => {
    setChecks([]);

    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;

    if (!userId) {
      localStorage.removeItem(LOCAL_KEY);
      return;
    }

    await supabase.from('checks').delete().eq('user_id', userId);
  };

  return { checks, save, remove, clear };
}
