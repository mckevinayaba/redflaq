import { useState, useEffect } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = (email: string, password: string) =>
    supabase.auth.signInWithPassword({ email, password });

  const signUp = (email: string, password: string, displayName: string, province: string) =>
    supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName, province } },
    });

  const signOut = () => supabase.auth.signOut();

  const resetPassword = (email: string) =>
    supabase.auth.resetPasswordForEmail(email);

  return { user, loading, signIn, signUp, signOut, resetPassword };
}
