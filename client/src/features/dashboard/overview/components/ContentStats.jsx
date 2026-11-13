import { Button, Loading } from "../../../../components/ui";
import StatCard from "./StatCard";
import { contentStats } from "../data/overviewData";
import useOverview from "../hooks/useOverview";

export default function ContentStats() {
  const { stats, loading, error, reload } = useOverview();

  return (
    <section className="mt-8">
      <div className="mb-4">
        <h2 className="font-heading text-lg font-extrabold text-hmif-navy">
          Ringkasan Konten
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Ikhtisar pengelolaan website HMIF.
        </p>
      </div>

      {loading ? (
        <Loading label="Memuat statistik..." />
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
          <p className="text-sm text-red-600">{error}</p>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={reload}
          >
            Coba Lagi
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {contentStats.map((stat) => (
            <StatCard
              key={stat.key}
              stat={{
                ...stat,
                value: stats?.[stat.key] ?? 0,
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}
