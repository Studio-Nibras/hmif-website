import heroImage from "../../../../assets/hero.png";
import CountUp from "./CountUp";
export default function HeroSection({ articleCount }) {
  return (
    <section
      id="beranda"
      className="relative isolate min-h-[690px] overflow-hidden bg-hmif-teal-dark text-white lg:min-h-[730px]"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_75%_40%,rgba(72,214,232,0.16),transparent_40%),linear-gradient(125deg,#003b4d_0%,#07536a_52%,#17364f_100%)]" />
      <div className="pointer-events-none absolute -right-28 top-28 -z-10 size-[420px] rounded-full border border-white/[0.07] sm:size-[560px]" />
      <div className="pointer-events-none absolute -right-12 top-44 -z-10 size-[320px] rounded-full border border-white/[0.07] sm:size-[440px]" />


      <div className="mx-auto grid min-h-[690px] max-w-7xl items-center gap-4 px-5 pb-14 pt-32 sm:px-8 lg:min-h-[730px] lg:grid-cols-[1.02fr_0.98fr] lg:gap-0 lg:pb-16 lg:pt-28">
        <div className="relative z-10 max-w-2xl py-8 lg:py-0">
          <div className="inline-flex items-center gap-2 rounded-full border border-hmif-cyan/25 bg-white/[0.06] px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-hmif-cyan sm:text-xs">
            <span className="size-2 rounded-full bg-hmif-cyan" />
            Himpunan Mahasiswa Informatika
          </div>

          <h1 className="mt-7 max-w-2xl font-heading text-4xl font-extrabold leading-[1.12] tracking-tight sm:text-5xl lg:text-[62px]">
            Bertumbuh,
            <br />
            Berkolaborasi,
            <br />
            <span className="text-hmif-cyan">Berinovasi.</span>
          </h1>

          <p className="mt-6 max-w-lg text-sm leading-7 text-sky-100/75 sm:text-base sm:leading-8">
            Rumah bagi mahasiswa Informatika untuk belajar, mengembangkan
            potensi, dan menciptakan dampak melalui teknologi.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#tentang"
              className="rounded-xl bg-hmif-cyan px-5 py-3.5 text-sm font-extrabold text-hmif-teal-dark transition hover:-translate-y-0.5 hover:bg-white"
            >
              Kenali HMIF <span aria-hidden="true">→</span>
            </a>
            <a
              href="#berita"
              className="rounded-xl border border-white/20 bg-white/[0.04] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
            >
              Jelajahi Berita
            </a>
          </div>

          <div className="mt-10 flex items-center gap-3 text-xs text-sky-100/60">
            <span className="flex -space-x-2">
              <span className="grid size-8 place-items-center rounded-full border-2 border-hmif-teal-dark bg-hmif-cyan font-extrabold text-hmif-teal-dark">
                H
              </span>
              <span className="grid size-8 place-items-center rounded-full border-2 border-hmif-teal-dark bg-sky-200 font-extrabold text-hmif-teal-dark">
                I
              </span>
              <span className="grid size-8 place-items-center rounded-full border-2 border-hmif-teal-dark bg-white font-extrabold text-hmif-teal-dark">
                F
              </span>
            </span>
            <span>Belajar bersama. Berkarya bersama.</span>
          </div>
        </div>

        <div className="relative mx-auto flex min-h-[360px] w-full max-w-xl items-end justify-center lg:min-h-[540px]">
          <div className="pointer-events-none absolute bottom-4 left-1/2 size-64 -translate-x-1/2 rounded-full bg-hmif-cyan/15 blur-3xl sm:size-80" />

          <img
            src={heroImage}
            alt="Representasi mahasiswa Informatika"
            className="relative z-10 max-h-[470px] w-auto max-w-full animate-[hero-float_6s_ease-in-out_infinite] object-contain drop-shadow-2xl sm:max-h-[520px] lg:max-h-[590px]"
          />

          <div className="absolute left-0 top-12 z-20 max-w-[190px] animate-[hero-float_5s_ease-in-out_infinite] rounded-2xl border border-white/15 bg-white/10 p-4 shadow-xl backdrop-blur-xl sm:left-2 sm:top-20">
            <p className="text-[10px] font-bold uppercase tracking-wider text-sky-100/70">
              Fokus Kami
            </p>
            <p className="mt-2 font-heading text-sm font-extrabold text-white">
              Teknologi untuk masa depan
            </p>
            <div className="mt-3 flex gap-1">
              <span className="h-1.5 w-8 rounded-full bg-hmif-cyan" />
              <span className="h-1.5 w-4 rounded-full bg-white/30" />
              <span className="h-1.5 w-4 rounded-full bg-white/30" />
            </div>
          </div>

          <div className="absolute bottom-12 right-0 z-20 w-[180px] animate-[hero-float_7s_ease-in-out_infinite] rounded-2xl border border-white/15 bg-white/10 p-4 shadow-xl backdrop-blur-xl sm:right-1 sm:w-[205px] lg:bottom-16">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-sky-100/80">
                Publikasi HMIF
              </span>
              <span className="text-hmif-cyan">↗</span>
            </div>
            <p className="mt-2 font-heading text-3xl font-extrabold text-white">
              <CountUp target={articleCount} suffix="+" />
            </p>
            <p className="mt-1 text-[10px] leading-5 text-sky-100/60">
              Artikel yang telah diterbitkan
            </p>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-10 rounded-t-[28px] bg-hmif-surface sm:h-14 sm:rounded-t-[40px]" />
    </section>
  );
}
