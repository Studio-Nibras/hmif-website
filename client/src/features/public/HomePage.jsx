import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import heroImage from "../../assets/hero.png";
import { getPublicNews } from "../dashboard/publicNewsService";

const programs = [
  {
    number: "01",
    title: "Akademik & Keilmuan",
    description: "Ruang untuk belajar, berbagi pengetahuan, dan berkembang.",
  },
  {
    number: "02",
    title: "Pengembangan Mahasiswa",
    description: "Mendukung potensi, kreativitas, dan kompetensi mahasiswa.",
  },
  {
    number: "03",
    title: "Kolaborasi & Komunitas",
    description: "Membangun koneksi dan kolaborasi di lingkungan Informatika.",
  },
];

function CountUp({ target, suffix = "", duration = 1400 }) {
  const [value, setValue] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reducedMotion || target <= 0) {
      setValue(target);
      return;
    }

    let frame;
    let startTime;

    function animate(timestamp) {
      if (!startTime) startTime = timestamp;

      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);

      setValue(Math.round(target * eased));

      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    }

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [started, target, duration]);

  return (
    <span ref={ref} aria-label={`${target}${suffix}`}>
      {value.toLocaleString("id-ID")}
      {suffix}
    </span>
  );
}

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { label: "Beranda", href: "#beranda" },
    { label: "Tentang", href: "#tentang" },
    { label: "Program Kerja", href: "#program" },
    { label: "Berita", href: "#berita" },
  ];

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:py-7">
        <Link
          to="/"
          className="flex items-center gap-3"
          aria-label="HMIF UNIBA beranda"
        >
          <span className="grid size-10 place-items-center rounded-xl border border-white/20 bg-white/10 font-heading text-lg font-extrabold text-white backdrop-blur">
            H
          </span>
          <span>
            <span className="block font-heading text-sm font-extrabold tracking-wide text-white">
              HMIF UNIBA
            </span>
            <span className="mt-0.5 block text-[10px] font-semibold tracking-[0.12em] text-sky-100/70">
              INFORMATIKA
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-sky-100/80 transition hover:text-white"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#kontak"
            className="rounded-xl bg-white px-5 py-3 text-sm font-extrabold text-hmif-teal-dark transition hover:bg-hmif-cyan"
          >
            Hubungi Kami <span aria-hidden="true">↗</span>
          </a>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
          className="grid size-11 place-items-center rounded-xl border border-white/20 text-xl text-white md:hidden"
        >
          {menuOpen ? "×" : "☰"}
        </button>
      </nav>

      {menuOpen && (
        <div className="mx-5 rounded-2xl border border-white/10 bg-hmif-teal-dark/95 p-3 shadow-xl backdrop-blur-xl md:hidden">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block rounded-xl px-4 py-3 text-sm font-bold text-white transition hover:bg-white/10"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#kontak"
            onClick={() => setMenuOpen(false)}
            className="mt-2 block rounded-xl bg-white px-4 py-3 text-center text-sm font-extrabold text-hmif-teal-dark"
          >
            Hubungi Kami ↗
          </a>
        </div>
      )}
    </header>
  );
}

