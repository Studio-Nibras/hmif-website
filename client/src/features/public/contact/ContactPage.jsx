import usePublicSettings from "../settings/usePublicSettings";

const socialPlatforms = [
  { key: "instagram", label: "Instagram" },
  { key: "facebook", label: "Facebook" },
  { key: "youtube", label: "YouTube" },
  { key: "tiktok", label: "TikTok" },
  { key: "linkedin", label: "LinkedIn" },
];

function ContactCard({ icon, title, children }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-hmif-teal/10 text-xl text-hmif-teal">
        {icon}
      </div>
      <h2 className="font-heading text-lg font-bold text-hmif-navy">{title}</h2>
      <div className="mt-2 text-sm leading-7 text-slate-600">{children}</div>
    </div>
  );
}

export default function ContactPage() {
  const { settings, loading } = usePublicSettings();

  const contact = settings?.contact || {};
  const social = settings?.social || {};

  const availableSocials = socialPlatforms.filter(
    (platform) => social[platform.key],
  );

  const hasContact = contact.email || contact.phone || contact.address;

  return (
    <main className="min-h-screen bg-hmif-surface px-5 pb-20 pt-36 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-extrabold uppercase tracking-[0.2em] text-hmif-teal">
            Hubungi Kami
          </p>

          <h1 className="font-heading text-4xl font-extrabold leading-tight text-hmif-navy sm:text-5xl">
            Terhubung dengan HMIF UNIBA
          </h1>

          <p className="mt-6 text-base leading-8 text-slate-600">
            Punya pertanyaan, ide, atau ingin mengenal HMIF lebih dekat? Temukan
            informasi kontak dan kanal komunikasi resmi kami di sini.
          </p>
        </div>

        {loading ? (
          <p className="mt-12 text-sm text-slate-500">
            Memuat informasi kontak...
          </p>
        ) : (
          <>
            <section className="mt-12">
              <h2 className="mb-6 font-heading text-2xl font-bold text-hmif-navy">
                Informasi Kontak
              </h2>

              {hasContact ? (
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {contact.email && (
                    <ContactCard icon="✉" title="Email">
                      <a
                        href={`mailto:${contact.email}`}
                        className="break-all font-medium text-hmif-teal hover:underline"
                      >
                        {contact.email}
                      </a>
                    </ContactCard>
                  )}

                  {contact.phone && (
                    <ContactCard icon="☎" title="Telepon">
                      <a
                        href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`}
                        className="font-medium text-hmif-teal hover:underline"
                      >
                        {contact.phone}
                      </a>
                    </ContactCard>
                  )}

                  {contact.address && (
                    <ContactCard icon="⌖" title="Alamat">
                      {contact.address}
                    </ContactCard>
                  )}
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm leading-7 text-slate-500">
                  Informasi kontak resmi HMIF belum tersedia. Silakan kunjungi
                  kembali halaman ini nanti.
                </div>
              )}
            </section>

            <section className="mt-12">
              <h2 className="mb-6 font-heading text-2xl font-bold text-hmif-navy">
                Media Sosial
              </h2>

              {availableSocials.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {availableSocials.map((platform) => (
                    <a
                      key={platform.key}
                      href={social[platform.key]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-hmif-navy transition hover:border-hmif-teal hover:text-hmif-teal"
                    >
                      {platform.label}
                      <span aria-hidden="true">↗</span>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm leading-7 text-slate-500">
                  Kanal media sosial resmi belum tersedia.
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}
