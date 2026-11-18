import { Link } from "react-router-dom";
import logo from "../../assets/hmif-logo.webp";
import usePublicSettings from "../../features/public/settings/usePublicSettings";

const navigationLinks = [
  { label: "Beranda", href: "/" },
  { label: "Tentang HMIF", href: "/tentang" },
  { label: "Program Kerja", href: "/program-kerja" },
  { label: "Berita & Artikel", href: "/berita" },
  { label: "Kontak", href: "/kontak" },
];

const socialPlatforms = [
  { key: "instagram", label: "Instagram", icon: "◎" },
  { key: "facebook", label: "Facebook", icon: "f" },
  { key: "youtube", label: "YouTube", icon: "▶" },
  { key: "tiktok", label: "TikTok", icon: "♪" },
  { key: "linkedin", label: "LinkedIn", icon: "in" },
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
  const { settings } = usePublicSettings();

  const contact = settings?.contact || {};
  const social = settings?.social || {};
  const footer = settings?.footer || {};

  const availableSocials = socialPlatforms.filter(
    (platform) => social[platform.key],
  );

  const hasContact = contact.email || contact.phone || contact.address;

  return (
    <footer className="bg-hmif-teal-dark text-white">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-12 lg:px-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_1.2fr_1fr] lg:gap-10">
          <div className="max-w-sm">
            <Link
              to="/"
              className="inline-flex items-center gap-2 font-heading text-base font-extrabold tracking-wide"
            >
              <img src={logo} alt="" className="size-9 object-contain" />
              <span>
                HMIF UNIBA
                <span className="mt-0.5 block text-xs font-medium tracking-normal text-sky-100/70">
                  Himpunan Mahasiswa Informatika
                </span>
              </span>
            </Link>

            <p className="mt-4 text-sm leading-7 text-sky-100/70">
              {footer.description ||
                "Himpunan Mahasiswa Informatika UNIBA Surakarta."}
            </p>
          </div>

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

          <div>
            <h2 className="mb-4 text-sm font-bold text-white">
              Informasi Kontak
            </h2>

            {hasContact ? (
              <ul className="space-y-3 text-sm leading-6 text-sky-100/70">
                {contact.email && (
                  <li>
                    <a
                      href={`mailto:${contact.email}`}
                      className="transition-colors hover:text-white"
                    >
                      {contact.email}
                    </a>
                  </li>
                )}

                {contact.phone && (
                  <li>
                    <a
                      href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`}
                      className="transition-colors hover:text-white"
                    >
                      {contact.phone}
                    </a>
                  </li>
                )}

                {contact.address && <li>{contact.address}</li>}
              </ul>
            ) : (
              <p className="text-sm leading-6 text-sky-100/50">
                Informasi kontak belum tersedia.
              </p>
            )}
          </div>

          <div>
            <h2 className="mb-4 text-sm font-bold text-white">Ikuti Kami</h2>

            {availableSocials.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {availableSocials.map((platform) => (
                  <a
                    key={platform.key}
                    href={social[platform.key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={platform.label}
                    title={platform.label}
                    className="flex size-10 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-base font-bold text-white transition hover:border-hmif-cyan hover:bg-hmif-cyan hover:text-hmif-teal-dark"
                  >
                    {platform.icon}
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-sm leading-6 text-sky-100/50">
                Media sosial belum tersedia.
              </p>
            )}

            <Link
              to="/kontak"
              className="mt-5 inline-block text-sm font-semibold text-hmif-cyan transition-colors hover:text-white"
            >
              Lihat informasi kontak →
            </Link>
          </div>
        </div>

        <div className="mt-9 flex flex-col gap-3 border-t border-white/15 pt-5 text-xs leading-5 text-sky-100/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()}{" "}
            {footer.copyright_text || "HMIF UNIBA Surakarta."}
          </p>

          <Link to="/" className="transition-colors hover:text-white">
            Website Resmi HMIF UNIBA Surakarta
          </Link>
        </div>
      </div>
    </footer>
  );
}
