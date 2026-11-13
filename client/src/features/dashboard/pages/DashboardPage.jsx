import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loading } from "../../../components/ui";

import useAdminSession from "../hooks/useAdminSession";
import NewsPage from "../news/NewsPage";
import AdminLayout from "../layouts/AdminLayout";
import navigation from "../layouts/navigation";
import OverviewPage from "../overview/pages/OverviewPage";
import DashboardPlaceholder from "../components/DashboardPlaceholder";

export default function DashboardPage() {
  const navigate = useNavigate();

  const { admin, loading, error, setError, loggingOut, handleLogout } =
    useAdminSession();

  const [activeSection, setActiveSection] = useState("overview");

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

          <button
            type="button"
            onClick={() => navigate("/login", { replace: true })}
            className="mt-5 rounded-xl bg-hmif-teal px-5 py-3 text-sm font-bold text-white"
          >
            Kembali ke login
          </button>
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
        <DashboardPlaceholder
          title={pageTitle}
          icon={activeItem?.icon || "⚙"}
          onBack={() => setActiveSection("overview")}
        />
      )}
    </AdminLayout>
  );
}
