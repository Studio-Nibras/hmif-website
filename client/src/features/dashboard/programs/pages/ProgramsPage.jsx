import {
  Button,
  Card,
  Input,
  Loading,
  Select,
} from "../../../../components/ui";

import ProgramForm from "../components/ProgramForm";

import {
  ExecutionStatusBadge,
  PublicationStatusBadge,
} from "../components/ProgramStatusBadge";

import usePrograms from "../hooks/usePrograms";
import { formatDateRange } from "../utils/programFormatters";

export default function ProgramsPage() {
  const {
    programs,
    divisions,
    pagination,
    searchInput,
    setSearchInput,
    status,
    setStatus,
    publicationStatus,
    setPublicationStatus,
    divisionId,
    setDivisionId,
    loading,
    error,
    setError,
    notice,
    setNotice,
    formData,
    formOpen,
    deletingId,
    applySearch,
    changeFilter,
    changePage,
    openEdit,
    handleDelete,
    handleSaved,
    openCreate,
    closeForm,
  } = usePrograms();

  return (
    <section>
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-hmif-teal">
            Content Management
          </p>

          <h2 className="mt-2 font-heading text-2xl font-extrabold text-hmif-navy">
            Manajemen Program Kerja
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Kelola program kerja dan kegiatan HMIF UNIBA.
          </p>
        </div>

        <Button type="button" onClick={openCreate}>
          + Tambah Program
        </Button>
      </div>

      <div className="mb-5 grid gap-4 sm:grid-cols-2">
        <Card className="rounded-2xl p-5">
          <p className="text-sm text-slate-500">Total program</p>
          <p className="mt-2 text-2xl font-extrabold text-hmif-navy">
            {pagination.total}
          </p>
        </Card>

        <Card className="rounded-2xl p-5">
          <p className="text-sm text-slate-500">Total divisi tersedia</p>
          <p className="mt-2 text-2xl font-extrabold text-hmif-navy">
            {divisions.length}
          </p>
        </Card>
      </div>

      <Card className="rounded-2xl p-5 sm:p-6">
        <form
          onSubmit={applySearch}
          className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(180px,1fr)_170px_170px_170px_auto]"
        >
          <Input
            type="search"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Cari nama program..."
            aria-label="Cari program kerja"
            className="min-w-0"
          />

          <Select
            value={divisionId}
            onChange={(event) =>
              changeFilter(setDivisionId, event.target.value)
            }
            aria-label="Filter divisi"
            placeholder="Semua divisi"
            options={divisions.map((division) => ({
              value: String(division.id),
              label: division.name,
            }))}
          />

          <Select
            value={status}
            onChange={(event) => changeFilter(setStatus, event.target.value)}
            aria-label="Filter status pelaksanaan"
            placeholder="Semua pelaksanaan"
            options={[
              { value: "planned", label: "Planned" },
              { value: "ongoing", label: "Ongoing" },
              { value: "completed", label: "Completed" },
            ]}
          />

          <Select
            value={publicationStatus}
            onChange={(event) =>
              changeFilter(setPublicationStatus, event.target.value)
            }
            aria-label="Filter status publikasi"
            placeholder="Semua publikasi"
            options={[
              { value: "draft", label: "Draft" },
              { value: "published", label: "Published" },
            ]}
          />

          <Button type="submit" className="bg-hmif-navy hover:bg-hmif-teal">
            Cari
          </Button>
        </form>

        {notice && (
          <div className="mb-4 flex items-center justify-between gap-3 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            <span>{notice}</span>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setNotice("")}
              aria-label="Tutup pesan"
            >
              ×
            </Button>
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="mb-4 flex items-center justify-between gap-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            <span>{error}</span>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setError("")}
              aria-label="Tutup pesan"
            >
              ×
            </Button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase tracking-wider text-slate-400">
                <th className="px-3 py-4 font-bold">Program</th>
                <th className="px-3 py-4 font-bold">Divisi</th>
                <th className="px-3 py-4 font-bold">Pelaksanaan</th>
                <th className="px-3 py-4 font-bold">Publikasi</th>
                <th className="px-3 py-4 font-bold">Periode</th>
                <th className="px-3 py-4 text-right font-bold">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-3 py-14 text-center text-sm text-slate-500"
                  >
                    <Loading
                      size="sm"
                      label="Memuat program kerja..."
                      className="justify-center py-0"
                    />
                  </td>
                </tr>
              ) : programs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-3 py-14 text-center">
                    <p className="font-bold text-hmif-navy">
                      Belum ada program kerja
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Tambahkan program pertama atau ubah filter pencarian.
                    </p>
                  </td>
                </tr>
              ) : (
                programs.map((program) => (
                  <tr
                    key={program.id}
                    className="transition hover:bg-slate-50/70"
                  >
                    <td className="max-w-sm px-3 py-4">
                      <div className="flex items-center gap-3">
                        {program.cover_image ? (
                          <img
                            src={program.cover_image}
                            alt=""
                            className="h-12 w-16 shrink-0 rounded-lg bg-slate-100 object-cover"
                          />
                        ) : (
                          <div className="flex h-12 w-16 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs text-slate-400">
                            No img
                          </div>
                        )}

                        <div className="min-w-0">
                          <p className="font-bold text-hmif-navy">
                            {program.name}
                          </p>

                          <p className="mt-1 truncate text-xs text-slate-400">
                            /{program.slug}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-3 py-4 text-sm text-slate-600">
                      {program.division_name || "-"}
                    </td>

                    <td className="px-3 py-4">
                      <ExecutionStatusBadge status={program.status} />
                    </td>

                    <td className="px-3 py-4">
                      <PublicationStatusBadge
                        status={program.publication_status}
                      />
                    </td>

                    <td className="px-3 py-4 text-sm text-slate-500">
                      <p>{program.period}</p>
                      <p className="mt-1 text-xs text-slate-400">
                        {formatDateRange(program.start_date, program.end_date)}
                      </p>
                    </td>

                    <td className="px-3 py-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          onClick={() => openEdit(program.id)}
                          variant="secondary"
                          size="sm"
                          className="min-h-8 rounded-lg px-3 text-xs"
                        >
                          Edit
                        </Button>

                        <Button
                          type="button"
                          onClick={() => handleDelete(program)}
                          loading={deletingId === program.id}
                          variant="danger"
                          size="sm"
                          className="min-h-8 rounded-lg px-3 text-xs"
                        >
                          {deletingId === program.id ? "Menghapus..." : "Hapus"}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            Menampilkan {programs.length} dari {pagination.total} program
          </p>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              disabled={pagination.page <= 1 || loading}
              onClick={() => changePage(pagination.page - 1)}
              variant="secondary"
              size="sm"
              className="rounded-lg text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Sebelumnya
            </Button>

            <span className="px-2 text-sm text-slate-500">
              {pagination.page} / {Math.max(1, pagination.totalPages)}
            </span>

            <Button
              type="button"
              disabled={pagination.page >= pagination.totalPages || loading}
              onClick={() => changePage(pagination.page + 1)}
              variant="secondary"
              size="sm"
              className="rounded-lg text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Berikutnya
            </Button>
          </div>
        </div>
      </Card>

      {formOpen && (
        <ProgramForm
          initialData={formData}
          divisions={divisions}
          onClose={closeForm}
          onSaved={handleSaved}
        />
      )}
    </section>
  );
}
