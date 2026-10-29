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

export default function ProgramsSection() {
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
