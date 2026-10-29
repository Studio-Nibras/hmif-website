
import { Button, Card } from "../../../components/ui";
import Sidebar, { InitialAvatar } from "./components/Sidebar";

export default function AdminLayout({
  activeSection,
  onNavigate,
  onLogout,
  admin,
  loggingOut,
  pageTitle,
  error,
  onDismissError,
  children,
}) {
  return (
    <main className="min-h-screen bg-hmif-surface lg:flex">
      <Sidebar
        activeSection={activeSection}
        onNavigate={onNavigate}
        onLogout={onLogout}
        admin={admin}
        loggingOut={loggingOut}
      />

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
          <div className="flex min-h-[76px] items-center justify-between gap-4 px-5 sm:px-8 lg:px-10">
            <div>
              <p className="text-xs font-semibold text-slate-400">
                HMIF UNIBA / Admin
              </p>
              <h1 className="mt-1 font-heading text-lg font-extrabold text-hmif-navy">
                {pageTitle}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-bold text-hmif-navy">
                  {admin.name}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">
                  Administrator
                </p>
              </div>
              <InitialAvatar name={admin.name} />
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-[1600px] px-5 py-7 sm:px-8 sm:py-9 lg:px-10">
          {error && (
            <Card
              padding="sm"
              role="alert"
              className="mb-6 flex items-start justify-between gap-4 rounded-xl border-red-200 bg-red-50 text-sm text-red-700"
            >
              <p>{error}</p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onDismissError}
                aria-label="Tutup pesan"
                className="font-bold"
              >
                ×
              </Button>
            </Card>
          )}

          {children}
        </div>
      </div>
    </main>
  );
}
