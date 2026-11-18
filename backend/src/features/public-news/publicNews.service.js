const pool = require("../../config/database");

async function getPublishedNews({ page, limit }) {
  const offset = (page - 1) * limit;

  const [countRows] = await pool.execute(
    `SELECT COUNT(*) AS total
     FROM news_articles
     WHERE status = 'published'
       AND published_at IS NOT NULL`,
  );

  const [articles] = await pool.execute(
    `SELECT
       a.id,
       a.title,
       a.slug,
       a.excerpt,
       a.cover_image,
       a.published_at,
       c.name AS category_name,
       ad.name AS author_name
     FROM news_articles a
     JOIN news_categories c ON c.id = a.category_id
     LEFT JOIN admins ad ON ad.id = a.admin_id
     WHERE a.status = 'published'
       AND a.published_at IS NOT NULL
     ORDER BY a.published_at DESC, a.id DESC
     LIMIT ? OFFSET ?`,
    [limit, offset],
  );

  return {
    articles,
    total: Number(countRows[0].total),
  };
}

async function getPublishedNewsBySlug(slug) {
  const [rows] = await pool.execute(
    `SELECT
       a.id,
       a.title,
       a.slug,
       a.excerpt,
       a.content,
       a.cover_image,
       a.published_at,
       c.name AS category_name,
       ad.name AS author_name
     FROM news_articles a
     JOIN news_categories c ON c.id = a.category_id
     LEFT JOIN admins ad ON ad.id = a.admin_id
     WHERE a.slug = ?
       AND a.status = 'published'
       AND a.published_at IS NOT NULL
     LIMIT 1`,
    [slug],
  );

  const article = rows[0] || null;

  if (!article) {
    return null;
  }

  const [programs] = await pool.execute(
    `SELECT
       p.id,
       p.name,
       p.slug,
       p.period,
       p.status,
       p.cover_image
     FROM program_news pn
     JOIN programs p ON p.id = pn.program_id
     WHERE pn.article_id = ?
       AND p.publication_status = 'published'
     ORDER BY p.display_order ASC, p.name ASC`,
    [article.id],
  );

  article.programs = programs;

  return article;
}

module.exports = {
  getPublishedNews,
  getPublishedNewsBySlug,
};
