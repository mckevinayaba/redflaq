import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import { useUserRole } from "./useUserRole";

export function useAdminGuard() {
  const { user, loading: authLoading } = useAuth();
  const { isStaff, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();
  const loading = authLoading || roleLoading;

  useEffect(() => {
    if (!loading) {
      if (!user) { navigate("/signup"); return; }
      if (!isStaff) { navigate("/"); return; }
    }
  }, [user, loading, isStaff, navigate]);

  return { loading, isAuthed: !!(user && isStaff && !loading) };
}
