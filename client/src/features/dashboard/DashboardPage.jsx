import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge, Button, Card, Loading } from "../../components/ui";
import { getCurrentAdmin, logoutAdmin } from "../auth/authService";
import NewsPage from "./NewsPage";

const navigation = [
  { label: "Overview", icon: "◫", section: "overview" },
  { label: "Berita", icon: "▤", section: "news" },
  { label: "Program Kerja", icon: "▦", section: "programs" },
  { label: "Organisasi", icon: "♧", section: "organization" },
];

const contentStats = [
  {
    label: "Total Berita",
    value: "—",
    detail: "Artikel dalam sistem",
    icon: "▤",
    color: "bg-sky-50 text-sky-700",
  },
  {
    label: "Program Kerja",
    value: "—",
    detail: "Program dan kegiatan",
    icon: "▦",
    color: "bg-violet-50 text-violet-700",
  },
  {
    label: "Publikasi",
    value: "—",
    detail: "Konten yang diterbitkan",
    icon: "↗",
    color: "bg-emerald-50 text-emerald-700",
  },
  {
    label: "Draft",
    value: "—",
    detail: "Konten belum diterbitkan",
    icon: "◷",
    color: "bg-amber-50 text-amber-700",
  },
];

function InitialAvatar({ name }) {
  const initials = (name || "Admin")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-hmif-teal text-sm font-extrabold text-white">
      {initials}
    </div>
  );
}

function Sidebar({ activeSection, onNavigate, onLogout, admin, loggingOut }) {
  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-slate-200 bg-white lg:sticky lg:top-0 lg:h-screen lg:w-[258px] lg:border-r lg:border-b-0">
      <div className="flex items-center gap-3 px-5 py-5 lg:px-6 lg:py-7">
        <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-hmif-teal font-heading text-xl font-extrabold text-white shadow-lg shadow-hmif-teal/15">
          H
        </div>
        <div className="min-w-0">
          <p className="font-heading text-sm font-extrabold tracking-tight text-hmif-navy">
            HMIF UNIBA
          </p>
          <p className="mt-1 text-xs text-slate-500">Content Management</p>
        </div>
      </div>

      <div className="hidden px-6 pb-3 pt-2 lg:block">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-400">
          Workspace
        </p>
      </div>

      <nav
        aria-label="Navigasi dashboard"
        className="flex gap-1 overflow-x-auto px-4 pb-4 lg:flex-1 lg:flex-col lg:overflow-visible lg:px-3"
      >
        {navigation.map((item) => {
          const active = activeSection === item.section;

          return (
            <Button
              key={item.section}
              type="button"
              onClick={() => onNavigate(item.section)}
              aria-current={active ? "page" : undefined}
              variant="ghost"
              className={`flex shrink-0 items-center justify-start gap-3 rounded-xl px-4 py-3 text-left text-sm font-bold transition ${
                active
                  ? "bg-hmif-teal text-white shadow-md shadow-hmif-teal/15"
                  : "text-slate-500 hover:bg-slate-50 hover:text-hmif-teal"
              }`}
            >
              <span className="grid size-6 place-items-center text-lg">
                {item.icon}
              </span>
              {item.label}
              {active && (
                <span className="ml-auto hidden size-1.5 rounded-full bg-hmif-cyan lg:block" />
              )}
            </Button>
          );
        })}

        <div className="hidden px-3 pb-1 pt-7 lg:block">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-400">
            System
          </p>
        </div>

        <Button
          type="button"
          onClick={() => onNavigate("settings")}
          variant="ghost"
          className={`flex shrink-0 items-center justify-start gap-3 rounded-xl px-4 py-3 text-left text-sm font-bold transition ${
            activeSection === "settings"
              ? "bg-hmif-teal text-white"
              : "text-slate-500 hover:bg-slate-50 hover:text-hmif-teal"
          }`}
        >
          <span className="grid size-6 place-items-center text-lg">⚙</span>
          Pengaturan Website
        </Button>
      </nav>

      <div className="hidden border-t border-slate-100 p-4 lg:block">
        <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
          <InitialAvatar name={admin?.name} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-hmif-navy">
              {admin?.name || "Administrator"}
            </p>
            <p className="truncate text-xs text-slate-500">Administrator</p>
          </div>
          <Button
            type="button"
            onClick={onLogout}
            disabled={loggingOut}
            title="Keluar"
            aria-label="Keluar"
            variant="ghost"
            size="sm"
            className="size-9 shrink-0 rounded-xl px-0 text-slate-400 hover:bg-red-50 hover:text-red-600"
          >
            ↗
          </Button>
        </div>
      </div>
    </aside>
  );
}

function StatCard({ stat }) {
  return (
    <Card
      as="article"
      className="rounded-2xl border-slate-200/80 p-5 shadow-slate-900/[0.02] transition hover:-translate-y-0.5 hover:shadow-md sm:p-6"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold text-slate-500">{stat.label}</p>
        <span
          className={`grid size-10 place-items-center rounded-xl text-xl font-bold ${stat.color}`}
        >
          {stat.icon}
        </span>
      </div>
      <p className="mt-5 font-heading text-3xl font-extrabold tracking-tight text-hmif-navy">
        {stat.value}
      </p>
      <p className="mt-2 text-xs text-slate-400">{stat.detail}</p>
    </Card>
  );
}

