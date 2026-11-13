import { Badge, Card, Modal } from "../../../../components/ui";
import ArticleStatusBadge from "./ArticleStatusBadge";
import { formatDate } from "../utils/newsFormatters";

export default function ArticlePreview({ form, categories, imageUrl, onClose }) {
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
          <ArticleStatusBadge status={form.status} />
          <span className="text-xs text-slate-400">
            {formatDate(new Date())}
          </span>
        </div>

        <h1 className="font-heading text-2xl font-extrabold leading-tight text-hmif-navy sm:text-4xl">
          {form.title.trim() || "Judul berita akan tampil di sini"}
        </h1>

        <p className="mt-4 text-base leading-relaxed text-slate-500">
          {form.excerpt.trim() || "Ringkasan berita akan tampil di bagian ini."}
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
            Artikel ini masih berstatus draft dan belum siap ditampilkan sebagai
            berita terpublikasi.
          </Card>
        )}
      </article>
    </Modal>
  );
}
