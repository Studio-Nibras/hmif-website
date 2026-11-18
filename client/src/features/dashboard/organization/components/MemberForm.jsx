import { useEffect, useRef, useState } from "react";

import {
  Button,
  Input,
  Modal,
  Select,
  Textarea,
} from "../../../../components/ui";

import { uploadMemberPhoto } from "../services/organizationService";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function MemberForm({
  initialData,
  divisions,
  onClose,
  onSave,
  saving = false,
}) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    position: initialData?.position || "",
    division_id: initialData?.division_id
      ? String(initialData.division_id)
      : "",
    photo_url: initialData?.photo_url || "",
    bio: initialData?.bio || "",
    term_start: initialData?.term_start || "",
    term_end: initialData?.term_end || "",
    display_order: initialData?.display_order ?? 0,
    is_active:
      initialData?.is_active === undefined
        ? true
        : ![false, 0, "0"].includes(initialData.is_active),
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(initialData?.photo_url || "");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const photoUrlRef = useRef(null);

  useEffect(() => {
    return () => {
      if (photoUrlRef.current) {
        URL.revokeObjectURL(photoUrlRef.current);
      }
    };
  }, []);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handlePhotoChange(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Format foto harus JPG, PNG, atau WEBP.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("Ukuran foto maksimal 5 MB.");
      event.target.value = "";
      return;
    }

    if (photoUrlRef.current) {
      URL.revokeObjectURL(photoUrlRef.current);
    }

    const objectUrl = URL.createObjectURL(file);

    photoUrlRef.current = objectUrl;
    setPhotoFile(file);
    setPreviewUrl(objectUrl);
  }

  function handleRemovePhoto() {
    if (photoUrlRef.current) {
      URL.revokeObjectURL(photoUrlRef.current);
      photoUrlRef.current = null;
    }

    setPhotoFile(null);
    setPreviewUrl("");
    setFormData((current) => ({
      ...current,
      photo_url: "",
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!formData.name.trim() || !formData.position.trim()) {
      setError("Nama dan jabatan wajib diisi.");
      return;
    }

    if (
      formData.term_start &&
      formData.term_end &&
      Number(formData.term_end) < Number(formData.term_start)
    ) {
      setError("Tahun selesai tidak boleh sebelum tahun mulai.");
      return;
    }

    let photoUrl = formData.photo_url;

    try {
      if (photoFile) {
        setUploading(true);

        const result = await uploadMemberPhoto(photoFile);
        photoUrl = result.image.url;

        setUploading(false);
      }

      await onSave({
        name: formData.name.trim(),
        position: formData.position.trim(),
        division_id: formData.division_id || null,
        photo_url: photoUrl || null,
        bio: formData.bio.trim(),
        term_start: formData.term_start || null,
        term_end: formData.term_end || null,
        display_order: Number(formData.display_order) || 0,
        is_active: formData.is_active,
      });
    } catch (err) {
      setUploading(false);
      setError(err.message || "Gagal menyimpan data pengurus.");
    }
  }

  return (
    <Modal
      open
      onClose={saving || uploading ? undefined : onClose}
      title={initialData ? "Edit Pengurus" : "Tambah Pengurus"}
      description="Lengkapi informasi pengurus organisasi HMIF."
      size="xl"
      closeOnBackdrop={!saving && !uploading}
      closeOnEscape={!saving && !uploading}
      footer={
        <>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={saving || uploading}
          >
            Batal
          </Button>

          <Button
            type="submit"
            form="member-form"
            loading={saving || uploading}
          >
            {uploading ? "Mengunggah Foto..." : "Simpan Pengurus"}
          </Button>
        </>
      }
    >
      <form id="member-form" onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div
            role="alert"
            className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <div className="grid gap-5 md:grid-cols-[180px_minmax(0,1fr)]">
          <div>
            <p className="mb-2 text-sm font-semibold text-hmif-navy">
              Foto Pengurus
            </p>

            <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-slate-50">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview foto pengurus"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="px-4 text-center text-xs text-slate-400">
                  Belum ada foto
                </div>
              )}
            </div>

            <label className="mt-3 block cursor-pointer rounded-xl border border-slate-200 px-3 py-2.5 text-center text-sm font-semibold text-hmif-navy transition hover:bg-slate-50">
              Pilih Foto
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePhotoChange}
                className="sr-only"
              />
            </label>

            {previewUrl && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                fullWidth
                className="mt-2 text-red-600"
                onClick={handleRemovePhoto}
              >
                Hapus Foto
              </Button>
            )}

            <p className="mt-2 text-center text-xs text-slate-400">
              JPG, PNG, WEBP. Maksimal 5 MB.
            </p>
          </div>

          <div className="space-y-4">
            <Input
              label="Nama Lengkap"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nama pengurus"
              maxLength={150}
              required
            />

            <Input
              label="Jabatan"
              name="position"
              value={formData.position}
              onChange={handleChange}
              placeholder="Contoh: Ketua Umum"
              maxLength={150}
              required
            />

            <Select
              label="Divisi"
              name="division_id"
              value={formData.division_id}
              onChange={handleChange}
              placeholder="Tanpa divisi"
              options={divisions.map((division) => ({
                value: String(division.id),
                label: division.name,
              }))}
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Tahun Mulai"
                name="term_start"
                type="number"
                min="1901"
                max="2155"
                value={formData.term_start}
                onChange={handleChange}
                placeholder="2026"
              />

              <Input
                label="Tahun Selesai"
                name="term_end"
                type="number"
                min="1901"
                max="2155"
                value={formData.term_end}
                onChange={handleChange}
                placeholder="2027"
              />
            </div>
          </div>
        </div>

        <Textarea
          label="Biodata"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          placeholder="Informasi singkat mengenai pengurus..."
          rows={4}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Urutan Tampil"
            name="display_order"
            type="number"
            min="0"
            step="1"
            value={formData.display_order}
            onChange={handleChange}
            helperText="Angka lebih kecil ditampilkan lebih dahulu."
          />

          <div className="flex items-center">
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 px-4 py-3">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="size-4 accent-hmif-teal"
              />

              <span>
                <span className="block text-sm font-semibold text-hmif-navy">
                  Pengurus Aktif
                </span>
                <span className="mt-1 block text-xs text-slate-500">
                  Tampilkan di halaman publik.
                </span>
              </span>
            </label>
          </div>
        </div>
      </form>
    </Modal>
  );
}
