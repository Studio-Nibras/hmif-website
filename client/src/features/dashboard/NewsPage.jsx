import { useCallback, useEffect, useRef, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Input,
  Loading,
  Modal,
  Select,
  Textarea,
} from "../../components/ui";
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
    <Badge
      variant={published ? "success" : "warning"}
      className="px-3 py-1 font-bold"
    >
      {published ? "Published" : "Draft"}
    </Badge>
  );
}

function ArticlePreview({ form, categories, imageUrl, onClose }) {
  const categoryName =
    categories.find(
      (category) => String(category.id) === String(form.category_id),
    )?.name || "Kategori";

  return (
    <Modal
      open
      onClose={onClose}
      title="Article Preview"
      description="Tampilan simulasi sebelum publikasi"
      size="xl"
    >
      <article>
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <Badge className="bg-hmif-teal/10 text-xs font-bold text-hmif-teal">
              {categoryName}
            </Badge>
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
            <Card
              padding="sm"
              className="mt-8 rounded-xl border-amber-100 bg-amber-50 text-sm text-amber-800"
            >
              Artikel ini masih berstatus draft dan belum siap ditampilkan
              sebagai berita terpublikasi.
            </Card>
          )}
      </article>
    </Modal>
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

              <Button
                type="submit"
                loading={saving}
              >
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
      setError("");
    } catch (err) {
      setError(err.message || "Gagal memuat berita.");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, search, status, categoryId]);

  useEffect(() => {
    let active = true;

    getNewsCategories()
      .then((result) => {
        if (active) setCategories(result.categories || []);
      })
      .catch((err) => {
        if (active) setError(err.message || "Gagal memuat kategori.");
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    getNews({
      page: pagination.page,
      limit: pagination.limit,
      search,
      status,
      category_id: categoryId,
    })
      .then((result) => {
        if (!active) return;

        setArticles(result.articles || []);
        setPagination((current) => ({
          ...current,
          ...(result.pagination || {}),
        }));
        setError("");
      })
      .catch((err) => {
        if (active) setError(err.message || "Gagal memuat berita.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [pagination.page, pagination.limit, search, status, categoryId]);

  function applySearch(event) {
    event.preventDefault();
    setLoading(true);
    setPagination((current) => ({ ...current, page: 1 }));
    setSearch(searchInput.trim());
  }

  function changeFilter(setter, value) {
    setLoading(true);
    setter(value);
    setPagination((current) => ({ ...current, page: 1 }));
  }

  function changePage(page) {
    setLoading(true);
    setPagination((current) => ({ ...current, page }));
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
        changePage(pagination.page - 1);
      } else {
        setLoading(true);
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
    setLoading(true);
    setPagination((current) => ({ ...current, page: 1 }));
    setSearchInput("");
    setSearch("");
    setStatus("");
    setCategoryId("");
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

        <Button
          type="button"
          onClick={() => {
            setFormData(null);
            setFormOpen(true);
            setNotice("");
            setError("");
          }}
        >
          + Tambah Berita
        </Button>
      </div>

      <div className="mb-5 grid gap-4 sm:grid-cols-3">
        <Card className="rounded-2xl p-5">
          <p className="text-sm text-slate-500">Total hasil</p>
          <p className="mt-2 text-2xl font-extrabold text-hmif-navy">
            {pagination.total}
          </p>
        </Card>

        <Card className="rounded-2xl p-5">
          <p className="text-sm text-slate-500">Halaman</p>
          <p className="mt-2 text-2xl font-extrabold text-hmif-navy">
            {pagination.totalPages ? pagination.page : 0}
            <span className="text-base font-semibold text-slate-400">
              {" "}
              / {pagination.totalPages}
            </span>
          </p>
        </Card>

        <Card className="rounded-2xl p-5">
          <p className="text-sm text-slate-500">Kategori tersedia</p>
          <p className="mt-2 text-2xl font-extrabold text-hmif-navy">
            {categories.length}
          </p>
        </Card>
      </div>

      <Card className="rounded-2xl p-5 sm:p-6">
        <form
          onSubmit={applySearch}
          className="mb-5 grid gap-3 md:grid-cols-[minmax(180px,1fr)_180px_160px_auto]"
        >
          <Input
            type="search"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Cari judul berita..."
            aria-label="Cari judul berita"
            className="min-w-0"
          />

          <Select
            value={categoryId}
            onChange={(event) =>
              changeFilter(setCategoryId, event.target.value)
            }
            aria-label="Filter kategori"
            placeholder="Semua kategori"
            options={categories.map((category) => ({
              value: category.id,
              label: category.name,
            }))}
          />

          <Select
            value={status}
            onChange={(event) => changeFilter(setStatus, event.target.value)}
            aria-label="Filter status"
            placeholder="Semua status"
            options={[
              { value: "draft", label: "Draft" },
              { value: "published", label: "Published" },
            ]}
          />

          <Button
            type="submit"
            className="bg-hmif-navy hover:bg-hmif-teal"
          >
            Cari
          </Button>
        </form>

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
                    <Loading
                      size="sm"
                      label="Memuat berita..."
                      className="justify-center py-0"
                    />
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
                        <Button
                          type="button"
                          onClick={() => openEdit(article.id)}
                          variant="secondary"
                          size="sm"
                          className="min-h-8 rounded-lg px-3 text-xs"
                        >
                          Edit
                        </Button>

                        <Button
                          type="button"
                          onClick={() => handleDelete(article)}
                          loading={deletingId === article.id}
                          variant="danger"
                          size="sm"
                          className="min-h-8 rounded-lg px-3 text-xs"
                        >
                          {deletingId === article.id ? "Menghapus..." : "Hapus"}
                        </Button>
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
            <Button
              type="button"
              disabled={pagination.page <= 1 || loading}
              onClick={() => changePage(pagination.page - 1)}
              variant="secondary"
              size="sm"
              className="rounded-lg text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Sebelumnya
            </Button>

            <span className="px-2 text-sm text-slate-500">
              {pagination.page} / {Math.max(1, pagination.totalPages)}
            </span>

            <Button
              type="button"
              disabled={pagination.page >= pagination.totalPages || loading}
              onClick={() => changePage(pagination.page + 1)}
              variant="secondary"
              size="sm"
              className="rounded-lg text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Berikutnya
            </Button>
          </div>
        </div>
      </Card>

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
