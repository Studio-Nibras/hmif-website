
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getPublicNewsBySlug } from "../dashboard/publicNewsService";

function formatDate(value) {
  if (!value) return "Tanggal tidak tersedia";

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export default function PublicNewsDetailPage() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    setLoading(true);
    setArticle(null);
    setError("");

    getPublicNewsBySlug(slug)
      .then((result) => {
        if (active) setArticle(result.article);
      })
      .catch((err) => {
        if (active) {
          setError(
            err.status === 404
              ? "Berita tidak ditemukan atau belum dipublikasikan."
              : "Berita gagal dimuat. Periksa koneksi lalu coba lagi.",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [slug]);

  return (
    <main className="min-h-screen bg-hmif-surface">
      <header className="bg-hmif-teal-dark text-white">
        <nav className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <Link to="/" className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-white/10 font-heading text-lg font-extrabold">
              H
            </span>
            <span className="font-heading text-sm font-extrabold">
              HMIF UNIBA
            </span>
          </Link>

          <Link
            to="/berita"
            className="text-sm font-bold text-sky-100 transition hover:text-white"
          >
            ← Semua berita
          </Link>
        </nav>
      </header>

      <section className="mx-auto max-w-4xl px-5 py-10 sm:px-8 sm:py-16">
        {loading ? (
          <div className="grid min-h-64 place-items-center rounded-3xl bg-white">
            <div className="text-center">
              <div className="mx-auto size-9 animate-spin rounded-full border-4 border-hmif-teal/15 border-t-hmif-teal" />
              <p className="mt-4 text-sm font-semibold text-slate-500">
                Memuat artikel...
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center">
            <h1 className="font-heading text-2xl font-extrabold text-hmif-navy">
              Artikel tidak tersedia
            </h1>
            <p className="mt-3 text-sm leading-7 text-slate-500">{error}</p>
            <Link
              to="/berita"
              className="mt-6 inline-flex rounded-xl bg-hmif-teal px-5 py-3 text-sm font-bold text-white transition hover:bg-hmif-teal-dark"
            >
              Kembali ke berita
            </Link>
          </div>
        ) : article ? (
          <article className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
            <div className="px-6 pb-7 pt-8 sm:px-10 sm:pt-10">
              <Link
                to="/berita"
                className="text-sm font-bold text-hmif-teal hover:underline"
              >
                ← Kembali ke berita
              </Link>

              <div className="mt-7 flex flex-wrap items-center gap-3 text-xs">
                <span className="rounded-full bg-hmif-surface px-3 py-1.5 font-extrabold text-hmif-teal">
                  {article.category_name}
                </span>
                <span className="text-slate-400">
                  {formatDate(article.published_at)}
                </span>
              </div>

              <h1 className="mt-5 font-heading text-3xl font-extrabold leading-tight tracking-tight text-hmif-navy sm:text-4xl">
                {article.title}
              </h1>

              {article.excerpt && (
                <p className="mt-5 text-base leading-8 text-slate-500">
                  {article.excerpt}
                </p>
              )}

              {article.author_name && (
                <p className="mt-5 text-sm font-bold text-hmif-teal">
                  Oleh {article.author_name}
                </p>
              )}
            </div>

            {article.cover_image && (
              <img
                src={article.cover_image}
                alt=""
                className="max-h-[520px] w-full bg-hmif-surface object-cover"
              />
            )}

            <div className="px-6 py-8 sm:px-10 sm:py-10">
              <div className="whitespace-pre-wrap break-words text-sm leading-8 text-slate-600 sm:text-base">
                {article.content}
              </div>
            </div>
          </article>
        ) : null}

        <footer className="py-8 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} HMIF UNIBA Surakarta
        </footer>
      </section>
    </main>
  );
}
