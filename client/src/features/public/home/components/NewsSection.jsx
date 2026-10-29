import { Link } from "react-router-dom";
import { Badge, Card, Loading } from "../../../../components/ui";

export default function NewsSection({ articles, loading, error }) {
  return (
    <section
      id="berita"
      className="scroll-mt-10 bg-hmif-surface px-5 py-16 sm:px-8 sm:py-24"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-hmif-teal">
              Kabar Terbaru
            </p>
            <h2 className="mt-4 font-heading text-3xl font-extrabold tracking-tight text-hmif-navy sm:text-4xl">
              Cerita dari HMIF.
            </h2>
          </div>
          <Link
            to="/berita"
            className="inline-flex items-center gap-2 text-sm font-extrabold text-hmif-teal hover:gap-3"
          >
            Semua berita <span aria-hidden="true">→</span>
          </Link>
        </div>

        {loading ? (
          <Loading label="Memuat berita terbaru..." />
        ) : error ? (
          <p className="py-12 text-sm text-red-600">{error}</p>
        ) : articles.length === 0 ? (
          <Card className="mt-8 rounded-2xl border-dashed border-slate-300 px-8 py-8 text-sm text-slate-500">
            Berita yang telah dipublikasikan akan tampil di sini.
          </Card>
        ) : (
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {articles.slice(0, 3).map((article) => (
              <Card
                key={article.id}
                as="article"
                padding="none"
                className="group overflow-hidden rounded-2xl border-slate-200/80 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-hmif-navy/5"
              >
                <Link to={`/berita/${encodeURIComponent(article.slug)}`}>
                  <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                    {article.cover_image ? (
                      <img
                        src={article.cover_image}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="grid h-full place-items-center bg-hmif-teal-dark font-heading text-4xl font-extrabold text-white">
                        H
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <Badge className="bg-hmif-surface text-xs font-extrabold text-hmif-teal">
                      {article.category_name}
                    </Badge>
                    <h3 className="mt-3 line-clamp-2 font-heading text-lg font-extrabold leading-snug text-hmif-navy group-hover:text-hmif-teal">
                      {article.title}
                    </h3>
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">
                      {article.excerpt}
                    </p>
                  </div>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
