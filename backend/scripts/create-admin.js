require("dotenv").config();

const bcrypt = require("bcryptjs");
const pool = require("../src/config/database");

async function main() {
  const name = process.env.ADMIN_NAME?.trim();
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!name || !email || !password) {
    throw new Error("ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD are required");
  }

  if (name.length > 100 || email.length > 255) {
    throw new Error("Name or email is too long");
  }

  if (password.length < 6 || password.length > 128) {
    throw new Error("Password must contain 6–128 characters");
  }

  const [existing] = await pool.execute(
    "SELECT id FROM admins WHERE email = ? LIMIT 1",
    [email],
  );

  if (existing.length > 0) {
    throw new Error("An admin with this email already exists");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await pool.execute(
    `INSERT INTO admins (name, email, password_hash)
     VALUES (?, ?, ?)`,
    [name, email, passwordHash],
  );

  console.log(`Admin account created for ${email}`);
}

main()
  .catch((error) => {
    console.error("Could not create admin:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
