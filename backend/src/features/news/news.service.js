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

  const article = rows[0] || null;

  if (!article) {
    return null;
  }

  const [programRows] = await pool.execute(
    `SELECT p.id, p.name, p.slug
     FROM program_news pn
     JOIN programs p ON p.id = pn.program_id
     WHERE pn.article_id = ?
     ORDER BY p.display_order ASC, p.name ASC`,
    [id],
  );

  article.program_ids = programRows.map((program) => Number(program.id));
  article.programs = programRows;

  return article;
}

async function categoryExists(categoryId, connection = pool) {
  const [rows] = await connection.execute(
    `SELECT id
     FROM news_categories
     WHERE id = ?
     LIMIT 1`,
    [categoryId],
  );

  return rows.length > 0;
}

async function validatePrograms(programIds, connection) {
  if (programIds.length === 0) {
    return true;
  }

  const placeholders = programIds.map(() => "?").join(", ");

  const [rows] = await connection.execute(
    `SELECT id
     FROM programs
     WHERE id IN (${placeholders})`,
    programIds,
  );

  return rows.length === programIds.length;
}

async function syncArticlePrograms(connection, articleId, programIds) {
  const validPrograms = await validatePrograms(programIds, connection);

  if (!validPrograms) {
    const error = new Error("Salah satu program kerja tidak ditemukan.");
    error.status = 400;
    throw error;
  }

  await connection.execute(
    `DELETE FROM program_news
     WHERE article_id = ?`,
    [articleId],
  );

  if (programIds.length === 0) {
    return;
  }

  const values = programIds.map(() => "(?, ?)").join(", ");
  const params = programIds.flatMap((programId) => [programId, articleId]);

  await connection.execute(
    `INSERT INTO program_news (program_id, article_id)
     VALUES ${values}`,
    params,
  );
}

async function createArticle(article, adminId) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    if (!(await categoryExists(article.categoryId, connection))) {
      const error = new Error("Kategori berita tidak ditemukan.");
      error.status = 400;
      throw error;
    }

    const slug = await uniqueSlug(article.title);
    const publishedAt = article.status === "published" ? new Date() : null;

    const [result] = await connection.execute(
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

    await syncArticlePrograms(
      connection,
      result.insertId,
      article.programIds || [],
    );

    await connection.commit();

    return {
      id: result.insertId,
      slug,
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function updateArticle(id, article) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    if (!(await categoryExists(article.categoryId, connection))) {
      const error = new Error("Kategori berita tidak ditemukan.");
      error.status = 400;
      throw error;
    }

    const [existingRows] = await connection.execute(
      `SELECT id, slug, status, published_at
       FROM news_articles
       WHERE id = ?
       LIMIT 1
       FOR UPDATE`,
      [id],
    );

    if (!existingRows.length) {
      await connection.rollback();
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

    await connection.execute(
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

    await syncArticlePrograms(connection, id, article.programIds || []);

    await connection.commit();

    return { slug };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
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
