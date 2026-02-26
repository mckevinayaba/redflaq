import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function DemoResult() {
  const navigate = useNavigate();

  useEffect(() => {
    // Demo mode removed — redirect to pricing
    navigate("/pricing", { replace: true });
  }, [navigate]);

  return null;
}
