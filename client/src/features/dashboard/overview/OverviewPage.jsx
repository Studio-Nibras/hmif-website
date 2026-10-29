
import { Badge, Card } from "../../../components/ui";

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

export default function OverviewPage({ admin }) {
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
