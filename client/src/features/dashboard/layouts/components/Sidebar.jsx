import { Button } from "../../../../components/ui";
import navigation from "../navigation";

export function InitialAvatar({ name }) {
  const initials = (name || "Admin")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-hmif-teal text-sm font-extrabold text-white">
      {initials}
    </div>
  );
}

export default function Sidebar({
  activeSection,
  onNavigate,
  onLogout,
  admin,
  loggingOut,
}) {
  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-slate-200 bg-white lg:sticky lg:top-0 lg:h-screen lg:w-[258px] lg:border-r lg:border-b-0">
      <div className="flex items-center gap-3 px-5 py-5 lg:px-6 lg:py-7">
        <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-hmif-teal font-heading text-xl font-extrabold text-white shadow-lg shadow-hmif-teal/15">
          H
        </div>
        <div className="min-w-0">
          <p className="font-heading text-sm font-extrabold tracking-tight text-hmif-navy">
            HMIF UNIBA
          </p>
          <p className="mt-1 text-xs text-slate-500">Content Management</p>
        </div>
      </div>

      <div className="hidden px-6 pb-3 pt-2 lg:block">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-400">
          Workspace
        </p>
      </div>

      <nav
        aria-label="Navigasi dashboard"
        className="flex gap-1 overflow-x-auto px-4 pb-4 lg:flex-1 lg:flex-col lg:overflow-visible lg:px-3"
      >
        {navigation.map((item) => {
          const active = activeSection === item.section;

          return (
            <Button
              key={item.section}
              type="button"
              onClick={() => onNavigate(item.section)}
              aria-current={active ? "page" : undefined}
              variant="ghost"
              className={`flex shrink-0 items-center justify-start gap-3 rounded-xl px-4 py-3 text-left text-sm font-bold transition ${
                active
                  ? "bg-hmif-teal text-white shadow-md shadow-hmif-teal/15"
                  : "text-slate-500 hover:bg-slate-50 hover:text-hmif-teal"
              }`}
            >
              <span className="grid size-6 place-items-center text-lg">
                {item.icon}
              </span>
              {item.label}
              {active && (
                <span className="ml-auto hidden size-1.5 rounded-full bg-hmif-cyan lg:block" />
              )}
            </Button>
          );
        })}

        <div className="hidden px-3 pb-1 pt-7 lg:block">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-400">
            System
          </p>
        </div>

        <Button
          type="button"
          onClick={() => onNavigate("settings")}
          variant="ghost"
          className={`flex shrink-0 items-center justify-start gap-3 rounded-xl px-4 py-3 text-left text-sm font-bold transition ${
            activeSection === "settings"
              ? "bg-hmif-teal text-white"
              : "text-slate-500 hover:bg-slate-50 hover:text-hmif-teal"
          }`}
        >
          <span className="grid size-6 place-items-center text-lg">⚙</span>
          Pengaturan Website
        </Button>
      </nav>

      <div className="hidden border-t border-slate-100 p-4 lg:block">
        <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
          <InitialAvatar name={admin?.name} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-hmif-navy">
              {admin?.name || "Administrator"}
            </p>
            <p className="truncate text-xs text-slate-500">Administrator</p>
          </div>
          <Button
            type="button"
            onClick={onLogout}
            disabled={loggingOut}
            title="Keluar"
            aria-label="Keluar"
            variant="ghost"
            size="sm"
            className="size-9 shrink-0 rounded-xl px-0 text-slate-400 hover:bg-red-50 hover:text-red-600"
          >
            ↗
          </Button>
        </div>
      </div>
    </aside>
  );
}
