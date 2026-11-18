import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Badge, Card, Loading } from "../../../components/ui";
import { getPublicProgramBySlug } from "./programsService";

const statusLabels = {
  planned: "Direncanakan",
  ongoing: "Sedang Berjalan",
  completed: "Selesai",
};

function formatDate(value) {
  if (!value) return null;

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function RelatedNewsCard({ article }) {
  return (
    <Card
      as="article"
      padding="none"
      className="group overflow-hidden rounded-2xl border-slate-200/80 transition hover:-translate-y-1 hover:shadow-lg"
    >
      <Link
        to={`/berita/${encodeURIComponent(article.slug)}`}
        className="block"
      >
        {article.cover_image ? (
          <div className="aspect-[16/9] overflow-hidden bg-hmif-surface">
            <img
              src={article.cover_image}
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
          {article.category_name && (
            <Badge className="bg-hmif-surface font-bold text-hmif-teal">
              {article.category_name}
            </Badge>
          )}

          <h3 className="mt-3 line-clamp-2 font-heading text-base font-extrabold text-hmif-navy transition group-hover:text-hmif-teal">
            {article.title}
          </h3>

          {article.excerpt && (
            <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">
              {article.excerpt}
            </p>
          )}

          <span className="mt-4 inline-flex text-sm font-extrabold text-hmif-teal">
            Baca berita →
          </span>
        </div>
      </Link>
    </Card>
  );
}

export default function ProgramDetailPage() {
  const { slug } = useParams();
  const [program, setProgram] = useState(null);
  const [loadedSlug, setLoadedSlug] = useState(null);
  const [error, setError] = useState("");

  const loading = loadedSlug !== slug;

  useEffect(() => {
    let active = true;

    getPublicProgramBySlug(slug)
      .then((result) => {
        if (!active) return;

        setProgram(result.program);
        setError("");
        setLoadedSlug(slug);
      })
      .catch((err) => {
        if (!active) return;

        setProgram(null);
        setError(
          err.status === 404
            ? "Program kerja tidak ditemukan atau belum dipublikasikan."
            : "Program kerja gagal dimuat. Periksa koneksi lalu coba lagi.",
        );
        setLoadedSlug(slug);
      });

    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-hmif-surface px-5 py-16 sm:px-8">
        <Card className="mx-auto grid min-h-64 max-w-4xl place-items-center rounded-3xl">
          <Loading label="Memuat detail program..." />
        </Card>
      </main>
    );
  }

  if (error || !program) {
    return (
      <main className="min-h-screen bg-hmif-surface px-5 py-16 sm:px-8">
        <Card className="mx-auto max-w-4xl rounded-3xl px-6 py-16 text-center">
          <h1 className="font-heading text-2xl font-extrabold text-hmif-navy">
            Program tidak tersedia
          </h1>

          <p className="mt-3 text-sm leading-7 text-slate-500">
            {error || "Program kerja tidak ditemukan."}
          </p>

          <Link
            to="/program-kerja"
            className="mt-6 inline-flex rounded-xl bg-hmif-teal px-5 py-3 text-sm font-bold text-white transition hover:bg-hmif-teal-dark"
          >
            Kembali ke program kerja
          </Link>
        </Card>
      </main>
    );
  }

  const relatedNews = program.related_news || [];

  return (
    <main className="min-h-screen bg-hmif-surface">
      <section className="relative overflow-hidden bg-gradient-to-br from-hmif-teal-dark via-hmif-teal to-hmif-navy px-5 pb-14 pt-32 text-white sm:px-8 sm:pb-20 sm:pt-36">
        <div className="pointer-events-none absolute -right-20 -top-28 size-80 rounded-full border-[50px] border-white/[0.05]" />

        <div className="relative mx-auto max-w-5xl">
          <Link
            to="/program-kerja"
            className="text-sm font-bold text-sky-100 transition hover:text-white"
          >
            ← Kembali ke program kerja
          </Link>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Badge className="bg-white/15 font-bold text-white">
              {statusLabels[program.status] || program.status}
            </Badge>

            {program.period && (
              <span className="text-sm font-semibold text-sky-100">
                Periode {program.period}
              </span>
            )}
          </div>

          <h1 className="mt-5 max-w-4xl font-heading text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            {program.name}
          </h1>

          {program.division_name && (
            <p className="mt-5 text-sm font-semibold text-sky-100">
              {program.division_name}
            </p>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
        <Card
          as="article"
          padding="none"
          className="overflow-hidden rounded-3xl border-slate-200/80"
        >
          {program.cover_image && (
            <img
              src={program.cover_image}
              alt=""
              className="max-h-[520px] w-full bg-hmif-surface object-cover"
            />
          )}

          <div className="p-6 sm:p-10">
            <h2 className="font-heading text-xl font-extrabold text-hmif-navy sm:text-2xl">
              Tentang Program
            </h2>

            <div className="mt-5 whitespace-pre-wrap break-words text-sm leading-8 text-slate-600 sm:text-base">
              {program.description || "Belum ada deskripsi program."}
            </div>

            {(program.pic_name ||
              program.start_date ||
              program.end_date ||
              program.period) && (
              <div className="mt-8 grid gap-4 border-t border-slate-100 pt-6 sm:grid-cols-2">
                {program.pic_name && (
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Penanggung Jawab
                    </p>
                    <p className="mt-2 text-sm font-bold text-hmif-navy">
                      {program.pic_name}
                    </p>
                  </div>
                )}

                {program.period && (
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Periode
                    </p>
                    <p className="mt-2 text-sm font-bold text-hmif-navy">
                      {program.period}
                    </p>
                  </div>
                )}

                {program.start_date && (
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Tanggal Mulai
                    </p>
                    <p className="mt-2 text-sm font-bold text-hmif-navy">
                      {formatDate(program.start_date)}
                    </p>
                  </div>
                )}

                {program.end_date && (
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Tanggal Selesai
                    </p>
                    <p className="mt-2 text-sm font-bold text-hmif-navy">
                      {formatDate(program.end_date)}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>

        <section className="mt-14">
          <div className="mb-7">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-hmif-teal">
              Dokumentasi & publikasi
            </p>

            <h2 className="mt-2 font-heading text-2xl font-extrabold text-hmif-navy sm:text-3xl">
              Berita terkait program
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-500">
              Informasi dan dokumentasi kegiatan yang berkaitan dengan program
              ini.
            </p>
          </div>

          {relatedNews.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedNews.map((article) => (
                <RelatedNewsCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <Card className="rounded-2xl border-dashed border-slate-300 px-6 py-12 text-center">
              <h3 className="font-heading text-lg font-extrabold text-hmif-navy">
                Belum ada berita terkait
              </h3>
              <p className="mt-2 text-sm leading-7 text-slate-500">
                Informasi kegiatan dari program ini akan ditampilkan di sini
                setelah dipublikasikan.
              </p>
            </Card>
          )}
        </section>
      </section>
    </main>
  );
}
