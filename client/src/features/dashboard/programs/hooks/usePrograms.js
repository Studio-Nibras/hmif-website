import { useEffect, useRef, useState } from "react";

import {
  deleteProgram,
  getProgramById,
  getProgramDivisions,
  getPrograms,
} from "../services/programsService";

export default function usePrograms() {
  const [programs, setPrograms] = useState([]);
  const [divisions, setDivisions] = useState([]);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [publicationStatus, setPublicationStatus] = useState("");
  const [divisionId, setDivisionId] = useState("");

  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [formData, setFormData] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const requestIdRef = useRef(0);

  useEffect(() => {
    let active = true;

    getProgramDivisions()
      .then((result) => {
        if (active) setDivisions(result.divisions || []);
      })
      .catch((err) => {
        if (active) {
          setError(err.message || "Gagal memuat data divisi.");
        }
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    const requestId = ++requestIdRef.current;

    getPrograms({
      page: pagination.page,
      limit: pagination.limit,
      search,
      status,
      publication_status: publicationStatus,
      division_id: divisionId,
    })
      .then((result) => {
        if (!active || requestId !== requestIdRef.current) return;

        setPrograms(result.programs || []);
        setPagination((current) => ({
          ...current,
          ...(result.pagination || {}),
        }));
        setError("");
      })
      .catch((err) => {
        if (active && requestId === requestIdRef.current) {
          setError(err.message || "Gagal memuat program kerja.");
        }
      })
      .finally(() => {
        if (active && requestId === requestIdRef.current) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
      requestIdRef.current += 1;
    };
  }, [
    pagination.page,
    pagination.limit,
    search,
    status,
    publicationStatus,
    divisionId,
    refreshKey,
  ]);

  function applySearch(event) {
    event.preventDefault();
    setLoading(true);
    setPagination((current) => ({ ...current, page: 1 }));
    setSearch(searchInput.trim());
  }

  function changeFilter(setter, value) {
    setLoading(true);
    setter(value);
    setPagination((current) => ({ ...current, page: 1 }));
  }

  function changePage(page) {
    setLoading(true);
    setPagination((current) => ({ ...current, page }));
  }

  async function openEdit(programId) {
    setError("");
    setNotice("");

    try {
      const result = await getProgramById(programId);
      setFormData(result.program);
      setFormOpen(true);
    } catch (err) {
      setError(err.message || "Gagal memuat detail program.");
    }
  }

  async function handleDelete(program) {
    const confirmed = window.confirm(
      `Hapus program "${program.name}"? Tindakan ini tidak dapat dibatalkan.`,
    );

    if (!confirmed) return;

    setDeletingId(program.id);
    setError("");
    setNotice("");

    try {
      await deleteProgram(program.id);
      setNotice("Program kerja berhasil dihapus.");

      if (programs.length === 1 && pagination.page > 1) {
        changePage(pagination.page - 1);
      } else {
        setLoading(true);
        setRefreshKey((current) => current + 1);
      }
    } catch (err) {
      setError(err.message || "Program kerja gagal dihapus.");
    } finally {
      setDeletingId(null);
    }
  }

  function handleSaved() {
    setFormOpen(false);
    setFormData(null);
    setNotice("Program kerja berhasil disimpan.");
    setLoading(true);

    setPagination((current) => ({ ...current, page: 1 }));
    setSearchInput("");
    setSearch("");
    setStatus("");
    setPublicationStatus("");
    setDivisionId("");
    setRefreshKey((current) => current + 1);
  }

  function openCreate() {
    setFormData(null);
    setFormOpen(true);
    setNotice("");
    setError("");
  }

  function closeForm() {
    setFormOpen(false);
    setFormData(null);
  }

  return {
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
  };
}
