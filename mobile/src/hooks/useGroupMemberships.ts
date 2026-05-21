import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const LOCAL_KEY = 'redflaq_groups_v1';

export function useGroupMemberships() {
  const [joinedGroupIds, setJoinedGroupIds] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]'); } catch { return []; }
  });

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      if (!userId) return;

      const { data } = await supabase
        .from('group_memberships')
        .select('group_id')
        .eq('user_id', userId);

      if (data) setJoinedGroupIds(data.map(r => r.group_id));
    }
    init();
  }, []);

  const join = async (groupId: string) => {
    setJoinedGroupIds(prev => prev.includes(groupId) ? prev : [...prev, groupId]);

    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    if (!userId) {
      const updated = [...joinedGroupIds.filter(id => id !== groupId), groupId];
      localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
      return;
    }

    await supabase.from('group_memberships').upsert(
      { user_id: userId, group_id: groupId, status: 'pending' },
      { onConflict: 'user_id,group_id' },
    );
  };

  return { joinedGroupIds, join };
}
