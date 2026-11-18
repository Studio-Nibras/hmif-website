function validateId(value) {
  const id = Number(value);

  if (!Number.isSafeInteger(id) || id <= 0) {
    const error = new Error("ID tidak valid.");
    error.status = 400;
    throw error;
  }

  return id;
}

function validateDivision(data) {
  const name = typeof data.name === "string" ? data.name.trim() : "";

  if (!name) {
    const error = new Error("Nama divisi wajib diisi.");
    error.status = 400;
    throw error;
  }

  if (name.length > 150) {
    const error = new Error("Nama divisi maksimal 150 karakter.");
    error.status = 400;
    throw error;
  }

  const displayOrder = Number(data.display_order ?? 0);

  if (!Number.isInteger(displayOrder)) {
    const error = new Error("Urutan divisi harus berupa bilangan bulat.");
    error.status = 400;
    throw error;
  }

  return {
    name,
    description:
      typeof data.description === "string" && data.description.trim()
        ? data.description.trim()
        : null,
    display_order: displayOrder,
  };
}

function validateMember(data) {
  const name = typeof data.name === "string" ? data.name.trim() : "";
  const position =
    typeof data.position === "string" ? data.position.trim() : "";

  if (!name || !position) {
    const error = new Error("Nama pengurus dan jabatan wajib diisi.");
    error.status = 400;
    throw error;
  }

  if (name.length > 150 || position.length > 150) {
    const error = new Error("Nama dan jabatan maksimal 150 karakter.");
    error.status = 400;
    throw error;
  }

  const divisionId =
    data.division_id === "" || data.division_id === null
      ? null
      : data.division_id === undefined
        ? null
        : validateId(data.division_id);

  const parseYear = (value, fieldName) => {
    if (value === "" || value === null || value === undefined) {
      return null;
    }

    const year = Number(value);

    if (!Number.isInteger(year) || year < 1901 || year > 2155) {
      const error = new Error(`${fieldName} tidak valid.`);
      error.status = 400;
      throw error;
    }

    return year;
  };

  const termStart = parseYear(data.term_start, "Tahun mulai");
  const termEnd = parseYear(data.term_end, "Tahun selesai");

  if (termStart && termEnd && termEnd < termStart) {
    const error = new Error("Tahun selesai tidak boleh sebelum tahun mulai.");
    error.status = 400;
    throw error;
  }

  const displayOrder = Number(data.display_order ?? 0);

  if (!Number.isInteger(displayOrder)) {
    const error = new Error("Urutan pengurus harus berupa bilangan bulat.");
    error.status = 400;
    throw error;
  }

  if (
    data.is_active !== undefined &&
    data.is_active !== true &&
    data.is_active !== false &&
    data.is_active !== 1 &&
    data.is_active !== 0 &&
    data.is_active !== "1" &&
    data.is_active !== "0"
  ) {
    const error = new Error("Status pengurus tidak valid.");
    error.status = 400;
    throw error;
  }

  return {
    division_id: divisionId,
    name,
    position,
    photo_url:
      typeof data.photo_url === "string" && data.photo_url.trim()
        ? data.photo_url.trim()
        : null,
    bio:
      typeof data.bio === "string" && data.bio.trim() ? data.bio.trim() : null,
    term_start: termStart,
    term_end: termEnd,
    display_order: displayOrder,
    is_active:
      data.is_active === undefined
        ? true
        : data.is_active === true ||
          data.is_active === 1 ||
          data.is_active === "1",
  };
}

module.exports = {
  validateId,
  validateDivision,
  validateMember,
};
