import { useEffect, useRef, useState } from "react";
import {
  Button,
  Input,
  Modal,
  Select,
  Textarea,
} from "../../../../components/ui";

import {
  createNews,
  updateNews,
  uploadNewsImage,
} from "../../newsService";

import ArticlePreview from "./ArticlePreview";

const emptyForm = {
  title: "",
  category_id: "",
  excerpt: "",
  content: "",
  cover_image: "",
  status: "draft",
};

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function ArticleForm({ initialData, categories, onClose, onSaved }) {
  const [form, setForm] = useState(() => ({
    ...emptyForm,
    ...(initialData || {}),
  }));
  const [selectedFile, setSelectedFile] = useState(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
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
    setForm((current) => ({ ...current, [name]: value }));
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
    setForm((current) => ({ ...current, cover_image: "" }));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!form.title.trim() || !form.content.trim() || !form.category_id) {
      setError("Judul, kategori, dan isi berita wajib diisi.");
      return;
    }

    setSaving(true);

    try {
      let coverImageUrl = form.cover_image.trim();

      if (selectedFile) {
        const uploadResult = await uploadNewsImage(selectedFile);
        coverImageUrl = uploadResult.url;

        if (!coverImageUrl) {
          throw new Error("URL gambar tidak diterima dari server.");
        }
      }

      const payload = {
        title: form.title.trim(),
        category_id: Number(form.category_id),
        excerpt: form.excerpt.trim(),
        content: form.content.trim(),
        cover_image: coverImageUrl,
        status: form.status,
      };

      if (initialData?.id) {
        await updateNews(initialData.id, payload);
      } else {
        await createNews(payload);
      }

      await onSaved();
    } catch (err) {
      setError(err.message || "Berita gagal disimpan.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Modal
        open
        onClose={() => {
          if (!saving) onClose();
        }}
        title={initialData?.id ? "Edit Berita" : "Tambah Berita"}
        description="Lengkapi informasi artikel HMIF."
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
              label="Judul berita"
              name="title"
              value={form.title}
              onChange={changeField}
              maxLength={255}
              required
              placeholder="Masukkan judul berita"
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <Select
                label="Kategori"
                name="category_id"
                value={form.category_id}
                onChange={changeField}
                required
                placeholder="Pilih kategori"
                options={categories.map((category) => ({
                  value: category.id,
                  label: category.name,
                }))}
              />

              <Select
                label="Status publikasi"
                name="status"
                value={form.status}
                onChange={changeField}
                placeholder="Pilih status"
                options={[
                  { value: "draft", label: "Draft" },
                  { value: "published", label: "Published" },
                ]}
              />
            </div>

            <Textarea
              label="Ringkasan"
              name="excerpt"
              value={form.excerpt || ""}
              onChange={changeField}
              rows={2}
              placeholder="Ringkasan singkat untuk preview berita"
            />

            <Textarea
              label="Isi berita"
              name="content"
              value={form.content}
              onChange={changeField}
              rows={8}
              required
              placeholder="Tulis isi berita di sini..."
            />

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
                      className="shrink-0 rounded-lg"
                    >
                      Hapus gambar
                    </Button>
                  </div>

                  <img
                    src={imageUrl}
                    alt="Preview gambar sampul"
                    className="max-h-72 w-full bg-slate-100 object-contain"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-between">
            <Button
              type="button"
              onClick={() => setShowPreview(true)}
              disabled={saving}
              variant="outline"
            >
              Lihat Preview Artikel
            </Button>

            <div className="flex flex-col-reverse gap-3 sm:flex-row">
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
                  : "Simpan Berita"}
              </Button>
            </div>
          </div>
        </form>
      </Modal>

      {showPreview && (
        <ArticlePreview
          form={form}
          categories={categories}
          imageUrl={imageUrl}
          onClose={() => setShowPreview(false)}
        />
      )}
    </>
  );
}