function Hero({ articleCount }) {
  return (
    <section
      id="beranda"
      className="relative isolate min-h-[690px] overflow-hidden bg-hmif-teal-dark text-white lg:min-h-[730px]"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_75%_40%,rgba(72,214,232,0.16),transparent_40%),linear-gradient(125deg,#003b4d_0%,#07536a_52%,#17364f_100%)]" />
      <div className="pointer-events-none absolute -right-28 top-28 -z-10 size-[420px] rounded-full border border-white/[0.07] sm:size-[560px]" />
      <div className="pointer-events-none absolute -right-12 top-44 -z-10 size-[320px] rounded-full border border-white/[0.07] sm:size-[440px]" />

      <Navbar />

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

function Statistics({ articleCount }) {
  const stats = [
    { target: 1, suffix: "", label: "Komunitas Informatika" },
    { target: 4, suffix: "", label: "Kategori Berita" },
    { target: articleCount, suffix: "", label: "Artikel Terpublikasi" },
  ];

  return (
    <section className="relative z-10 -mt-1 bg-hmif-surface px-5 pb-16 sm:px-8 sm:pb-20">
      <div className="mx-auto grid max-w-7xl gap-8 rounded-3xl bg-[#a9d2f4] px-6 py-8 text-hmif-navy sm:grid-cols-[1.1fr_1.9fr] sm:items-center sm:px-10 sm:py-10 lg:px-14">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-hmif-teal">
            HMIF dalam angka
          </p>
          <h2 className="mt-3 max-w-sm font-heading text-2xl font-extrabold leading-snug sm:text-3xl">
            Ruang tumbuh untuk generasi digital.
          </h2>
          <p className="mt-3 max-w-sm text-xs leading-6 text-hmif-navy/70">
            Mengenal organisasi dan mengikuti informasi yang diterbitkan HMIF.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 sm:gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-heading text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                <CountUp target={stat.target} suffix={stat.suffix} />
              </p>
              <p className="mx-auto mt-2 max-w-28 text-[10px] font-semibold leading-5 text-hmif-navy/65 sm:text-xs">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section
      id="tentang"
      className="scroll-mt-10 bg-hmif-surface px-5 py-16 sm:px-8 sm:py-24"
    >
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center lg:gap-20">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-hmif-teal">
            Tentang Kami
          </p>
          <h2 className="mt-4 font-heading text-3xl font-extrabold leading-tight tracking-tight text-hmif-navy sm:text-4xl lg:text-5xl">
            Lebih dari sekadar belajar teknologi.
          </h2>
        </div>

        <div>
          <p className="text-sm leading-8 text-slate-600 sm:text-base">
            HMIF UNIBA Surakarta merupakan ruang bagi mahasiswa Informatika
            untuk saling belajar, bertukar gagasan, dan mengembangkan potensi.
            Kami percaya bahwa kemajuan teknologi dimulai dari rasa ingin tahu,
            kolaborasi, dan kemauan untuk terus bertumbuh.
          </p>
          <a
            href="#program"
            className="mt-6 inline-flex items-center gap-2 text-sm font-extrabold text-hmif-teal transition hover:gap-3"
          >
            Kenali fokus kami <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>

      <div className="mx-auto mt-12 grid max-w-7xl gap-4 sm:grid-cols-3">
        {[
          {
            number: "01",
            title: "Kolaboratif",
            description: "Bertukar gagasan dan tumbuh bersama komunitas.",
          },
          {
            number: "02",
            title: "Adaptif",
            description: "Terus belajar menghadapi perkembangan teknologi.",
          },
          {
            number: "03",
            title: "Berdampak",
            description: "Mengubah pengetahuan menjadi karya yang bermanfaat.",
          },
        ].map((item) => (
          <article
            key={item.number}
            className="rounded-2xl border border-slate-200/80 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-hmif-navy/5 sm:p-7"
          >
            <span className="font-heading text-sm font-extrabold text-hmif-teal">
              {item.number}
            </span>
            <h3 className="mt-5 font-heading text-xl font-extrabold text-hmif-navy">
              {item.title}
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-500">
              {item.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ProgramSection() {
  return (
    <section
      id="program"
      className="scroll-mt-10 bg-white px-5 py-16 sm:px-8 sm:py-24"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-5 sm:grid-cols-[1fr_0.8fr] sm:items-end">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-hmif-teal">
              Program Kerja
            </p>
            <h2 className="mt-4 max-w-xl font-heading text-3xl font-extrabold leading-tight tracking-tight text-hmif-navy sm:text-4xl lg:text-5xl">
              Bergerak lewat ide dan aksi.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-slate-500 sm:justify-self-end">
            Berbagai ruang pengembangan untuk mendukung perjalanan mahasiswa
            Informatika.
          </p>
        </div>

        <div className="mt-10 border-t border-slate-200">
          {programs.map((program) => (
            <article
              key={program.number}
              className="group grid gap-3 border-b border-slate-200 py-6 transition sm:grid-cols-[64px_1fr_1fr_32px] sm:items-center sm:gap-6 sm:py-7"
            >
              <span className="font-heading text-sm font-extrabold text-hmif-teal/60">
                {program.number}
              </span>
              <h3 className="font-heading text-lg font-extrabold text-hmif-navy transition group-hover:text-hmif-teal sm:text-xl">
                {program.title}
              </h3>
              <p className="text-sm leading-6 text-slate-500">
                {program.description}
              </p>
              <span className="text-xl text-hmif-teal transition group-hover:translate-x-1">
                ↗
              </span>
            </article>
          ))}
        </div>

        <p className="mt-5 text-xs leading-6 text-slate-400">
          Daftar ini merupakan kategori pengembangan awal. Nama dan deskripsi
          program resmi perlu disesuaikan dengan data program kerja HMIF.
        </p>
      </div>
    </section>
  );
}

function NewsSection({ articles, loading, error }) {
  return (
    <section
      id="berita"
      className="scroll-mt-10 bg-hmif-surface px-5 py-16 sm:px-8 sm:py-24"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-hmif-teal">
              Kabar Terbaru
            </p>
            <h2 className="mt-4 font-heading text-3xl font-extrabold tracking-tight text-hmif-navy sm:text-4xl">
              Cerita dari HMIF.
            </h2>
          </div>
          <Link
            to="/berita"
            className="inline-flex items-center gap-2 text-sm font-extrabold text-hmif-teal hover:gap-3"
          >
            Semua berita <span aria-hidden="true">→</span>
          </Link>
        </div>

        {loading ? (
          <p className="py-12 text-sm text-slate-500">
            Memuat berita terbaru...
          </p>
        ) : error ? (
          <p className="py-12 text-sm text-red-600">{error}</p>
        ) : articles.length === 0 ? (
          <p className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-sm text-slate-500">
            Berita yang telah dipublikasikan akan tampil di sini.
          </p>
        ) : (
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {articles.slice(0, 3).map((article) => (
              <article
                key={article.id}
                className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white transition hover:-translate-y-1 hover:shadow-xl hover:shadow-hmif-navy/5"
              >
                <Link to={`/berita/${encodeURIComponent(article.slug)}`}>
                  <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                    {article.cover_image ? (
                      <img
                        src={article.cover_image}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="grid h-full place-items-center bg-hmif-teal-dark font-heading text-4xl font-extrabold text-white">
                        H
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <span className="text-xs font-extrabold text-hmif-teal">
                      {article.category_name}
                    </span>
                    <h3 className="mt-3 line-clamp-2 font-heading text-lg font-extrabold leading-snug text-hmif-navy group-hover:text-hmif-teal">
                      {article.title}
                    </h3>
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">
                      {article.excerpt}
                    </p>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section
      id="kontak"
      className="scroll-mt-10 bg-hmif-surface px-5 pb-16 sm:px-8 sm:pb-24"
    >
      <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-br from-hmif-teal-dark to-hmif-teal px-6 py-10 text-white sm:px-10 sm:py-14 lg:px-14">
        <div className="grid gap-7 sm:grid-cols-[1fr_auto] sm:items-center">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-hmif-cyan">
              Mari Terhubung
            </p>
            <h2 className="mt-4 max-w-2xl font-heading text-3xl font-extrabold leading-tight sm:text-4xl">
              Punya ide? Mari bertumbuh bersama.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-sky-100/75">
              Ikuti informasi dan publikasi terbaru dari HMIF UNIBA Surakarta.
            </p>
          </div>
          <Link
            to="/berita"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-extrabold text-hmif-teal-dark transition hover:bg-hmif-cyan"
          >
            Jelajahi berita <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-hmif-teal-dark px-5 py-8 text-white sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link to="/" className="font-heading text-sm font-extrabold">
          HMIF UNIBA
        </Link>
        <p className="text-xs text-sky-100/60">
          © {new Date().getFullYear()} HMIF UNIBA Surakarta
        </p>
        <div className="flex gap-5 text-xs font-semibold text-sky-100/70">
          <Link to="/berita" className="hover:text-white">
            Berita
          </Link>
          <a href="#tentang" className="hover:text-white">
            Tentang
          </a>
          <a href="#kontak" className="hover:text-white">
            Kontak
          </a>
        </div>
      </div>
    </footer>
  );
}

export default function HomePage() {
  const [articles, setArticles] = useState([]);
  const [articleCount, setArticleCount] = useState(0);
  const [loadingNews, setLoadingNews] = useState(true);
  const [newsError, setNewsError] = useState("");

  useEffect(() => {
    let active = true;

    getPublicNews(1, 3)
      .then((result) => {
        if (!active) return;
        setArticles(result.articles || []);
        setArticleCount(result.pagination?.total || 0);
      })
      .catch(() => {
        if (active) setNewsError("Berita terbaru belum dapat dimuat.");
      })
      .finally(() => {
        if (active) setLoadingNews(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <Hero articleCount={articleCount} />
      <Statistics articleCount={articleCount} />
      <AboutSection />
      <ProgramSection />
      <NewsSection
        articles={articles}
        loading={loadingNews}
        error={newsError}
      />
      <ContactSection />
      <Footer />
    </>
  );
}
