const express = require("express");
const pool = require("../config/database");

const router = express.Router();

// GET /api/news
// Daftar berita yang sudah dipublikasikan
router.get("/", async (req, res, next) => {
  try {
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);

    const limit = Math.min(
      20,
      Math.max(1, Number.parseInt(req.query.limit, 10) || 9),
    );

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

    const total = Number(countRows[0].total);

    res.json({
      success: true,
      articles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/news/:slug
// Detail berita berdasarkan slug
router.get("/:slug", async (req, res, next) => {
  try {
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
      [req.params.slug],
    );

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: "Berita tidak ditemukan",
      });
    }

    res.json({
      success: true,
      article: rows[0],
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
