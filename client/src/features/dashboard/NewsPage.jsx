import { useCallback, useEffect, useState } from "react";
import {
  createNews,
  deleteNews,
  getNews,
  getNewsCategories,
  getNewsById,
  updateNews,
  uploadNewsImage,
} from "./newsService";

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

function formatDate(value) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function StatusBadge({ status }) {
  const published = status === "published";

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
        published
          ? "bg-emerald-50 text-emerald-700"
          : "bg-amber-50 text-amber-700"
      }`}
    >
      {published ? "Published" : "Draft"}
    </span>
  );
}

function ArticlePreview({ form, categories, imageUrl, onClose }) {
  const categoryName =
    categories.find(
      (category) => String(category.id) === String(form.category_id),
    )?.name || "Kategori";

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-slate-950/70 p-4 backdrop-blur-sm sm:p-8"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <article className="my-auto w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-hmif-teal">
              Article Preview
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Tampilan simulasi sebelum publikasi
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup preview"
            className="rounded-xl px-3 py-2 text-xl text-slate-400 hover:bg-slate-100"
          >
            ×
          </button>
        </div>

        <div className="p-5 sm:p-8">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-hmif-teal/10 px-3 py-1.5 text-xs font-bold text-hmif-teal">
              {categoryName}
            </span>
            <StatusBadge status={form.status} />
            <span className="text-xs text-slate-400">
              {formatDate(new Date())}
            </span>
          </div>

          <h1 className="font-heading text-2xl font-extrabold leading-tight text-hmif-navy sm:text-4xl">
            {form.title.trim() || "Judul berita akan tampil di sini"}
          </h1>

          <p className="mt-4 text-base leading-relaxed text-slate-500">
            {form.excerpt.trim() ||
              "Ringkasan berita akan tampil di bagian ini."}
          </p>

          {imageUrl ? (
            <img
              src={imageUrl}
              alt={form.title || "Gambar sampul berita"}
              className="mt-7 max-h-[420px] w-full rounded-2xl bg-slate-100 object-cover"
            />
          ) : (
            <div className="mt-7 flex min-h-48 items-center justify-center rounded-2xl bg-slate-100 px-6 text-center text-sm text-slate-400">
              Gambar sampul belum dipilih
            </div>
          )}

          <div className="mt-8 whitespace-pre-wrap break-words text-sm leading-8 text-slate-700 sm:text-base">
            {form.content.trim() ||
              "Isi berita akan tampil di bagian ini setelah lo menulis artikel."}
          </div>

          {form.status === "draft" && (
            <div className="mt-8 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
              Artikel ini masih berstatus draft dan belum siap ditampilkan
              sebagai berita terpublikasi.
            </div>
          )}
        </div>
      </article>
    </div>
  );
}

function ArticleForm({ initialData, categories, onClose, onSaved }) {
  const [form, setForm] = useState(() => ({
    ...emptyForm,
    ...(initialData || {}),
  }));
  const [selectedFile, setSelectedFile] = useState(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!selectedFile) {
      setLocalPreviewUrl("");
      return undefined;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setLocalPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

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
      setSelectedFile(null);
      event.target.value = "";
      setError("Format gambar harus JPG, PNG, atau WEBP.");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setSelectedFile(null);
      event.target.value = "";
      setError("Ukuran gambar maksimal 5 MB.");
      return;
    }

    setSelectedFile(file);
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

  const fieldClass =
    "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-hmif-teal focus:ring-2 focus:ring-hmif-teal/10";

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm sm:p-8"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget && !saving) onClose();
        }}
      >
        <form
          onSubmit={handleSubmit}
          className="my-auto w-full max-w-3xl rounded-3xl bg-white p-5 shadow-2xl sm:p-8"
        >
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-hmif-teal">
                Content Management
              </p>
              <h2 className="mt-2 font-heading text-xl font-extrabold text-hmif-navy">
                {initialData?.id ? "Edit Berita" : "Tambah Berita"}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Lengkapi informasi artikel HMIF.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              aria-label="Tutup form"
              className="rounded-xl px-3 py-2 text-xl text-slate-400 hover:bg-slate-100 disabled:opacity-50"
            >
              ×
            </button>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-5 rounded-xl bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          <div className="space-y-5">
            <label className="block text-sm font-bold text-slate-700">
              Judul berita *
              <input
                name="title"
                value={form.title}
                onChange={changeField}
                maxLength={255}
                required
                className={fieldClass}
                placeholder="Masukkan judul berita"
              />
            </label>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block text-sm font-bold text-slate-700">
                Kategori *
                <select
                  name="category_id"
                  value={form.category_id}
                  onChange={changeField}
                  required
                  className={fieldClass}
                >
                  <option value="">Pilih kategori</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-sm font-bold text-slate-700">
                Status publikasi
                <select
                  name="status"
                  value={form.status}
                  onChange={changeField}
                  className={fieldClass}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </label>
            </div>

            <label className="block text-sm font-bold text-slate-700">
              Ringkasan
              <textarea
                name="excerpt"
                value={form.excerpt || ""}
                onChange={changeField}
                rows={2}
                className={fieldClass}
                placeholder="Ringkasan singkat untuk preview berita"
              />
            </label>

            <label className="block text-sm font-bold text-slate-700">
              Isi berita *
              <textarea
                name="content"
                value={form.content}
                onChange={changeField}
                rows={8}
                required
                className={fieldClass}
                placeholder="Tulis isi berita di sini..."
              />
            </label>

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

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        setForm((current) => ({
                          ...current,
                          cover_image: "",
                        }));
                      }}
                      disabled={saving}
                      className="shrink-0 rounded-lg px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      Hapus gambar
                    </button>
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
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              disabled={saving}
              className="rounded-xl border border-hmif-teal px-5 py-3 text-sm font-bold text-hmif-teal hover:bg-hmif-teal/5 disabled:opacity-50"
            >
              Lihat Preview Artikel
            </button>

            <div className="flex flex-col-reverse gap-3 sm:flex-row">
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
              >
                Batal
              </button>

              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-hmif-teal px-5 py-3 text-sm font-bold text-white transition hover:bg-hmif-teal-dark disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? selectedFile
                    ? "Mengunggah & menyimpan..."
                    : "Menyimpan..."
                  : "Simpan Berita"}
              </button>
            </div>
          </div>
        </form>
      </div>

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

export default function NewsPage() {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [formData, setFormData] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const loadArticles = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await getNews({
        page: pagination.page,
        limit: pagination.limit,
        search,
        status,
        category_id: categoryId,
      });

      setArticles(result.articles || []);
      setPagination((current) => ({
        ...current,
        ...(result.pagination || {}),
      }));
    } catch (err) {
      setError(err.message || "Gagal memuat berita.");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, search, status, categoryId]);

  useEffect(() => {
    getNewsCategories()
      .then((result) => setCategories(result.categories || []))
      .catch((err) => setError(err.message || "Gagal memuat kategori."));
  }, []);

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  function applySearch(event) {
    event.preventDefault();
    setPagination((current) => ({ ...current, page: 1 }));
    setSearch(searchInput.trim());
  }

  function changeFilter(setter, value) {
    setter(value);
    setPagination((current) => ({ ...current, page: 1 }));
  }

  async function openEdit(articleId) {
    setError("");
    setNotice("");

    try {
      const result = await getNewsById(articleId);
      const article = result.article;

      setFormData({
        id: article.id,
        title: article.title || "",
        category_id: String(article.category_id),
        excerpt: article.excerpt || "",
        content: article.content || "",
        cover_image: article.cover_image || "",
        status: article.status || "draft",
      });
      setFormOpen(true);
    } catch (err) {
      setError(err.message || "Gagal memuat detail berita.");
    }
  }

  async function handleDelete(article) {
    const confirmed = window.confirm(
      `Hapus berita "${article.title}"? Tindakan ini tidak dapat dibatalkan.`,
    );

    if (!confirmed) return;

    setDeletingId(article.id);
    setError("");
    setNotice("");

    try {
      await deleteNews(article.id);
      setNotice("Berita berhasil dihapus.");

      if (articles.length === 1 && pagination.page > 1) {
        setPagination((current) => ({
          ...current,
          page: current.page - 1,
        }));
      } else {
        await loadArticles();
      }
    } catch (err) {
      setError(err.message || "Berita gagal dihapus.");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleSaved() {
    setFormOpen(false);
    setFormData(null);
    setNotice("Berita berhasil disimpan.");
    setPagination((current) => ({ ...current, page: 1 }));
    setSearchInput("");
    setSearch("");
    setStatus("");
    setCategoryId("");
    await loadArticles();
  }

  return (
    <section>
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-hmif-teal">
            Content Management
          </p>
          <h2 className="mt-2 font-heading text-2xl font-extrabold text-hmif-navy">
            Manajemen Berita
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Kelola artikel, pengumuman, dan publikasi HMIF UNIBA.
          </p>
        </div>

        <button
          onClick={() => {
            setFormData(null);
            setFormOpen(true);
            setNotice("");
            setError("");
          }}
          className="rounded-xl bg-hmif-teal px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-hmif-teal-dark"
        >
          + Tambah Berita
        </button>
      </div>

      <div className="mb-5 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Total hasil</p>
          <p className="mt-2 text-2xl font-extrabold text-hmif-navy">
            {pagination.total}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Halaman</p>
          <p className="mt-2 text-2xl font-extrabold text-hmif-navy">
            {pagination.totalPages ? pagination.page : 0}
            <span className="text-base font-semibold text-slate-400">
              {" "}
              / {pagination.totalPages}
            </span>
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Kategori tersedia</p>
          <p className="mt-2 text-2xl font-extrabold text-hmif-navy">
            {categories.length}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <form
          onSubmit={applySearch}
          className="mb-5 grid gap-3 md:grid-cols-[minmax(180px,1fr)_180px_160px_auto]"
        >
          <input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Cari judul berita..."
            className="min-w-0 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-hmif-teal"
          />

          <select
            value={categoryId}
            onChange={(event) =>
              changeFilter(setCategoryId, event.target.value)
            }
            className="rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-hmif-teal"
          >
            <option value="">Semua kategori</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(event) => changeFilter(setStatus, event.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-hmif-teal"
          >
            <option value="">Semua status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>

          <button
            type="submit"
            className="rounded-xl bg-hmif-navy px-5 py-3 text-sm font-bold text-white hover:bg-hmif-teal"
          >
            Cari
          </button>
        </form>

        {notice && (
          <div className="mb-4 flex items-center justify-between gap-3 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            <span>{notice}</span>
            <button
              type="button"
              onClick={() => setNotice("")}
              aria-label="Tutup pesan"
            >
              ×
            </button>
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="mb-4 flex items-center justify-between gap-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Tutup pesan"
            >
              ×
            </button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase tracking-wider text-slate-400">
                <th className="px-3 py-4 font-bold">Berita</th>
                <th className="px-3 py-4 font-bold">Kategori</th>
                <th className="px-3 py-4 font-bold">Status</th>
                <th className="px-3 py-4 font-bold">Tanggal</th>
                <th className="px-3 py-4 text-right font-bold">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-3 py-14 text-center text-sm text-slate-500"
                  >
                    Memuat berita...
                  </td>
                </tr>
              ) : articles.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-3 py-14 text-center">
                    <p className="font-bold text-hmif-navy">Belum ada berita</p>
                    <p className="mt-1 text-sm text-slate-500">
                      Tambahkan berita pertama atau ubah filter pencarian.
                    </p>
                  </td>
                </tr>
              ) : (
                articles.map((article) => (
                  <tr
                    key={article.id}
                    className="transition hover:bg-slate-50/70"
                  >
                    <td className="max-w-sm px-3 py-4">
                      <div className="flex items-center gap-3">
                        {article.cover_image ? (
                          <img
                            src={article.cover_image}
                            alt=""
                            className="h-12 w-16 shrink-0 rounded-lg bg-slate-100 object-cover"
                          />
                        ) : (
                          <div className="flex h-12 w-16 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs text-slate-400">
                            No img
                          </div>
                        )}

                        <div className="min-w-0">
                          <p className="font-bold text-hmif-navy">
                            {article.title}
                          </p>
                          <p className="mt-1 truncate text-xs text-slate-400">
                            /{article.slug}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-3 py-4 text-sm text-slate-600">
                      {article.category_name}
                    </td>

                    <td className="px-3 py-4">
                      <StatusBadge status={article.status} />
                    </td>

                    <td className="px-3 py-4 text-sm text-slate-500">
                      {formatDate(article.published_at || article.created_at)}
                    </td>

                    <td className="px-3 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(article.id)}
                          className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 hover:border-hmif-teal hover:text-hmif-teal"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(article)}
                          disabled={deletingId === article.id}
                          className="rounded-lg border border-red-100 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 disabled:opacity-50"
                        >
                          {deletingId === article.id ? "Menghapus..." : "Hapus"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            Menampilkan {articles.length} dari {pagination.total} berita
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={pagination.page <= 1 || loading}
              onClick={() =>
                setPagination((current) => ({
                  ...current,
                  page: current.page - 1,
                }))
              }
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Sebelumnya
            </button>

            <span className="px-2 text-sm text-slate-500">
              {pagination.page} / {Math.max(1, pagination.totalPages)}
            </span>

            <button
              type="button"
              disabled={pagination.page >= pagination.totalPages || loading}
              onClick={() =>
                setPagination((current) => ({
                  ...current,
                  page: current.page + 1,
                }))
              }
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Berikutnya
            </button>
          </div>
        </div>
      </div>

      {formOpen && (
        <ArticleForm
          initialData={formData}
          categories={categories}
          onClose={() => {
            setFormOpen(false);
            setFormData(null);
          }}
          onSaved={handleSaved}
        />
      )}
    </section>
  );
}
