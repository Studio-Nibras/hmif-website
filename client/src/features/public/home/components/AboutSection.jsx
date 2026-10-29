export default function AboutSection() {
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
