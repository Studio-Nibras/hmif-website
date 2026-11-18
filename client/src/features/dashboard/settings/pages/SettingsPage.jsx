import {
  Button,
  Card,
  Input,
  Loading,
  Textarea,
} from "../../../../components/ui";

import useSettings from "../hooks/useSettings";

const SETTINGS_GROUPS = [
  {
    key: "homepage",
    title: "Homepage",
    description: "Atur konten utama yang tampil pada halaman beranda.",
    fields: [
      { key: "hero_title", label: "Judul Hero", maxLength: 200 },
      {
        key: "hero_subtitle",
        label: "Subjudul Hero",
        multiline: true,
        maxLength: 500,
      },
      { key: "primary_cta_label", label: "Teks Tombol Utama", maxLength: 100 },
      { key: "primary_cta_href", label: "Tautan Tombol Utama", maxLength: 500 },
      {
        key: "secondary_cta_label",
        label: "Teks Tombol Kedua",
        maxLength: 100,
      },
      {
        key: "secondary_cta_href",
        label: "Tautan Tombol Kedua",
        maxLength: 500,
      },
      {
        key: "short_profile",
        label: "Profil Singkat",
        multiline: true,
        maxLength: 1000,
      },
    ],
  },
  {
    key: "about",
    title: "Tentang HMIF",
    description: "Kelola profil, visi, dan misi organisasi.",
    fields: [
      { key: "profile_title", label: "Judul Profil", maxLength: 200 },
      {
        key: "profile_description",
        label: "Deskripsi Profil",
        multiline: true,
        maxLength: 2000,
      },
      {
        key: "vision",
        label: "Visi",
        multiline: true,
        maxLength: 2000,
      },
      {
        key: "mission",
        label: "Misi",
        multiline: true,
        maxLength: 3000,
      },
    ],
  },
  {
    key: "contact",
    title: "Informasi Kontak",
    description: "Masukkan informasi kontak resmi HMIF.",
    fields: [
      { key: "email", label: "Email", type: "email", maxLength: 254 },
      { key: "phone", label: "Nomor Telepon", maxLength: 50 },
      {
        key: "address",
        label: "Alamat",
        multiline: true,
        maxLength: 500,
      },
    ],
  },
  {
    key: "social",
    title: "Media Sosial",
    description: "Kelola tautan akun media sosial resmi HMIF.",
    fields: [
      { key: "instagram", label: "Instagram", maxLength: 500 },
      { key: "facebook", label: "Facebook", maxLength: 500 },
      { key: "youtube", label: "YouTube", maxLength: 500 },
      { key: "tiktok", label: "TikTok", maxLength: 500 },
      { key: "linkedin", label: "LinkedIn", maxLength: 500 },
    ],
  },
  {
    key: "footer",
    title: "Footer Website",
    description: "Atur deskripsi dan informasi hak cipta pada footer.",
    fields: [
      {
        key: "description",
        label: "Deskripsi Footer",
        multiline: true,
        maxLength: 1000,
      },
      {
        key: "copyright_text",
        label: "Teks Copyright",
        maxLength: 200,
      },
    ],
  },
];

export default function SettingsPage() {
  const {
    settings,
    dirtySettings,
    loading,
    saving,
    error,
    notice,
    updateField,
    saveSettings,
    setError,
    setNotice,
  } = useSettings();

  const hasChanges = Object.keys(dirtySettings).length > 0;

  if (loading) {
    return (
      <div className="py-16">
        <Loading
          label="Memuat pengaturan website..."
          className="justify-center"
        />
      </div>
    );
  }

  return (
    <section>
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-hmif-teal">
            Website Configuration
          </p>

          <h2 className="mt-2 font-heading text-2xl font-extrabold text-hmif-navy">
            Pengaturan Website
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Kelola konten dan informasi website tanpa mengubah kode program.
          </p>
        </div>

        <Button
          type="button"
          onClick={saveSettings}
          loading={saving}
          disabled={!hasChanges || saving}
        >
          Simpan Perubahan
        </Button>
      </div>

      {notice && (
        <div className="mb-4 flex items-center justify-between gap-3 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <span>{notice}</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setNotice("")}
            aria-label="Tutup pesan"
          >
            ×
          </Button>
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="mb-4 flex items-center justify-between gap-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <span>{error}</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setError("")}
            aria-label="Tutup pesan"
          >
            ×
          </Button>
        </div>
      )}

      <div className="space-y-5">
        {SETTINGS_GROUPS.map((group) => (
          <Card key={group.key} className="rounded-2xl p-5 sm:p-6">
            <div className="mb-6 border-b border-slate-100 pb-4">
              <h3 className="font-heading text-lg font-bold text-hmif-navy">
                {group.title}
              </h3>
              <p className="mt-1 text-sm text-slate-500">{group.description}</p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {group.fields.map((field) => {
                const value = settings[group.key]?.[field.key] ?? "";

                return (
                  <div
                    key={`${group.key}.${field.key}`}
                    className={field.multiline ? "md:col-span-2" : ""}
                  >
                    {field.multiline ? (
                      <Textarea
                        label={field.label}
                        value={value}
                        onChange={(event) =>
                          updateField(group.key, field.key, event.target.value)
                        }
                        rows={4}
                        maxLength={field.maxLength}
                      />
                    ) : (
                      <Input
                        label={field.label}
                        type={field.type || "text"}
                        value={value}
                        onChange={(event) =>
                          updateField(group.key, field.key, event.target.value)
                        }
                        maxLength={field.maxLength}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold text-hmif-navy">
            {hasChanges
              ? "Ada perubahan belum disimpan"
              : "Semua perubahan tersimpan"}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Pastikan informasi yang dimasukkan merupakan data resmi HMIF.
          </p>
        </div>

        <Button
          type="button"
          onClick={saveSettings}
          loading={saving}
          disabled={!hasChanges || saving}
        >
          Simpan Perubahan
        </Button>
      </div>
    </section>
  );
}
