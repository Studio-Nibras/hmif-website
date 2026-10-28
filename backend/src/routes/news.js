const express = require("express");
const pool = require("../config/database");
const requireAdmin = require("../middleware/requireAdmin");

const router = express.Router();

const multer = require("multer");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];

const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, callback) => {
    if (!allowedImageTypes.includes(file.mimetype)) {
      return callback(new Error("Format gambar harus JPG, PNG, atau WEBP."));
    }

    callback(null, true);
  },
});

router.use(requireAdmin);

router.post(
  "/upload-image",
  (req, res, next) => {
    imageUpload.single("image")(req, res, (error) => {
      if (error) {
        const status =
          error instanceof multer.MulterError &&
          error.code === "LIMIT_FILE_SIZE"
            ? 413
            : 400;

        return res.status(status).json({
          message:
            error.code === "LIMIT_FILE_SIZE"
              ? "Ukuran gambar maksimal 5 MB."
              : error.message || "Gagal memproses gambar.",
        });
      }

      if (!req.file) {
        return res.status(400).json({
          message: "Pilih gambar terlebih dahulu.",
        });
      }

      next();
    });
  },
  async (req, res, next) => {
    const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
      process.env;

    if (
      !CLOUDINARY_CLOUD_NAME ||
      !CLOUDINARY_API_KEY ||
      !CLOUDINARY_API_SECRET
    ) {
      return res.status(503).json({
        message: "Konfigurasi Cloudinary belum lengkap di backend.",
      });
    }

    try {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "hmif/news",
            resource_type: "image",
          },
          (error, uploadedImage) => {
            if (error) return reject(error);
            resolve(uploadedImage);
          },
        );

        stream.end(req.file.buffer);
      });

      return res.status(200).json({
        message: "Gambar berhasil diunggah.",
        url: result.secure_url,
      });
    } catch (error) {
      next(error);
    }
  },
);

const allowedStatuses = ["draft", "published"];

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

    if (rows.length === 0) return slug;

    const ending = `-${suffix++}`;
    slug = `${base.slice(0, 280 - ending.length)}${ending}`;
  }
}

function validateArticle(body) {
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const content = typeof body.content === "string" ? body.content.trim() : "";
  const categoryId = Number(body.category_id);
  const status = body.status || "draft";
  const excerpt = typeof body.excerpt === "string" ? body.excerpt.trim() : null;
  const coverImage =
    typeof body.cover_image === "string" ? body.cover_image.trim() : "";

  if (!title || title.length > 255) {
    return { error: "Judul wajib diisi dan maksimal 255 karakter" };
  }

  if (!content) {
    return { error: "Isi berita wajib diisi" };
  }

  if (!Number.isSafeInteger(categoryId) || categoryId < 1) {
    return { error: "Kategori berita tidak valid" };
  }

  if (!allowedStatuses.includes(status)) {
    return { error: "Status berita tidak valid" };
  }

  if (coverImage.length > 500) {
    return { error: "URL gambar maksimal 500 karakter" };
  }

  return {
    data: {
      title,
      content,
      categoryId,
      status,
      excerpt: excerpt || null,
      coverImage: coverImage || null,
    },
  };
}

async function categoryExists(categoryId) {
  const [rows] = await pool.execute(
    "SELECT id FROM news_categories WHERE id = ? LIMIT 1",
    [categoryId],
  );

  return rows.length > 0;
}

// GET /api/admin/news/categories
router.get("/categories", async (req, res, next) => {
  try {
    const [categories] = await pool.execute(
      "SELECT id, name, slug FROM news_categories ORDER BY name ASC",
    );

    res.json({ success: true, categories });
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/news?page=1&limit=10&search=&status=&category_id=
router.get("/", async (req, res, next) => {
  try {
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(
      100,
      Math.max(1, Number.parseInt(req.query.limit, 10) || 10),
    );
    const offset = (page - 1) * limit;
    const search =
      typeof req.query.search === "string" ? req.query.search.trim() : "";
    const status = typeof req.query.status === "string" ? req.query.status : "";
    const categoryId = req.query.category_id
      ? Number(req.query.category_id)
      : null;

    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Filter status tidak valid",
      });
    }

    if (
      categoryId !== null &&
      (!Number.isSafeInteger(categoryId) || categoryId < 1)
    ) {
      return res.status(400).json({
        success: false,
        message: "Filter kategori tidak valid",
      });
    }

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

// GET /api/admin/news/:id
router.get("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id < 1) {
      return res.status(400).json({
        success: false,
        message: "ID berita tidak valid",
      });
    }

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

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: "Berita tidak ditemukan",
      });
    }

    res.json({ success: true, article: rows[0] });
  } catch (error) {
    next(error);
  }
});

// POST /api/admin/news
router.post("/", async (req, res, next) => {
  try {
    const validation = validateArticle(req.body || {});

    if (validation.error) {
      return res.status(400).json({
        success: false,
        message: validation.error,
      });
    }

    const article = validation.data;

    if (!(await categoryExists(article.categoryId))) {
      return res.status(400).json({
        success: false,
        message: "Kategori berita tidak ditemukan",
      });
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
        req.session.admin.id,
        article.title,
        slug,
        article.excerpt,
        article.content,
        article.coverImage,
        article.status,
        publishedAt,
      ],
    );

    res.status(201).json({
      success: true,
      message: "Berita berhasil ditambahkan",
      id: result.insertId,
      slug,
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/admin/news/:id
router.put("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id < 1) {
      return res.status(400).json({
        success: false,
        message: "ID berita tidak valid",
      });
    }

    const validation = validateArticle(req.body || {});

    if (validation.error) {
      return res.status(400).json({
        success: false,
        message: validation.error,
      });
    }

    const article = validation.data;

    if (!(await categoryExists(article.categoryId))) {
      return res.status(400).json({
        success: false,
        message: "Kategori berita tidak ditemukan",
      });
    }

    const [existingRows] = await pool.execute(
      "SELECT id, slug, status, published_at FROM news_articles WHERE id = ? LIMIT 1",
      [id],
    );

    if (!existingRows.length) {
      return res.status(404).json({
        success: false,
        message: "Berita tidak ditemukan",
      });
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

    res.json({
      success: true,
      message: "Berita berhasil diperbarui",
      slug,
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/admin/news/:id
router.delete("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id < 1) {
      return res.status(400).json({
        success: false,
        message: "ID berita tidak valid",
      });
    }

    const [result] = await pool.execute(
      "DELETE FROM news_articles WHERE id = ?",
      [id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Berita tidak ditemukan",
      });
    }

    res.json({
      success: true,
      message: "Berita berhasil dihapus",
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
