import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Badge, Button, Card, Loading } from "../../../components/ui";
import { getPublicNews } from "./publicNewsService";

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
    <Card
      as="article"
      padding="none"
      className="group overflow-hidden rounded-2xl border-slate-200/80 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-hmif-navy/5"
    >
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
            <Badge className="bg-hmif-surface font-bold text-hmif-teal">
              {article.category_name}
            </Badge>
            <span className="text-slate-400">
              {formatDate(article.published_at)}
            </span>
          </div>

          <h2 className="mt-4 line-clamp-2 font-heading text-lg font-extrabold leading-snug text-hmif-navy transition group-hover:text-hmif-teal">
            {article.title}
          </h2>

          <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-500">
            {article.excerpt ||
              "Baca informasi selengkapnya dalam artikel ini."}
          </p>

          <span className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-hmif-teal">
            Baca selengkapnya <span aria-hidden="true">→</span>
          </span>
        </div>
      </Link>
    </Card>
  );
}

export default function PublicNewsPage() {
  const [articles, setArticles] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [loadedPage, setLoadedPage] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const loading = loadedPage !== page;
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getPublicNews(page)
      .then((result) => {
        if (!active) return;

        setArticles(result.articles || []);
        setPagination(result.pagination || null);
        setError("");
        setLoadedPage(page);
      })
      .catch(() => {
        if (!active) return;

        setError("Berita belum dapat dimuat. Silakan coba lagi.");
        setLoadedPage(page);
      });

    return () => {
      active = false;
    };
  }, [page, retryCount]);

  return (
    <main className="min-h-screen bg-hmif-surface">
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
          <Card className="grid min-h-52 place-items-center rounded-2xl">
            <Loading label="Memuat berita..." />
          </Card>
        ) : error ? (
          <Card
            role="alert"
            className="rounded-2xl border-red-200 p-8 text-center text-sm text-red-700"
          >
            {error}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setLoadedPage(null);
                setRetryCount((current) => current + 1);
              }}
              className="ml-2 text-red-700 underline"
            >
              Coba lagi
            </Button>
          </Card>
        ) : articles.length === 0 ? (
          <Card className="rounded-2xl border-dashed border-slate-300 px-6 py-16 text-center">
            <h3 className="font-heading text-lg font-extrabold text-hmif-navy">
              Belum ada berita
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Berita yang telah dipublikasikan akan tampil di halaman ini.
            </p>
          </Card>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>

            {pagination && pagination.totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-4">
                <Button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((current) => current - 1)}
                  variant="secondary"
                  className="text-hmif-teal disabled:opacity-40"
                >
                  ← Sebelumnya
                </Button>
                <span className="text-sm font-semibold text-slate-500">
                  {page} / {pagination.totalPages}
                </span>
                <Button
                  type="button"
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage((current) => current + 1)}
                  variant="secondary"
                  className="text-hmif-teal disabled:opacity-40"
                >
                  Berikutnya →
                </Button>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
