import { useCallback, useEffect, useState } from "react";

import {
  createDivision,
  createMember,
  deleteDivision,
  deleteMember,
  getDivisions,
  getMemberById,
  getMembers,
  updateDivision,
  updateMember,
} from "../services/organizationService";

export default function useOrganization() {
  const [divisions, setDivisions] = useState([]);
  const [members, setMembers] = useState([]);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [divisionFilter, setDivisionFilter] = useState("");
  const [activeFilter, setActiveFilter] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [divisionForm, setDivisionForm] = useState({
    open: false,
    data: null,
  });

  const [memberForm, setMemberForm] = useState({
    open: false,
    data: null,
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [divisionResult, memberResult] = await Promise.all([
        getDivisions(),
        getMembers({
          search,
          division_id: divisionFilter,
          is_active: activeFilter,
        }),
      ]);

      setDivisions(divisionResult.divisions || []);
      setMembers(memberResult.members || []);
    } catch (err) {
      setError(err.message || "Gagal memuat data organisasi.");
    } finally {
      setLoading(false);
    }
  }, [search, divisionFilter, activeFilter]);

  useEffect(() => {
    let active = true;

    async function fetchInitialData() {
      try {
        const [divisionResult, memberResult] = await Promise.all([
          getDivisions(),
          getMembers({
            search,
            division_id: divisionFilter,
            is_active: activeFilter,
          }),
        ]);

        if (!active) return;

        setDivisions(divisionResult.divisions || []);
        setMembers(memberResult.members || []);
        setError("");
      } catch (err) {
        if (active) {
          setError(err.message || "Gagal memuat data organisasi.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchInitialData();

    return () => {
      active = false;
    };
  }, [search, divisionFilter, activeFilter]);

  function applySearch(event) {
    event.preventDefault();
    setSearch(searchInput.trim());
  }

  function changeFilter(setter, value) {
    setter(value);
  }

  function openCreateDivision() {
    setDivisionForm({ open: true, data: null });
    setError("");
    setNotice("");
  }

  function openEditDivision(division) {
    setDivisionForm({ open: true, data: division });
    setError("");
    setNotice("");
  }

  function closeDivisionForm() {
    setDivisionForm({ open: false, data: null });
  }

  async function handleSaveDivision(data) {
    setSaving(true);
    setError("");

    try {
      if (divisionForm.data) {
        await updateDivision(divisionForm.data.id, data);
        setNotice("Divisi berhasil diperbarui.");
      } else {
        await createDivision(data);
        setNotice("Divisi berhasil ditambahkan.");
      }

      closeDivisionForm();
      await loadData();
    } catch (err) {
      setError(err.message || "Gagal menyimpan divisi.");
      throw err;
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteDivision(division) {
    const confirmed = window.confirm(
      `Hapus divisi "${division.name}"? Data pengurus dan program yang terkait tidak ikut dihapus, tetapi relasi divisinya akan dikosongkan.`,
    );

    if (!confirmed) return;

    setDeletingId(`division-${division.id}`);
    setError("");
    setNotice("");

    try {
      await deleteDivision(division.id);
      setNotice("Divisi berhasil dihapus.");
      await loadData();
    } catch (err) {
      setError(err.message || "Gagal menghapus divisi.");
    } finally {
      setDeletingId(null);
    }
  }

  function openCreateMember() {
    setMemberForm({ open: true, data: null });
    setError("");
    setNotice("");
  }

  async function openEditMember(memberId) {
    setError("");
    setNotice("");

    try {
      const result = await getMemberById(memberId);
      setMemberForm({ open: true, data: result.member });
    } catch (err) {
      setError(err.message || "Gagal memuat detail pengurus.");
    }
  }

  function closeMemberForm() {
    setMemberForm({ open: false, data: null });
  }

  async function handleSaveMember(data) {
    setSaving(true);
    setError("");

    try {
      if (memberForm.data) {
        await updateMember(memberForm.data.id, data);
        setNotice("Data pengurus berhasil diperbarui.");
      } else {
        await createMember(data);
        setNotice("Pengurus berhasil ditambahkan.");
      }

      closeMemberForm();
      await loadData();
    } catch (err) {
      setError(err.message || "Gagal menyimpan data pengurus.");
      throw err;
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteMember(member) {
    const confirmed = window.confirm(
      `Hapus data pengurus "${member.name}"? Tindakan ini tidak dapat dibatalkan.`,
    );

    if (!confirmed) return;

    setDeletingId(`member-${member.id}`);
    setError("");
    setNotice("");

    try {
      await deleteMember(member.id);
      setNotice("Data pengurus berhasil dihapus.");
      await loadData();
    } catch (err) {
      setError(err.message || "Gagal menghapus data pengurus.");
    } finally {
      setDeletingId(null);
    }
  }

  return {
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
    changeFilter,
    loadData,
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
  };
}
