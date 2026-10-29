import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Badge, Card, Loading } from "../../../components/ui";
import { getPublicNewsBySlug } from "./publicNewsService";

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
  const [loadedSlug, setLoadedSlug] = useState(null);
  const loading = loadedSlug !== slug;
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getPublicNewsBySlug(slug)
      .then((result) => {
        if (!active) return;

        setArticle(result.article);
        setError("");
        setLoadedSlug(slug);
      })
      .catch((err) => {
        if (!active) return;

        setArticle(null);
        setError(
          err.status === 404
            ? "Berita tidak ditemukan atau belum dipublikasikan."
            : "Berita gagal dimuat. Periksa koneksi lalu coba lagi.",
        );
        setLoadedSlug(slug);
      });

    return () => {
      active = false;
    };
  }, [slug]);

  return (
    <main className="min-h-screen bg-hmif-surface">
      <section className="mx-auto max-w-4xl px-5 py-10 sm:px-8 sm:py-16">
        {loading ? (
          <Card className="grid min-h-64 place-items-center rounded-3xl">
            <Loading label="Memuat artikel..." />
          </Card>
        ) : error ? (
          <Card className="rounded-3xl px-6 py-16 text-center">
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
          </Card>
        ) : article ? (
          <Card
            as="article"
            padding="none"
            className="overflow-hidden rounded-3xl border-slate-200/80"
          >
            <div className="px-6 pb-7 pt-8 sm:px-10 sm:pt-10">
              <Link
                to="/berita"
                className="text-sm font-bold text-hmif-teal hover:underline"
              >
                ← Kembali ke berita
              </Link>

              <div className="mt-7 flex flex-wrap items-center gap-3 text-xs">
                <Badge className="bg-hmif-surface font-extrabold text-hmif-teal">
                  {article.category_name}
                </Badge>
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
          </Card>
        ) : null}
      </section>
    </main>
  );
}
