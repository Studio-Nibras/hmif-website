import {
  Button,
  Card,
  Input,
  Loading,
  Select,
} from "../../../../components/ui";

import useOrganization from "../hooks/useOrganization";
import DivisionForm from "../components/DivisionForm";
import MemberForm from "../components/MemberForm";

export default function OrganizationPage() {
  const {
    divisions,
    members,
    searchInput,
    setSearchInput,
    divisionFilter,
    setDivisionFilter,
    activeFilter,
    setActiveFilter,
    loading,
    saving,
    deletingId,
    error,
    setError,
    notice,
    setNotice,
    divisionForm,
    memberForm,
    applySearch,
    openCreateDivision,
    openEditDivision,
    closeDivisionForm,
    handleSaveDivision,
    handleDeleteDivision,
    openCreateMember,
    openEditMember,
    closeMemberForm,
    handleSaveMember,
    handleDeleteMember,
  } = useOrganization();

  return (
    <section>
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-hmif-teal">
            Organization Management
          </p>

          <h2 className="mt-2 font-heading text-2xl font-extrabold text-hmif-navy">
            Struktur Organisasi
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Kelola divisi dan data pengurus HMIF UNIBA.
          </p>
        </div>

        <Button type="button" onClick={openCreateMember}>
          + Tambah Pengurus
        </Button>
      </div>

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

      <div className="mb-5 grid gap-4 sm:grid-cols-2">
        <Card className="rounded-2xl p-5">
          <p className="text-sm text-slate-500">Total divisi</p>
          <p className="mt-2 text-2xl font-extrabold text-hmif-navy">
            {divisions.length}
          </p>
        </Card>

        <Card className="rounded-2xl p-5">
          <p className="text-sm text-slate-500">Pengurus ditemukan</p>
          <p className="mt-2 text-2xl font-extrabold text-hmif-navy">
            {members.length}
          </p>
        </Card>
      </div>

      <Card className="mb-6 rounded-2xl p-5 sm:p-6">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-heading text-lg font-bold text-hmif-navy">
              Manajemen Divisi
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Atur daftar divisi dalam struktur organisasi.
            </p>
          </div>

          <Button type="button" onClick={openCreateDivision}>
            + Tambah Divisi
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase tracking-wider text-slate-400">
                <th className="px-3 py-4 font-bold">Nama Divisi</th>
                <th className="px-3 py-4 font-bold">Deskripsi</th>
                <th className="px-3 py-4 font-bold">Urutan</th>
                <th className="px-3 py-4 text-right font-bold">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-3 py-10 text-center">
                    <Loading
                      size="sm"
                      label="Memuat divisi..."
                      className="justify-center py-0"
                    />
                  </td>
                </tr>
              ) : divisions.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-3 py-10 text-center">
                    <p className="font-bold text-hmif-navy">
                      Belum ada divisi
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Tambahkan divisi sesuai struktur organisasi yang berlaku.
                    </p>
                  </td>
                </tr>
              ) : (
                divisions.map((division) => (
                  <tr key={division.id} className="hover:bg-slate-50/70">
                    <td className="px-3 py-4 text-sm font-bold text-hmif-navy">
                      {division.name}
                    </td>

                    <td className="max-w-md px-3 py-4 text-sm text-slate-500">
                      <p className="line-clamp-2">
                        {division.description || "-"}
                      </p>
                    </td>

                    <td className="px-3 py-4 text-sm text-slate-600">
                      {division.display_order}
                    </td>

                    <td className="px-3 py-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => openEditDivision(division)}
                        >
                          Edit
                        </Button>

                        <Button
                          type="button"
                          variant="danger"
                          size="sm"
                          loading={deletingId === `division-${division.id}`}
                          onClick={() => handleDeleteDivision(division)}
                        >
                          Hapus
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="rounded-2xl p-5 sm:p-6">
        <div className="mb-5">
          <h3 className="font-heading text-lg font-bold text-hmif-navy">
            Manajemen Pengurus
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Kelola profil, jabatan, divisi, dan status pengurus.
          </p>
        </div>

        <form
          onSubmit={applySearch}
          className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(180px,1fr)_200px_180px_auto]"
        >
          <Input
            type="search"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Cari nama atau jabatan..."
            aria-label="Cari pengurus"
          />

          <Select
            value={divisionFilter}
            onChange={(event) => setDivisionFilter(event.target.value)}
            aria-label="Filter divisi pengurus"
            placeholder="Semua divisi"
            options={divisions.map((division) => ({
              value: String(division.id),
              label: division.name,
            }))}
          />

          <Select
            value={activeFilter}
            onChange={(event) => setActiveFilter(event.target.value)}
            aria-label="Filter status pengurus"
            placeholder="Semua status"
            options={[
              { value: "1", label: "Aktif" },
              { value: "0", label: "Nonaktif" },
            ]}
          />

          <Button type="submit" className="bg-hmif-navy hover:bg-hmif-teal">
            Cari
          </Button>
        </form>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase tracking-wider text-slate-400">
                <th className="px-3 py-4 font-bold">Pengurus</th>
                <th className="px-3 py-4 font-bold">Jabatan</th>
                <th className="px-3 py-4 font-bold">Divisi</th>
                <th className="px-3 py-4 font-bold">Periode</th>
                <th className="px-3 py-4 font-bold">Status</th>
                <th className="px-3 py-4 text-right font-bold">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-3 py-10 text-center">
                    <Loading
                      size="sm"
                      label="Memuat pengurus..."
                      className="justify-center py-0"
                    />
                  </td>
                </tr>
              ) : members.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-3 py-10 text-center">
                    <p className="font-bold text-hmif-navy">
                      Belum ada data pengurus
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Tambahkan data pengurus atau ubah filter pencarian.
                    </p>
                  </td>
                </tr>
              ) : (
                members.map((member) => {
                  const isActive = ![false, 0, "0"].includes(member.is_active);

                  return (
                    <tr key={member.id} className="hover:bg-slate-50/70">
                      <td className="px-3 py-4">
                        <div className="flex items-center gap-3">
                          {member.photo_url ? (
                            <img
                              src={member.photo_url}
                              alt=""
                              className="size-11 shrink-0 rounded-full bg-slate-100 object-cover"
                            />
                          ) : (
                            <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-hmif-teal/10 text-sm font-bold text-hmif-teal">
                              {member.name?.charAt(0)?.toUpperCase() || "?"}
                            </div>
                          )}

                          <div>
                            <p className="font-bold text-hmif-navy">
                              {member.name}
                            </p>
                            <p className="mt-1 text-xs text-slate-400">
                              Urutan: {member.display_order}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-3 py-4 text-sm text-slate-600">
                        {member.position}
                      </td>

                      <td className="px-3 py-4 text-sm text-slate-600">
                        {member.division_name || "-"}
                      </td>

                      <td className="px-3 py-4 text-sm text-slate-600">
                        {member.term_start || member.term_end
                          ? `${member.term_start || "—"}–${member.term_end || "—"}`
                          : "-"}
                      </td>

                      <td className="px-3 py-4">
                        <span
                          className={[
                            "inline-flex rounded-full px-2.5 py-1 text-xs font-bold",
                            isActive
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-slate-100 text-slate-500",
                          ].join(" ")}
                        >
                          {isActive ? "Aktif" : "Nonaktif"}
                        </span>
                      </td>

                      <td className="px-3 py-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => openEditMember(member.id)}
                          >
                            Edit
                          </Button>

                          <Button
                            type="button"
                            variant="danger"
                            size="sm"
                            loading={deletingId === `member-${member.id}`}
                            onClick={() => handleDeleteMember(member)}
                          >
                            Hapus
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {divisionForm.open && (
        <DivisionForm
          initialData={divisionForm.data}
          onClose={closeDivisionForm}
          onSave={handleSaveDivision}
          saving={saving}
        />
      )}

      {memberForm.open && (
        <MemberForm
          initialData={memberForm.data}
          divisions={divisions}
          onClose={closeMemberForm}
          onSave={handleSaveMember}
          saving={saving}
        />
      )}
    </section>
  );
}
