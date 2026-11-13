import { Card } from "../../../../components/ui";
import { nextSteps } from "../data/overviewData";

export default function NextSteps() {
  return (
    <Card as="article" className="rounded-2xl p-5 sm:p-6">
      <h2 className="font-heading text-base font-extrabold text-hmif-navy">
        Langkah Selanjutnya
      </h2>

      <p className="mt-1 text-xs leading-5 text-slate-500">
        Lanjutkan pengembangan CMS HMIF.
      </p>

      <div className="mt-5 space-y-4">
        {nextSteps.map((item) => (
          <div key={item.number} className="flex gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-hmif-surface text-xs font-extrabold text-hmif-teal">
              {item.number}
            </span>

            <div className="min-w-0 pt-0.5">
              <p className="text-sm font-bold text-hmif-navy">{item.title}</p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                {item.detail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
