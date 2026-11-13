import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentAdmin, logoutAdmin } from "../../auth/services/authService";

export default function useAdminSession() {
  const navigate = useNavigate();

  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let active = true;

    getCurrentAdmin()
      .then((result) => {
        if (active) setAdmin(result.admin);
      })
      .catch((err) => {
        if (!active) return;

        if (err.status === 401) {
          navigate("/login", { replace: true });
        } else {
          setError(
            "Tidak dapat memuat sesi admin. Periksa koneksi backend lalu muat ulang halaman.",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [navigate]);

  async function handleLogout() {
    setLoggingOut(true);
    setError("");

    try {
      await logoutAdmin();
      navigate("/login", { replace: true });
    } catch {
      setError("Logout gagal. Periksa koneksi backend lalu coba lagi.");
    } finally {
      setLoggingOut(false);
    }
  }

  return {
    admin,
    loading,
    error,
    setError,
    loggingOut,
    handleLogout,
  };
}
