const pool = require("../../config/database");
const { createSlug, uniqueSlug } = require("./news.utils");

async function getCategories() {
  const [categories] = await pool.execute(
    `SELECT id, name, slug
     FROM news_categories
     ORDER BY name ASC`,
  );

  return categories;
}

async function getArticles(filters) {
  const { page, limit, offset, search, status, categoryId } = filters;

  const conditions = [];
  const params = [];

  if (search) {
    conditions.push("(a.title LIKE ? OR a.excerpt LIKE ?)");
    params.push(`%${search}%`, `%${search}%`);
  }

  if (status) {
    conditions.push("a.status = ?");
    params.push(status);
  }

  if (categoryId !== null) {
    conditions.push("a.category_id = ?");
    params.push(categoryId);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  const [countRows] = await pool.execute(
    `SELECT COUNT(*) AS total
     FROM news_articles a
     ${where}`,
    params,
  );

  const [articles] = await pool.execute(
    `SELECT
       a.id,
       a.category_id,
       a.admin_id,
       a.title,
       a.slug,
       a.excerpt,
       a.cover_image,
       a.status,
       a.published_at,
       a.created_at,
       a.updated_at,
       c.name AS category_name,
       ad.name AS author_name
     FROM news_articles a
     JOIN news_categories c ON c.id = a.category_id
     LEFT JOIN admins ad ON ad.id = a.admin_id
     ${where}
     ORDER BY a.created_at DESC, a.id DESC
     LIMIT ? OFFSET ?`,
    [...params, limit, offset],
  );

  const total = Number(countRows[0].total);

  return {
    articles,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

async function getArticleById(id) {
  const [rows] = await pool.execute(
    `SELECT
       a.*,
       c.name AS category_name,
       ad.name AS author_name
     FROM news_articles a
     JOIN news_categories c ON c.id = a.category_id
     LEFT JOIN admins ad ON ad.id = a.admin_id
     WHERE a.id = ?
     LIMIT 1`,
    [id],
  );

  return rows[0] || null;
}

async function categoryExists(categoryId) {
  const [rows] = await pool.execute(
    `SELECT id
     FROM news_categories
     WHERE id = ?
     LIMIT 1`,
    [categoryId],
  );

  return rows.length > 0;
}

async function createArticle(article, adminId) {
  if (!(await categoryExists(article.categoryId))) {
    return { error: "Kategori berita tidak ditemukan" };
  }

  const slug = await uniqueSlug(article.title);
  const publishedAt = article.status === "published" ? new Date() : null;

  const [result] = await pool.execute(
    `INSERT INTO news_articles
     (category_id, admin_id, title, slug, excerpt, content,
      cover_image, status, published_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      article.categoryId,
      adminId,
      article.title,
      slug,
      article.excerpt,
      article.content,
      article.coverImage,
      article.status,
      publishedAt,
    ],
  );

  return {
    id: result.insertId,
    slug,
  };
}

async function updateArticle(id, article) {
  if (!(await categoryExists(article.categoryId))) {
    return { error: "Kategori berita tidak ditemukan" };
  }

  const [existingRows] = await pool.execute(
    `SELECT id, slug, status, published_at
     FROM news_articles
     WHERE id = ?
     LIMIT 1`,
    [id],
  );

  if (!existingRows.length) {
    return null;
  }

  const existing = existingRows[0];

  const slug =
    createSlug(article.title) === existing.slug
      ? existing.slug
      : await uniqueSlug(article.title, id);

  let publishedAt = existing.published_at;

  if (article.status === "draft") {
    publishedAt = null;
  } else if (existing.status !== "published" || !publishedAt) {
    publishedAt = new Date();
  }

  await pool.execute(
    `UPDATE news_articles
     SET category_id = ?, title = ?, slug = ?, excerpt = ?,
         content = ?, cover_image = ?, status = ?, published_at = ?
     WHERE id = ?`,
    [
      article.categoryId,
      article.title,
      slug,
      article.excerpt,
      article.content,
      article.coverImage,
      article.status,
      publishedAt,
      id,
    ],
  );

  return { slug };
}

async function deleteArticle(id) {
  const [result] = await pool.execute(
    `DELETE FROM news_articles
     WHERE id = ?`,
    [id],
  );

  return result.affectedRows > 0;
}

module.exports = {
  getCategories,
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
};
