
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPublicNews } from "../dashboard/publicNewsService";

function formatDate(value) {
  if (!value) return "Tanggal tidak tersedia";

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function NewsCard({ article }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-hmif-navy/5">
      <Link
        to={`/berita/${encodeURIComponent(article.slug)}`}
        className="block"
        aria-label={`Baca berita ${article.title}`}
      >
        <div className="aspect-[16/10] overflow-hidden bg-hmif-surface">
          {article.cover_image ? (
            <img
              src={article.cover_image}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="grid h-full place-items-center bg-gradient-to-br from-hmif-teal to-hmif-navy">
              <span className="font-heading text-5xl font-extrabold text-white/80">
                H
              </span>
            </div>
          )}
        </div>

        <div className="p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-full bg-hmif-surface px-3 py-1.5 font-bold text-hmif-teal">
              {article.category_name}
            </span>
            <span className="text-slate-400">
              {formatDate(article.published_at)}
            </span>
          </div>

          <h2 className="mt-4 line-clamp-2 font-heading text-lg font-extrabold leading-snug text-hmif-navy transition group-hover:text-hmif-teal">
            {article.title}
          </h2>

          <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-500">
            {article.excerpt || "Baca informasi selengkapnya dalam artikel ini."}
          </p>

          <span className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-hmif-teal">
            Baca selengkapnya <span aria-hidden="true">→</span>
          </span>
        </div>
      </Link>
    </article>
  );
}

export default function PublicNewsPage() {
  const [articles, setArticles] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    setLoading(true);
    setError("");

    getPublicNews(page)
      .then((result) => {
        if (!active) return;
        setArticles(result.articles || []);
        setPagination(result.pagination || null);
      })
      .catch(() => {
        if (active) {
          setError("Berita belum dapat dimuat. Silakan coba lagi.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [page]);

  return (
    <main className="min-h-screen bg-hmif-surface">
      <header className="border-b border-white/10 bg-hmif-teal-dark text-white">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <Link to="/" className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-2xl bg-white/10 font-heading text-xl font-extrabold">
              H
            </span>
            <span>
              <span className="block font-heading text-sm font-extrabold">
                HMIF UNIBA
              </span>
              <span className="mt-1 block text-xs text-sky-100/70">
                Himpunan Mahasiswa Informatika
              </span>
            </span>
          </Link>

          <Link
            to="/login"
            className="rounded-xl border border-white/20 px-4 py-2.5 text-sm font-bold transition hover:bg-white/10"
          >
            Admin
          </Link>
        </nav>
      </header>

      <section className="relative overflow-hidden bg-gradient-to-br from-hmif-teal-dark via-hmif-teal to-hmif-navy px-5 py-16 text-white sm:px-8 sm:py-24">
        <div className="pointer-events-none absolute -right-20 -top-28 size-80 rounded-full border-[50px] border-white/[0.05]" />
        <div className="pointer-events-none absolute -bottom-32 left-1/3 size-72 rounded-full bg-hmif-cyan/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-hmif-cyan">
            Informasi & Publikasi
          </p>
          <h1 className="mt-5 max-w-3xl font-heading text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Cerita, kegiatan, dan kabar terbaru HMIF.
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-sky-100/75 sm:text-base">
            Ikuti informasi kegiatan, prestasi, pengumuman, dan perkembangan
            Himpunan Mahasiswa Informatika UNIBA Surakarta.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-hmif-teal">
              Dari HMIF untuk kamu
            </p>
            <h2 className="mt-2 font-heading text-2xl font-extrabold text-hmif-navy sm:text-3xl">
              Berita terbaru
            </h2>
          </div>
          <p className="text-sm text-slate-500">
            Informasi resmi HMIF UNIBA Surakarta
          </p>
        </div>

        {loading ? (
          <div className="grid min-h-52 place-items-center rounded-2xl border border-slate-200 bg-white">
            <div className="text-center">
              <div className="mx-auto size-9 animate-spin rounded-full border-4 border-hmif-teal/15 border-t-hmif-teal" />
              <p className="mt-4 text-sm font-semibold text-slate-500">
                Memuat berita...
              </p>
            </div>
          </div>
        ) : error ? (
          <div
            role="alert"
            className="rounded-2xl border border-red-200 bg-white p-8 text-center text-sm text-red-700"
          >
            {error}
            <button
              type="button"
              onClick={() => setPage((current) => current)}
              className="ml-2 font-extrabold underline"
            >
              Coba lagi
            </button>
          </div>
        ) : articles.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <h3 className="font-heading text-lg font-extrabold text-hmif-navy">
              Belum ada berita
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Berita yang telah dipublikasikan akan tampil di halaman ini.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>

            {pagination && pagination.totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-4">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((current) => current - 1)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-hmif-teal transition hover:bg-hmif-surface disabled:opacity-40"
                >
                  ← Sebelumnya
                </button>
                <span className="text-sm font-semibold text-slate-500">
                  {page} / {pagination.totalPages}
                </span>
                <button
                  type="button"
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage((current) => current + 1)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-hmif-teal transition hover:bg-hmif-surface disabled:opacity-40"
                >
                  Berikutnya →
                </button>
              </div>
            )}
          </>
        )}
      </section>

      <footer className="border-t border-slate-200 bg-white px-5 py-7 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} HMIF UNIBA Surakarta. Seluruh hak cipta
        dilindungi.
      </footer>
    </main>
  );
}
