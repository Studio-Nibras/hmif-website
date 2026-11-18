const pool = require("../../config/database");
const { uniqueSlug } = require("./programs.utils");

async function getPrograms(filters) {
  const conditions = [];
  const params = [];

  if (filters.search) {
    conditions.push("(p.name LIKE ? OR p.description LIKE ?)");
    params.push(`%${filters.search}%`, `%${filters.search}%`);
  }

  if (filters.status) {
    conditions.push("p.status = ?");
    params.push(filters.status);
  }

  if (filters.publicationStatus) {
    conditions.push("p.publication_status = ?");
    params.push(filters.publicationStatus);
  }

  if (filters.divisionId !== null) {
    conditions.push("p.division_id = ?");
    params.push(filters.divisionId);
  }

  const whereClause = conditions.length
    ? `WHERE ${conditions.join(" AND ")}`
    : "";

  const [countRows] = await pool.execute(
    `SELECT COUNT(*) AS total
     FROM programs p
     ${whereClause}`,
    params,
  );

  const [programs] = await pool.execute(
    `SELECT
       p.id,
       p.division_id,
       d.name AS division_name,
       p.name,
       p.slug,
       p.description,
       p.period,
       p.pic_name,
       p.start_date,
       p.end_date,
       p.status,
       p.publication_status,
       p.cover_image,
       p.display_order,
       p.created_at,
       p.updated_at
     FROM programs p
     LEFT JOIN organization_divisions d ON d.id = p.division_id
     ${whereClause}
     ORDER BY p.display_order ASC, p.created_at DESC
     LIMIT ? OFFSET ?`,
    [...params, filters.limit, filters.offset],
  );

  const total = Number(countRows[0].total);

  return {
    programs,
    pagination: {
      page: filters.page,
      limit: filters.limit,
      total,
      totalPages: Math.ceil(total / filters.limit),
    },
  };
}

async function getProgramById(id) {
  const [rows] = await pool.execute(
    `SELECT
       p.*,
       d.name AS division_name
     FROM programs p
     LEFT JOIN organization_divisions d ON d.id = p.division_id
     WHERE p.id = ?
     LIMIT 1`,
    [id],
  );

  return rows[0] || null;
}

async function getDivisions() {
  const [rows] = await pool.query(
    `SELECT id, name
     FROM organization_divisions
     ORDER BY display_order ASC, name ASC`,
  );

  return rows;
}

async function validateDivision(divisionId) {
  if (divisionId === null) {
    return true;
  }

  const [rows] = await pool.execute(
    "SELECT id FROM organization_divisions WHERE id = ? LIMIT 1",
    [divisionId],
  );

  return rows.length > 0;
}

async function createProgram(data) {
  const divisionExists = await validateDivision(data.divisionId);

  if (!divisionExists) {
    const error = new Error("Divisi yang dipilih tidak ditemukan.");
    error.status = 400;
    throw error;
  }

  const slug = await uniqueSlug(data.name);

  const [result] = await pool.execute(
    `INSERT INTO programs (
       division_id,
       name,
       slug,
       description,
       period,
       pic_name,
       start_date,
       end_date,
       status,
       publication_status,
       cover_image,
       display_order
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.divisionId,
      data.name,
      slug,
      data.description,
      data.period,
      data.picName,
      data.startDate,
      data.endDate,
      data.status,
      data.publicationStatus,
      data.coverImage,
      data.displayOrder,
    ],
  );

  return getProgramById(result.insertId);
}

async function updateProgram(id, data) {
  const existingProgram = await getProgramById(id);

  if (!existingProgram) {
    return null;
  }

  const divisionExists = await validateDivision(data.divisionId);

  if (!divisionExists) {
    const error = new Error("Divisi yang dipilih tidak ditemukan.");
    error.status = 400;
    throw error;
  }

  const slug = await uniqueSlug(data.name, id);

  await pool.execute(
    `UPDATE programs SET
       division_id = ?,
       name = ?,
       slug = ?,
       description = ?,
       period = ?,
       pic_name = ?,
       start_date = ?,
       end_date = ?,
       status = ?,
       publication_status = ?,
       cover_image = ?,
       display_order = ?
     WHERE id = ?`,
    [
      data.divisionId,
      data.name,
      slug,
      data.description,
      data.period,
      data.picName,
      data.startDate,
      data.endDate,
      data.status,
      data.publicationStatus,
      data.coverImage,
      data.displayOrder,
      id,
    ],
  );

  return getProgramById(id);
}

async function deleteProgram(id) {
  const [result] = await pool.execute(
    "DELETE FROM programs WHERE id = ?",
    [id],
  );

  return result.affectedRows > 0;
}

module.exports = {
  getPrograms,
  getProgramById,
  getDivisions,
  createProgram,
  updateProgram,
  deleteProgram,
};
