const allowedStatuses = ["planned", "ongoing", "completed"];
const allowedPublicationStatuses = ["draft", "published"];

function isValidDate(value) {
  if (!value) return true;

  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  return (
    !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === value
  );
}

function validateProgram(body) {
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const description =
    typeof body.description === "string" ? body.description.trim() : "";
  const period = typeof body.period === "string" ? body.period.trim() : "";
  const picName =
    typeof body.pic_name === "string" ? body.pic_name.trim() : null;
  const coverImage =
    typeof body.cover_image === "string" ? body.cover_image.trim() : "";
  const status = body.status || "planned";
  const publicationStatus = body.publication_status || "draft";

  const divisionId =
    body.division_id === "" ||
    body.division_id === null ||
    body.division_id === undefined
      ? null
      : Number(body.division_id);

  const startDate = body.start_date || null;
  const endDate = body.end_date || null;

  const displayOrder =
    body.display_order === "" ||
    body.display_order === null ||
    body.display_order === undefined
      ? 0
      : Number(body.display_order);

  if (!name || name.length > 255) {
    return { error: "Nama program wajib diisi dan maksimal 255 karakter." };
  }

  if (!description) {
    return { error: "Deskripsi program wajib diisi." };
  }

  if (!period || period.length > 100) {
    return { error: "Periode program wajib diisi dan maksimal 100 karakter." };
  }

  if (picName && picName.length > 150) {
    return { error: "Nama PIC maksimal 150 karakter." };
  }

  if (
    divisionId !== null &&
    (!Number.isSafeInteger(divisionId) || divisionId < 1)
  ) {
    return { error: "Divisi tidak valid." };
  }

  if (!allowedStatuses.includes(status)) {
    return { error: "Status pelaksanaan program tidak valid." };
  }

  if (!allowedPublicationStatuses.includes(publicationStatus)) {
    return { error: "Status publikasi program tidak valid." };
  }

  if (!Number.isSafeInteger(displayOrder)) {
    return { error: "Urutan tampilan harus berupa bilangan bulat." };
  }

  if (coverImage.length > 500) {
    return { error: "URL gambar maksimal 500 karakter." };
  }

  if (!isValidDate(startDate) || !isValidDate(endDate)) {
    return { error: "Format tanggal tidak valid." };
  }

  if (startDate && endDate && endDate < startDate) {
    return { error: "Tanggal selesai tidak boleh sebelum tanggal mulai." };
  }

  return {
    data: {
      name,
      description,
      period,
      divisionId,
      picName: picName || null,
      startDate,
      endDate,
      status,
      publicationStatus,
      coverImage: coverImage || null,
      displayOrder,
    },
  };
}

function validateId(value) {
  const id = Number(value);

  if (!Number.isSafeInteger(id) || id < 1) {
    return null;
  }

  return id;
}

function validateProgramFilters(query) {
  const page = Math.max(1, Number.parseInt(query.page, 10) || 1);
  const limit = Math.min(
    100,
    Math.max(1, Number.parseInt(query.limit, 10) || 10),
  );

  const search = typeof query.search === "string" ? query.search.trim() : "";
  const status = typeof query.status === "string" ? query.status : "";
  const publicationStatus =
    typeof query.publication_status === "string"
      ? query.publication_status
      : "";

  const divisionId = query.division_id
    ? Number(query.division_id)
    : null;

  if (status && !allowedStatuses.includes(status)) {
    return { error: "Filter status pelaksanaan tidak valid." };
  }

  if (
    publicationStatus &&
    !allowedPublicationStatuses.includes(publicationStatus)
  ) {
    return { error: "Filter status publikasi tidak valid." };
  }

  if (
    divisionId !== null &&
    (!Number.isSafeInteger(divisionId) || divisionId < 1)
  ) {
    return { error: "Filter divisi tidak valid." };
  }

  return {
    data: {
      page,
      limit,
      offset: (page - 1) * limit,
      search,
      status,
      publicationStatus,
      divisionId,
    },
  };
}

module.exports = {
  allowedStatuses,
  allowedPublicationStatuses,
  validateProgram,
  validateId,
  validateProgramFilters,
};
