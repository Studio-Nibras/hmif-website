import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Loading } from "../../components/ui";
import { getCurrentAdmin, logoutAdmin } from "../auth/authService";
import NewsPage from "./news/NewsPage";
import AdminLayout from "./admin-layout/AdminLayout";
import navigation from "./admin-layout/navigation";
import OverviewPage from "./overview/OverviewPage";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState("overview");
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

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-hmif-surface px-6 text-center">
        <Loading fullScreen label="Memeriksa sesi administrator..." />
      </main>
    );
  }

  if (!admin) {
    return (
      <main className="grid min-h-screen place-items-center bg-hmif-surface px-6 text-center">
        <div className="max-w-md">
          <p className="font-heading text-lg font-bold text-hmif-navy">
            Sesi administrator belum tersedia
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            {error || "Silakan masuk kembali untuk melanjutkan."}
          </p>
          <Button
            onClick={() => navigate("/login", { replace: true })}
            className="mt-5"
          >
            Kembali ke login
          </Button>
        </div>
      </main>
    );
  }

  const activeItem = navigation.find((item) => item.section === activeSection);
  const pageTitle =
    activeItem?.label ||
    (activeSection === "settings" ? "Pengaturan Website" : "Dashboard");

  return (
    <AdminLayout
      activeSection={activeSection}
      onNavigate={setActiveSection}
      onLogout={handleLogout}
      admin={admin}
      loggingOut={loggingOut}
      pageTitle={pageTitle}
      error={error}
      onDismissError={() => setError("")}
    >
      {activeSection === "overview" ? (
        <OverviewPage admin={admin} />
      ) : activeSection === "news" ? (
        <NewsPage />
      ) : (
        <Card
          as="section"
          className="rounded-3xl px-6 py-16 text-center sm:px-10"
        >
          <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-hmif-surface text-2xl text-hmif-teal">
            {activeItem?.icon || (activeSection === "settings" ? "⚙" : "▤")}
          </div>
          <h2 className="mt-5 font-heading text-xl font-extrabold text-hmif-navy">
            {pageTitle}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            Modul ini akan kita implementasikan berikutnya. Layout dashboard dan
            autentikasi admin tetap aktif.
          </p>
          <Button onClick={() => setActiveSection("overview")} className="mt-6">
            Kembali ke overview
          </Button>
        </Card>
      )}
    </AdminLayout>
  );
}
