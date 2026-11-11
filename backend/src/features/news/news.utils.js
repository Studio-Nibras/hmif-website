const pool = require("../../config/database");

function createSlug(value) {
  return (
    value
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 250) || "berita"
  );
}

async function uniqueSlug(title, excludeId = null) {
  const base = createSlug(title);
  let slug = base;
  let suffix = 2;

  while (true) {
    const [rows] = await pool.execute(
      `SELECT id FROM news_articles
       WHERE slug = ? ${excludeId ? "AND id <> ?" : ""}
       LIMIT 1`,
      excludeId ? [slug, excludeId] : [slug],
    );

    if (rows.length === 0) {
      return slug;
    }

    const ending = `-${suffix++}`;
    slug = `${base.slice(0, 280 - ending.length)}${ending}`;
  }
}

module.exports = {
  createSlug,
  uniqueSlug,
};
