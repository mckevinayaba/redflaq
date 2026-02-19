import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export type AppRole = "owner" | "admin" | "support" | "user";

export function useUserRole() {
  const { user, loading: authLoading } = useAuth();
  const [role, setRole] = useState<AppRole>("user");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { setLoading(false); return; }

    const fetchRole = async () => {
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle();

      if (data?.role) setRole(data.role as AppRole);
      setLoading(false);
    };

    fetchRole();
  }, [user, authLoading]);

  const isOwner = role === "owner";
  const isAdmin = role === "admin" || role === "owner";
  const isSupport = role === "support" || isAdmin;
  const isStaff = isSupport; // anyone with admin-area access

  return { role, loading: loading || authLoading, isOwner, isAdmin, isSupport, isStaff };
}
