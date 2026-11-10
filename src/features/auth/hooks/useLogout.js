import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../useAuth";

export function useLogout() {
  const navigate = useNavigate();
  const { logout: clearAuth } = useAuth();
  const [loading, setLoading] = useState(false);

  const logout = async () => {
    setLoading(true);
    try {
      await clearAuth();
    } finally {
      setLoading(false);
      navigate("/login");
    }
  };

  return { logout, loading };
}
