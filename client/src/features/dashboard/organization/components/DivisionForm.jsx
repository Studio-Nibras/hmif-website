import { useState } from "react";

import { Button, Input, Modal, Textarea } from "../../../../components/ui";

export default function DivisionForm({
  initialData,
  onClose,
  onSave,
  saving = false,
}) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    display_order: initialData?.display_order ?? 0,
  });

  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!formData.name.trim()) {
      setError("Nama divisi wajib diisi.");
      return;
    }

    try {
      await onSave({
        name: formData.name.trim(),
        description: formData.description.trim(),
        display_order: Number(formData.display_order) || 0,
      });
    } catch (err) {
      setError(err.message || "Gagal menyimpan divisi.");
    }
  }

  return (
    <Modal
      open
      onClose={saving ? undefined : onClose}
      title={initialData ? "Edit Divisi" : "Tambah Divisi"}
      description="Atur informasi divisi dalam struktur organisasi HMIF."
      size="lg"
      closeOnBackdrop={!saving}
      closeOnEscape={!saving}
      footer={
        <>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={saving}
          >
            Batal
          </Button>

          <Button type="submit" form="division-form" loading={saving}>
            Simpan Divisi
          </Button>
        </>
      }
    >
      <form id="division-form" onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div
            role="alert"
            className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <Input
          label="Nama Divisi"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Contoh: Divisi Pengembangan"
          required
          maxLength={150}
        />

        <Textarea
          label="Deskripsi"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Jelaskan tugas atau fokus divisi..."
          rows={4}
        />

        <Input
          label="Urutan Tampil"
          name="display_order"
          type="number"
          min="0"
          step="1"
          value={formData.display_order}
          onChange={handleChange}
          helperText="Angka lebih kecil akan ditampilkan lebih dahulu."
        />
      </form>
    </Modal>
  );
}
