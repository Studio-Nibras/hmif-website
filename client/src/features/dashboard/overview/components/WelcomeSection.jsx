import { Badge } from "../../../../components/ui";

export default function WelcomeSection({ admin }) {
  return (
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
  );
}
