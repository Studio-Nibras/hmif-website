import { Button, Card } from "../../../components/ui";

export default function DashboardPlaceholder({
  title,
  icon,
  onBack,
}) {
  return (
    <Card
      as="section"
      className="rounded-3xl px-6 py-16 text-center sm:px-10"
    >
      <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-hmif-surface text-2xl text-hmif-teal">
        {icon}
      </div>

      <h2 className="mt-5 font-heading text-xl font-extrabold text-hmif-navy">
        {title}
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        Modul ini akan kita implementasikan berikutnya. Layout dashboard dan
        autentikasi admin tetap aktif.
      </p>

      <Button onClick={onBack} className="mt-6">
        Kembali ke overview
      </Button>
    </Card>
  );
}
