const bcrypt = require("bcryptjs");
const pool = require("../../config/database");

async function findAdminByEmail(email) {
  const [admins] = await pool.execute(
    `SELECT id, name, email, password_hash
     FROM admins
     WHERE email = ?
     LIMIT 1`,
    [email.trim().toLowerCase()],
  );

  return admins[0] || null;
}

async function authenticateAdmin(email, password) {
  const admin = await findAdminByEmail(email);

  if (!admin) {
    return null;
  }

  const isPasswordValid = await bcrypt.compare(password, admin.password_hash);

  if (!isPasswordValid) {
    return null;
  }

  return {
    id: admin.id,
    name: admin.name,
    email: admin.email,
  };
}

module.exports = {
  authenticateAdmin,
};