function Overview({ admin }) {
  return (
    <>
      <section className="relative overflow-hidden rounded-3xl bg-hmif-teal-dark p-6 text-white sm:p-8 lg:p-10">
        <div className="pointer-events-none absolute -right-16 -top-24 size-64 rounded-full border-[40px] border-white/[0.04]" />
        <div className="pointer-events-none absolute -bottom-32 right-32 size-64 rounded-full bg-hmif-cyan/[0.08] blur-3xl" />

        <div className="relative max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-3 py-1.5 text-[10px] font-extrabold tracking-[0.17em] text-hmif-cyan">
            <span className="size-1.5 rounded-full bg-hmif-cyan" />
            ADMINISTRATION PORTAL
          </span>

          <h2 className="mt-5 font-heading text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl lg:text-4xl">
            Selamat datang, {admin?.name || "Admin"}!
          </h2>

          <p className="mt-3 max-w-xl text-sm leading-7 text-sky-100/75">
            Kelola berita, program kerja, dan informasi organisasi HMIF UNIBA
            Surakarta melalui satu dashboard.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-sky-100/70">
            <Badge className="gap-2 bg-white/10 px-3 py-2 text-sky-100/70">
              <span className="size-2 rounded-full bg-emerald-400" />
              Sesi administrator aktif
            </Badge>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-4">
          <h2 className="font-heading text-lg font-extrabold text-hmif-navy">
            Ringkasan Konten
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Ikhtisar pengelolaan website HMIF.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {contentStats.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-5 xl:grid-cols-[1.45fr_1fr]">
        <Card as="article" className="rounded-2xl p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-heading text-base font-extrabold text-hmif-navy">
                Aktivitas Publikasi
              </h2>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Area visualisasi statistik konten website.
              </p>
            </div>
            <span className="rounded-lg bg-slate-50 px-3 py-2 text-xs font-bold text-slate-500">
              Overview
            </span>
          </div>

          <div className="mt-7 flex min-h-44 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-5 text-center">
            <div className="grid size-12 place-items-center rounded-2xl bg-white text-2xl text-hmif-teal shadow-sm">
              ↗
            </div>
            <p className="mt-3 text-sm font-bold text-hmif-navy">
              Statistik segera tersedia
            </p>
            <p className="mt-1 max-w-xs text-xs leading-5 text-slate-500">
              Grafik akan menampilkan data publikasi setelah modul konten
              terhubung ke database.
            </p>
          </div>
        </Card>

        <Card as="article" className="rounded-2xl p-5 sm:p-6">
          <h2 className="font-heading text-base font-extrabold text-hmif-navy">
            Langkah Selanjutnya
          </h2>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Lanjutkan pengembangan CMS HMIF.
          </p>

          <div className="mt-5 space-y-4">
            {[
              {
                number: "01",
                title: "Bangun modul berita",
                detail: "Tambah, edit, dan kelola publikasi.",
              },
              {
                number: "02",
                title: "Kelola program kerja",
                detail: "Simpan informasi kegiatan HMIF.",
              },
              {
                number: "03",
                title: "Atur website publik",
                detail: "Kelola hero, CTA, dan informasi utama.",
              },
            ].map((item) => (
              <div key={item.number} className="flex gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-hmif-surface text-xs font-extrabold text-hmif-teal">
                  {item.number}
                </span>
                <div className="min-w-0 pt-0.5">
                  <p className="text-sm font-bold text-hmif-navy">
                    {item.title}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {item.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <footer className="mt-8 flex flex-col gap-2 border-t border-slate-200 py-5 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
        <p>HMIF UNIBA Surakarta · Content Management System</p>
        <p>Admin workspace</p>
      </footer>
    </>
  );
}

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
    <main className="min-h-screen bg-hmif-surface lg:flex">
      <Sidebar
        activeSection={activeSection}
        onNavigate={setActiveSection}
        onLogout={handleLogout}
        admin={admin}
        loggingOut={loggingOut}
      />

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
          <div className="flex min-h-[76px] items-center justify-between gap-4 px-5 sm:px-8 lg:px-10">
            <div>
              <p className="text-xs font-semibold text-slate-400">
                HMIF UNIBA / Admin
              </p>
              <h1 className="mt-1 font-heading text-lg font-extrabold text-hmif-navy">
                {pageTitle}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-bold text-hmif-navy">{admin.name}</p>
                <p className="mt-0.5 text-xs text-slate-500">Administrator</p>
              </div>
              <InitialAvatar name={admin.name} />
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-[1600px] px-5 py-7 sm:px-8 sm:py-9 lg:px-10">
          {error && (
            <Card
              padding="sm"
              role="alert"
              className="mb-6 flex items-start justify-between gap-4 rounded-xl border-red-200 bg-red-50 text-sm text-red-700"
            >
              <p>{error}</p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setError("")}
                aria-label="Tutup pesan"
                className="font-bold"
              >
                ×
              </Button>
            </Card>
          )}

          {activeSection === "overview" ? (
            <Overview admin={admin} />
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
                Modul ini akan kita implementasikan berikutnya. Layout dashboard
                dan autentikasi admin tetap aktif.
              </p>
              <Button
                onClick={() => setActiveSection("overview")}
                className="mt-6"
              >
                Kembali ke overview
              </Button>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}
