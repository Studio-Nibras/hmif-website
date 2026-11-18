import { Link } from "react-router-dom";
import { Badge, Card } from "../../../../components/ui";

const statusLabels = {
  planned: "Direncanakan",
  ongoing: "Sedang Berjalan",
  completed: "Selesai",
};

export default function ProgramCard({ program }) {
  return (
    <Card
      as="article"
      padding="none"
      className="group overflow-hidden rounded-2xl border-slate-200/80 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-hmif-navy/5"
    >
      <Link
        to={`/program-kerja/${encodeURIComponent(program.slug)}`}
        className="block"
        aria-label={`Lihat program ${program.name}`}
      >
        <div className="aspect-[16/10] overflow-hidden bg-hmif-surface">
          {program.cover_image ? (
            <img
              src={program.cover_image}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="grid h-full place-items-center bg-gradient-to-br from-hmif-teal to-hmif-navy">
              <span className="font-heading text-5xl font-extrabold text-white/80">
                H
              </span>
            </div>
          )}
        </div>

        <div className="p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-hmif-surface font-bold text-hmif-teal">
              {statusLabels[program.status] || program.status}
            </Badge>

            {program.period && (
              <span className="text-xs font-semibold text-slate-400">
                {program.period}
              </span>
            )}
          </div>

          <h2 className="mt-4 line-clamp-2 font-heading text-lg font-extrabold leading-snug text-hmif-navy transition group-hover:text-hmif-teal">
            {program.name}
          </h2>

          <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-500">
            {program.description || "Informasi program kerja HMIF."}
          </p>

          {program.division_name && (
            <p className="mt-4 text-xs font-semibold text-slate-400">
              {program.division_name}
            </p>
          )}

          <span className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-hmif-teal">
            Lihat detail <span aria-hidden="true">→</span>
          </span>
        </div>
      </Link>
    </Card>
  );
}
