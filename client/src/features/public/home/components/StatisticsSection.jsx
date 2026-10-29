import CountUp from "./CountUp";
export default function StatisticsSection({ articleCount }) {
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
