import { Card, Loading } from "../../../../components/ui";
import usePublicationActivity from "../hooks/usePublicationActivity";

export default function PublicationActivity() {
  const { activity, loading, error } = usePublicationActivity();

  const maxTotal = Math.max(...activity.map((item) => item.total), 1);

  return (
    <Card as="article" className="rounded-2xl p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-heading text-base font-extrabold text-hmif-navy">
            Aktivitas Publikasi
          </h2>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Jumlah berita yang diterbitkan dalam enam bulan terakhir.
          </p>
        </div>

        <span className="rounded-lg bg-slate-50 px-3 py-2 text-xs font-bold text-slate-500">
          6 Bulan
        </span>
      </div>

      {loading ? (
        <div className="flex min-h-52 items-center justify-center">
          <Loading label="Memuat aktivitas publikasi..." />
        </div>
      ) : error ? (
        <div className="mt-6 flex min-h-44 items-center justify-center rounded-xl bg-red-50 px-5 text-center">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      ) : (
        <div className="mt-7">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Jumlah berita</p>
            <p className="text-xs font-semibold text-hmif-teal">
              {activity.reduce((sum, item) => sum + item.total, 0)} publikasi
            </p>
          </div>

          <div className="grid h-48 grid-cols-6 gap-3 border-b border-slate-100">
            {activity.map((item) => (
              <div
                key={item.month}
                className="flex min-w-0 flex-col items-center justify-end gap-2"
              >
                <span className="text-xs font-bold text-hmif-navy">
                  {item.total}
                </span>

                <div className="flex h-36 w-full items-end justify-center">
                  <div
                    className="w-full max-w-10 rounded-t-lg bg-hmif-teal transition-all duration-500"
                    style={{
                      height: `${Math.max(
                        (item.total / maxTotal) * 100,
                        item.total > 0 ? 5 : 0,
                      )}%`,
                    }}
                    title={`${item.total} publikasi pada ${item.month}`}
                  />
                </div>

                <span className="pb-2 text-[11px] font-medium text-slate-500">
                  {item.month}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
