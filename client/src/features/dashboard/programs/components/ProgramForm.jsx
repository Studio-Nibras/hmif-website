import { useEffect, useRef, useState } from "react";

import {
  Button,
  Input,
  Modal,
  Select,
  Textarea,
} from "../../../../components/ui";

import {
  createProgram,
  updateProgram,
  uploadProgramImage,
} from "../services/programsService";

const emptyForm = {
  name: "",
  division_id: "",
  description: "",
  period: "",
  pic_name: "",
  start_date: "",
  end_date: "",
  status: "planned",
  publication_status: "draft",
  cover_image: "",
  display_order: "0",
};

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function ProgramForm({
  initialData,
  divisions,
  onClose,
  onSaved,
}) {
  const [form, setForm] = useState(() => ({
    ...emptyForm,
    ...(initialData || {}),
    division_id: initialData?.division_id
      ? String(initialData.division_id)
      : "",
    start_date: initialData?.start_date
      ? String(initialData.start_date).slice(0, 10)
      : "",
    end_date: initialData?.end_date
      ? String(initialData.end_date).slice(0, 10)
      : "",
    display_order: String(initialData?.display_order ?? 0),
  }));

  const [selectedFile, setSelectedFile] = useState(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const previewUrlRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  function updateLocalPreview(file) {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }

    if (!file) {
      setLocalPreviewUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    previewUrlRef.current = objectUrl;
    setLocalPreviewUrl(objectUrl);
  }

  const imageUrl = localPreviewUrl || form.cover_image || "";

  function changeField(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      updateLocalPreview(null);
      setSelectedFile(null);
      event.target.value = "";
      setError("Format gambar harus JPG, PNG, atau WEBP.");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      updateLocalPreview(null);
      setSelectedFile(null);
      event.target.value = "";
      setError("Ukuran gambar maksimal 5 MB.");
      return;
    }

    updateLocalPreview(file);
    setSelectedFile(file);
  }

  function handleRemoveImage() {
    updateLocalPreview(null);
    setSelectedFile(null);
    setForm((current) => ({
      ...current,
      cover_image: "",
    }));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!form.name.trim() || !form.description.trim() || !form.period.trim()) {
      setError("Nama, deskripsi, dan periode program wajib diisi.");
      return;
    }

    if (form.start_date && form.end_date && form.end_date < form.start_date) {
      setError("Tanggal selesai tidak boleh sebelum tanggal mulai.");
      return;
    }

    setSaving(true);

    try {
      let coverImageUrl = form.cover_image.trim();

      if (selectedFile) {
        const uploadResult = await uploadProgramImage(selectedFile);
        coverImageUrl = uploadResult.image?.url || "";

        if (!coverImageUrl) {
          throw new Error("URL gambar tidak diterima dari server.");
        }
      }

      const payload = {
        name: form.name.trim(),
        division_id: form.division_id ? Number(form.division_id) : null,
        description: form.description.trim(),
        period: form.period.trim(),
        pic_name: form.pic_name.trim() || null,
        start_date: form.start_date || null,
        end_date: form.end_date || null,
        status: form.status,
        publication_status: form.publication_status,
        cover_image: coverImageUrl,
        display_order: Number(form.display_order || 0),
      };

      if (initialData?.id) {
        await updateProgram(initialData.id, payload);
      } else {
        await createProgram(payload);
      }

      onSaved();
    } catch (err) {
      setError(err.message || "Program kerja gagal disimpan.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      open
      onClose={() => {
        if (!saving) onClose();
      }}
      title={initialData?.id ? "Edit Program Kerja" : "Tambah Program Kerja"}
      description="Lengkapi informasi program kerja HMIF."
      size="xl"
      closeOnBackdrop={!saving}
      closeOnEscape={!saving}
    >
      <form
        onSubmit={handleSubmit}
        className="max-h-[calc(100vh-12rem)] overflow-y-auto"
      >
        {error && (
          <div
            role="alert"
            className="mb-5 rounded-xl bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <div className="space-y-5">
          <Input
            label="Nama program"
            name="name"
            value={form.name}
            onChange={changeField}
            maxLength={255}
            required
            placeholder="Masukkan nama program kerja"
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <Select
              label="Divisi"
              name="division_id"
              value={form.division_id}
              onChange={changeField}
              placeholder="Tanpa divisi"
              options={divisions.map((division) => ({
                value: String(division.id),
                label: division.name,
              }))}
            />

            <Input
              label="Periode"
              name="period"
              value={form.period}
              onChange={changeField}
              maxLength={100}
              required
              placeholder="Contoh: 2026/2027"
            />
          </div>

          <Textarea
            label="Deskripsi program"
            name="description"
            value={form.description}
            onChange={changeField}
            rows={6}
            required
            placeholder="Jelaskan tujuan dan gambaran program kerja..."
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              label="Penanggung jawab (PIC)"
              name="pic_name"
              value={form.pic_name || ""}
              onChange={changeField}
              maxLength={150}
              placeholder="Nama penanggung jawab"
            />

            <Input
              label="Urutan tampilan"
              name="display_order"
              type="number"
              value={form.display_order}
              onChange={changeField}
              min="0"
              step="1"
            />
          </div>

          <div>
            <p className="mb-3 text-sm font-bold text-slate-700">
              Jadwal pelaksanaan
            </p>

            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                label="Tanggal mulai"
                name="start_date"
                type="date"
                value={form.start_date}
                onChange={changeField}
              />

              <Input
                label="Tanggal selesai"
                name="end_date"
                type="date"
                value={form.end_date}
                onChange={changeField}
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Select
              label="Status pelaksanaan"
              name="status"
              value={form.status}
              onChange={changeField}
              options={[
                { value: "planned", label: "Planned" },
                { value: "ongoing", label: "Ongoing" },
                { value: "completed", label: "Completed" },
              ]}
            />

            <Select
              label="Status publikasi"
              name="publication_status"
              value={form.publication_status}
              onChange={changeField}
              options={[
                { value: "draft", label: "Draft" },
                { value: "published", label: "Published" },
              ]}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700">
              Gambar sampul
            </label>

            <label className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-5 py-7 text-center transition hover:border-hmif-teal hover:bg-hmif-teal/5">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-2xl text-hmif-teal shadow-sm">
                ↑
              </span>

              <span className="mt-3 text-sm font-bold text-hmif-navy">
                {selectedFile
                  ? "Pilih gambar lain"
                  : "Pilih gambar dari perangkat"}
              </span>

              <span className="mt-1 text-xs text-slate-500">
                JPG, PNG, atau WEBP · Maksimal 5 MB
              </span>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                disabled={saving}
                className="sr-only"
              />
            </label>

            {imageUrl && (
              <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between gap-3 bg-slate-50 px-4 py-3">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-700">
                      Preview gambar
                    </p>

                    <p className="mt-1 truncate text-xs text-slate-500">
                      {selectedFile
                        ? `${selectedFile.name} · Belum diunggah`
                        : "Gambar yang tersimpan"}
                    </p>
                  </div>

                  <Button
                    type="button"
                    onClick={handleRemoveImage}
                    disabled={saving}
                    variant="danger"
                    size="sm"
                  >
                    Hapus gambar
                  </Button>
                </div>

                <img
                  src={imageUrl}
                  alt="Preview sampul program"
                  className="max-h-72 w-full bg-slate-100 object-contain"
                />
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
          <Button
            type="button"
            onClick={onClose}
            disabled={saving}
            variant="secondary"
          >
            Batal
          </Button>

          <Button type="submit" loading={saving}>
            {saving
              ? selectedFile
                ? "Mengunggah & menyimpan..."
                : "Menyimpan..."
              : "Simpan Program"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
