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

function RelatedProgramCard({ program }) {
  const statusLabels = {
    planned: "Direncanakan",
    ongoing: "Sedang Berjalan",
    completed: "Selesai",
  };

  return (
    <Card
      as="article"
      padding="none"
      className="group overflow-hidden rounded-2xl border-slate-200/80 transition hover:-translate-y-1 hover:shadow-lg"
    >
      <Link
        to={`/program-kerja/${encodeURIComponent(program.slug)}`}
        className="block"
      >
        {program.cover_image ? (
          <div className="aspect-[16/9] overflow-hidden bg-hmif-surface">
            <img
              src={program.cover_image}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          </div>
        ) : (
          <div className="grid aspect-[16/9] place-items-center bg-gradient-to-br from-hmif-teal to-hmif-navy">
            <span className="font-heading text-4xl font-extrabold text-white/80">
              H
            </span>
          </div>
        )}

        <div className="p-5">
          <div className="flex flex-wrap items-center gap-2">
            {program.status && (
              <Badge className="bg-hmif-surface font-bold text-hmif-teal">
                {statusLabels[program.status] || program.status}
              </Badge>
            )}

            {program.period && (
              <span className="text-xs font-semibold text-slate-400">
                {program.period}
              </span>
            )}
          </div>

          <h3 className="mt-3 line-clamp-2 font-heading text-base font-extrabold text-hmif-navy transition group-hover:text-hmif-teal">
            {program.name}
          </h3>

          <span className="mt-4 inline-flex text-sm font-extrabold text-hmif-teal">
            Lihat program →
          </span>
        </div>
      </Link>
    </Card>
  );
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
          <>
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

            {article.programs?.length > 0 && (
              <section className="mt-14">
                <div className="mb-7">
                  <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-hmif-teal">
                    Program kerja
                  </p>

                  <h2 className="mt-2 font-heading text-2xl font-extrabold text-hmif-navy sm:text-3xl">
                    Program terkait berita ini
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-slate-500">
                    Program kerja HMIF yang berkaitan dengan informasi atau
                    kegiatan dalam berita ini.
                  </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {article.programs.map((program) => (
                    <RelatedProgramCard key={program.id} program={program} />
                  ))}
                </div>
              </section>
            )}
          </>
        ) : null}
      </section>
    </main>
  );
}
