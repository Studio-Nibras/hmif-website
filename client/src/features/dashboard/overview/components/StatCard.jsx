import { Card } from "../../../../components/ui";

export default function StatCard({ stat }) {
  return (
    <Card
      as="article"
      className="rounded-2xl border-slate-200/80 p-5 shadow-slate-900/[0.02] transition hover:-translate-y-0.5 hover:shadow-md sm:p-6"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold text-slate-500">{stat.label}</p>
        <span
          className={`grid size-10 place-items-center rounded-xl text-xl font-bold ${stat.color}`}
        >
          {stat.icon}
        </span>
      </div>

      <p className="mt-5 font-heading text-3xl font-extrabold tracking-tight text-hmif-navy">
        {stat.value}
      </p>

      <p className="mt-2 text-xs text-slate-400">{stat.detail}</p>
    </Card>
  );
}
