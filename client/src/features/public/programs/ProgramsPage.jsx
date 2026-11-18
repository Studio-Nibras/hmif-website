import { useEffect, useState } from "react";
import { Button, Card, Loading } from "../../../components/ui";
import ProgramCard from "./components/ProgramCard";
import { getPublicPrograms } from "./programsService";

export default function ProgramsPage() {
  const [programs, setPrograms] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [loadedPage, setLoadedPage] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [error, setError] = useState("");

  const loading = loadedPage !== page;

  useEffect(() => {
    let active = true;

    getPublicPrograms(page)
      .then((result) => {
        if (!active) return;

        setPrograms(result.programs || []);
        setPagination(result.pagination || null);
        setError("");
        setLoadedPage(page);
      })
      .catch(() => {
        if (!active) return;

        setError("Program kerja belum dapat dimuat. Silakan coba lagi.");
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
            Program Kerja HMIF
          </p>

          <h1 className="mt-5 max-w-3xl font-heading text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Ide yang diwujudkan menjadi aksi.
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-sky-100/75 sm:text-base">
            Kenali berbagai program kerja Himpunan Mahasiswa Informatika
            UNIBA Surakarta beserta tujuan dan pelaksanaannya.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="mb-8">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-hmif-teal">
            Kegiatan dan pengembangan
          </p>

          <h2 className="mt-2 font-heading text-2xl font-extrabold text-hmif-navy sm:text-3xl">
            Daftar program kerja
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
            Informasi program kerja yang telah dipublikasikan secara resmi
            oleh HMIF UNIBA Surakarta.
          </p>
        </div>

        {loading ? (
          <Card className="grid min-h-52 place-items-center rounded-2xl">
            <Loading label="Memuat program kerja..." />
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
        ) : programs.length === 0 ? (
          <Card className="rounded-2xl border-dashed border-slate-300 px-6 py-16 text-center">
            <h3 className="font-heading text-lg font-extrabold text-hmif-navy">
              Belum ada program kerja
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Program kerja yang telah dipublikasikan akan tampil di halaman ini.
            </p>
          </Card>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {programs.map((program) => (
                <ProgramCard key={program.id} program={program} />
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
