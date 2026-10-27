import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentAdmin, logoutAdmin } from "../auth/authService";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
          setError("Tidak dapat memuat sesi admin. Coba muat ulang halaman.");
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
    try {
      await logoutAdmin();
      navigate("/login", { replace: true });
    } catch {
      setError("Logout gagal. Periksa koneksi backend, lalu coba lagi.");
    }
  }

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-hmif-surface text-sm text-hmif-teal">
        Memeriksa sesi administrator...
      </main>
    );
  }

  if (!admin) {
    return (
      <main className="grid min-h-screen place-items-center bg-hmif-surface px-6 text-center text-sm text-slate-600">
        {error || "Mengalihkan ke halaman login..."}
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-hmif-surface">
      <header className="border-b border-hmif-navy/[0.08] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-2xl bg-hmif-teal font-heading text-xl font-extrabold text-white">
              H
            </div>
            <div>
              <p className="font-heading text-sm font-extrabold text-hmif-navy">
                HMIF UNIBA
              </p>
              <p className="mt-1 text-xs text-slate-500">Admin CMS</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-full border border-hmif-teal/20 px-5 py-2.5 text-sm font-bold text-hmif-teal transition hover:bg-hmif-teal hover:text-white"
          >
            Keluar
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
        <div className="overflow-hidden rounded-[2rem] bg-hmif-teal-dark p-7 text-white sm:p-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold text-hmif-cyan backdrop-blur-xl">
            <span className="size-2 rounded-full bg-hmif-cyan" />
            ADMINISTRATION PORTAL
          </span>

          <h1 className="mt-6 font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
            Selamat datang, {admin.name}.
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-sky-100/75 sm:text-base">
            Kelola konten dan informasi website resmi Himpunan Mahasiswa
            Informatika UNIBA Surakarta melalui satu tempat.
          </p>
        </div>

        {error && (
          <p role="alert" className="mt-5 text-sm text-hmif-error">
            {error}
          </p>
        )}

        <section className="mt-8 grid gap-5 md:grid-cols-2">
          <article className="rounded-3xl border border-hmif-navy/[0.06] bg-white p-7 shadow-[0_10px_30px_-5px_rgba(23,54,79,0.06)]">
            <p className="text-xs font-extrabold tracking-[0.15em] text-hmif-teal">
              ACCOUNT
            </p>
            <h2 className="mt-4 font-heading text-xl font-bold text-hmif-navy">
              Informasi administrator
            </h2>
            <p className="mt-3 break-words text-sm text-slate-500">
              {admin.email}
            </p>
            <div className="mt-6 inline-flex rounded-full bg-hmif-surface px-4 py-2 text-xs font-bold text-hmif-teal">
              Sesi aktif
            </div>
          </article>

          <article className="rounded-3xl border border-hmif-navy/[0.06] bg-white p-7 shadow-[0_10px_30px_-5px_rgba(23,54,79,0.06)]">
            <p className="text-xs font-extrabold tracking-[0.15em] text-hmif-teal">
              CONTENT MANAGEMENT
            </p>
            <h2 className="mt-4 font-heading text-xl font-bold text-hmif-navy">
              Pengelolaan website
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Dashboard ini menjadi fondasi untuk mengelola berita, program
              kerja, anggota organisasi, dan pengaturan website.
            </p>
          </article>
        </section>
      </div>
    </main>
  );
}
