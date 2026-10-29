import { Link } from "react-router-dom";

const navigationLinks = [
  { label: "Beranda", href: "/" },
  { label: "Tentang Kami", href: "/#tentang" },
  { label: "Program Kerja", href: "/#program" },
  { label: "Berita & Artikel", href: "/berita" },
  { label: "Kontak", href: "/#kontak" },
];

const divisionLinks = [
  { label: "Pengembangan Organisasi", href: "#divisi-organisasi" },
  { label: "Komunikasi & Informasi", href: "#divisi-kominfo" },
  { label: "Pendidikan & Keilmuan", href: "#divisi-keilmuan" },
  { label: "Minat & Bakat", href: "#divisi-minat-bakat" },
  { label: "Kewirausahaan", href: "#divisi-kewirausahaan" },
];

function FooterLink({ href, children }) {
  const className =
    "text-sm leading-6 text-sky-100/70 transition-colors hover:text-white";

  if (href.startsWith("/")) {
    return (
      <Link to={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}

export default function Footer() {
  return (
    <footer className="bg-hmif-teal-dark text-white">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-12 lg:px-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-[1.5fr_0.8fr_0.9fr_1fr] lg:gap-10">
          {/* Identitas HMIF */}
          <div className="max-w-sm">
            <Link
              to="/"
              className="inline-flex items-center gap-2 font-heading text-base font-extrabold tracking-wide"
            >
              <span className="flex size-9 items-center justify-center rounded-full border border-white/30 text-xs">
                HIF
              </span>
              <span>
                HMIF UNIBA
                <span className="mt-0.5 block text-xs font-medium tracking-normal text-sky-100/70">
                  Himpunan Mahasiswa Informatika
                </span>
              </span>
            </Link>

            <p className="mt-4 text-sm leading-7 text-sky-100/70">
              Himpunan mahasiswa yang menjadi wadah pengembangan potensi,
              kreativitas, dan kolaborasi mahasiswa Informatika untuk
              menciptakan inovasi serta memberikan dampak positif bagi
              lingkungan sekitar.
            </p>
          </div>

          {/* Navigasi */}
          <div>
            <h2 className="mb-4 text-sm font-bold text-white">
              Navigasi Cepat
            </h2>

            <ul className="space-y-2">
              {navigationLinks.map((item) => (
                <li key={item.label}>
                  <FooterLink href={item.href}>{item.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Divisi */}
          <div>
            <h2 className="mb-4 text-sm font-bold text-white">Divisi HMIF</h2>

            <ul className="space-y-2">
              {divisionLinks.map((item) => (
                <li key={item.label}>
                  <FooterLink href={item.href}>{item.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Sekretariat */}
          <div>
            <h2 className="mb-4 text-sm font-bold text-white">
              Sekretariat & Alamat
            </h2>

            <div className="text-sm leading-6 text-sky-100/70">
              <p className="flex items-start gap-2.5">
                <svg
                  aria-hidden="true"
                  className="mt-1 size-4 shrink-0 text-hmif-cyan"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"
                  />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
                <span>
                  Universitas Islam Batik Surakarta Jl. KH. Agus Salim No.10,
                  Sondakan, Kec. Laweyan, Kota Surakarta, Jawa Tengah 57147
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="mt-9 flex flex-col gap-3 border-t border-white/15 pt-5 text-xs leading-5 text-sky-100/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} HMIF UNIBA Surakarta. Hak cipta
            dilindungi.
          </p>

          <Link to="/" className="transition-colors hover:text-white">
            Website Resmi HMIF UNIBA Surakarta
          </Link>
        </div>
      </div>
    </footer>
  );
}
