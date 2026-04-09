import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Legacy admin login page — redirect to standard auth flow
    navigate("/signup", { replace: true });
  }, [navigate]);

  return null;
};

export default AdminLogin;
