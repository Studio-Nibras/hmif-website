import {
  Button,
  Card,
  Input,
  Loading,
  Select,
} from "../../../components/ui";

import ArticleForm from "./components/ArticleForm";
import ArticleStatusBadge from "./components/ArticleStatusBadge";
import useNews from "./hooks/useNews";
import { formatDate } from "./utils/newsFormatters";

export default function NewsPage() {
  const {
    articles,
    categories,
    pagination,
    searchInput,
    setSearchInput,
    status,
    setStatus,
    categoryId,
    setCategoryId,
    loading,
    error,
    setError,
    notice,
    setNotice,
    formData,
    setFormData,
    formOpen,
    setFormOpen,
    deletingId,
    applySearch,
    changeFilter,
    changePage,
    openEdit,
    handleDelete,
    handleSaved,
  } = useNews();

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

          <Button type="submit" className="bg-hmif-navy hover:bg-hmif-teal">
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
                      <ArticleStatusBadge status={article.status} />
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
