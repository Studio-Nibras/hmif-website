const pool = require("../../config/database");

async function getPublishedPrograms({ page, limit }) {
  const offset = (page - 1) * limit;

  const [countRows] = await pool.execute(
    `SELECT COUNT(*) AS total
     FROM programs
     WHERE publication_status = 'published'`,
  );

  const [programs] = await pool.execute(
    `SELECT
       p.id,
       p.name,
       p.slug,
       p.description,
       p.period,
       p.pic_name,
       p.start_date,
       p.end_date,
       p.status,
       p.cover_image,
       d.name AS division_name
     FROM programs p
     LEFT JOIN organization_divisions d ON d.id = p.division_id
     WHERE p.publication_status = 'published'
     ORDER BY p.display_order ASC, p.created_at DESC
     LIMIT ? OFFSET ?`,
    [limit, offset],
  );

  const total = Number(countRows[0].total);

  return {
    programs,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

async function getPublishedProgramBySlug(slug) {
  const [rows] = await pool.execute(
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
       p.cover_image,
       p.display_order,
       p.created_at
     FROM programs p
     LEFT JOIN organization_divisions d ON d.id = p.division_id
     WHERE p.slug = ?
       AND p.publication_status = 'published'
     LIMIT 1`,
    [slug],
  );

  const program = rows[0] || null;

  if (!program) {
    return null;
  }

  const [news] = await pool.execute(
    `SELECT
       a.id,
       a.title,
       a.slug,
       a.excerpt,
       a.cover_image,
       a.published_at,
       c.name AS category_name
     FROM program_news pn
     JOIN news_articles a ON a.id = pn.article_id
     JOIN news_categories c ON c.id = a.category_id
     WHERE pn.program_id = ?
       AND a.status = 'published'
       AND a.published_at IS NOT NULL
     ORDER BY a.published_at DESC, a.id DESC`,
    [program.id],
  );

  program.related_news = news;

  return program;
}

module.exports = {
  getPublishedPrograms,
  getPublishedProgramBySlug,
};
