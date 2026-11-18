const pool = require("../../config/database");

function handleDatabaseError(error) {
  if (error.code === "ER_DUP_ENTRY") {
    const conflict = new Error("Nama divisi tersebut sudah digunakan.");
    conflict.status = 409;
    throw conflict;
  }

  throw error;
}

async function getDivisions() {
  const [rows] = await pool.execute(
    `SELECT
       d.id,
       d.name,
       d.description,
       d.display_order,
       d.created_at,
       d.updated_at,
       COUNT(m.id) AS member_count
     FROM organization_divisions d
     LEFT JOIN organization_members m ON m.division_id = d.id
     GROUP BY d.id
     ORDER BY d.display_order ASC, d.name ASC`,
  );

  return rows;
}

async function createDivision(data) {
  try {
    const [result] = await pool.execute(
      `INSERT INTO organization_divisions
       (name, description, display_order)
       VALUES (?, ?, ?)`,
      [data.name, data.description, data.display_order],
    );

    return getDivisionById(result.insertId);
  } catch (error) {
    handleDatabaseError(error);
  }
}

async function getDivisionById(id) {
  const [rows] = await pool.execute(
    `SELECT id, name, description, display_order, created_at, updated_at
     FROM organization_divisions
     WHERE id = ?
     LIMIT 1`,
    [id],
  );

  return rows[0] || null;
}

async function updateDivision(id, data) {
  try {
    const [result] = await pool.execute(
      `UPDATE organization_divisions
       SET name = ?, description = ?, display_order = ?
       WHERE id = ?`,
      [data.name, data.description, data.display_order, id],
    );

    if (!result.affectedRows) {
      return null;
    }

    return getDivisionById(id);
  } catch (error) {
    handleDatabaseError(error);
  }
}

async function deleteDivision(id) {
  const [result] = await pool.execute(
    "DELETE FROM organization_divisions WHERE id = ?",
    [id],
  );

  return result.affectedRows > 0;
}

async function getMembers(filters = {}) {
  const conditions = [];
  const values = [];

  if (filters.division_id) {
    conditions.push("m.division_id = ?");
    values.push(filters.division_id);
  }

  if (filters.is_active !== undefined) {
    conditions.push("m.is_active = ?");
    values.push(filters.is_active);
  }

  if (filters.search) {
    conditions.push("(m.name LIKE ? OR m.position LIKE ?)");
    values.push(`%${filters.search}%`, `%${filters.search}%`);
  }

  const whereClause = conditions.length
    ? `WHERE ${conditions.join(" AND ")}`
    : "";

  const [rows] = await pool.execute(
    `SELECT
       m.id,
       m.division_id,
       d.name AS division_name,
       m.name,
       m.position,
       m.photo_url,
       m.bio,
       m.term_start,
       m.term_end,
       m.display_order,
       m.is_active,
       m.created_at,
       m.updated_at
     FROM organization_members m
     LEFT JOIN organization_divisions d ON d.id = m.division_id
     ${whereClause}
     ORDER BY m.display_order ASC, m.name ASC`,
    values,
  );

  return rows;
}

async function getMemberById(id) {
  const [rows] = await pool.execute(
    `SELECT
       m.id,
       m.division_id,
       d.name AS division_name,
       m.name,
       m.position,
       m.photo_url,
       m.bio,
       m.term_start,
       m.term_end,
       m.display_order,
       m.is_active,
       m.created_at,
       m.updated_at
     FROM organization_members m
     LEFT JOIN organization_divisions d ON d.id = m.division_id
     WHERE m.id = ?
     LIMIT 1`,
    [id],
  );

  return rows[0] || null;
}

async function createMember(data) {
  const [result] = await pool.execute(
    `INSERT INTO organization_members
     (
       division_id,
       name,
       position,
       photo_url,
       bio,
       term_start,
       term_end,
       display_order,
       is_active
     )
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.division_id,
      data.name,
      data.position,
      data.photo_url,
      data.bio,
      data.term_start,
      data.term_end,
      data.display_order,
      data.is_active,
    ],
  );

  return getMemberById(result.insertId);
}

async function updateMember(id, data) {
  const [result] = await pool.execute(
    `UPDATE organization_members
     SET
       division_id = ?,
       name = ?,
       position = ?,
       photo_url = ?,
       bio = ?,
       term_start = ?,
       term_end = ?,
       display_order = ?,
       is_active = ?
     WHERE id = ?`,
    [
      data.division_id,
      data.name,
      data.position,
      data.photo_url,
      data.bio,
      data.term_start,
      data.term_end,
      data.display_order,
      data.is_active,
      id,
    ],
  );

  if (!result.affectedRows) {
    return null;
  }

  return getMemberById(id);
}

async function deleteMember(id) {
  const [result] = await pool.execute(
    "DELETE FROM organization_members WHERE id = ?",
    [id],
  );

  return result.affectedRows > 0;
}

async function getPublicOrganization() {
  const [divisions] = await pool.execute(
    `SELECT id, name, description, display_order
     FROM organization_divisions
     ORDER BY display_order ASC, name ASC`,
  );

  const [members] = await pool.execute(
    `SELECT
       m.id,
       m.division_id,
       d.name AS division_name,
       m.name,
       m.position,
       m.photo_url,
       m.bio,
       m.term_start,
       m.term_end,
       m.display_order
     FROM organization_members m
     LEFT JOIN organization_divisions d ON d.id = m.division_id
     WHERE m.is_active = TRUE
     ORDER BY m.display_order ASC, m.name ASC`,
  );

  return {
    divisions,
    members,
  };
}

module.exports = {
  getDivisions,
  createDivision,
  getDivisionById,
  updateDivision,
  deleteDivision,
  getMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
  getPublicOrganization,
};
