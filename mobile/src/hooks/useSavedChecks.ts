import { useState, useEffect } from 'react';

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

const STORAGE_KEY = 'redflaq_saved_checks';

export function useSavedChecks() {
  const [checks, setChecks] = useState<SavedCheck[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try { setChecks(JSON.parse(raw)); } catch {}
    }
  }, []);

  const save = (check: SavedCheck) => {
    setChecks(prev => {
      const updated = [check, ...prev.filter(c => c.id !== check.id)];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const remove = (id: string) => {
    setChecks(prev => {
      const updated = prev.filter(c => c.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const clear = () => {
    setChecks([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return { checks, save, remove, clear };
}
