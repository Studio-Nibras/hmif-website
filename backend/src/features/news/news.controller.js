const newsService = require("./news.service");

const {
  validateArticle,
  validateId,
  validateNewsFilters,
} = require("./news.validation");

const { uploadImageToCloudinary } = require("./news.upload");

async function getCategories(req, res, next) {
  try {
    const categories = await newsService.getCategories();

    return res.json({
      success: true,
      categories,
    });
  } catch (error) {
    next(error);
  }
}

async function getArticles(req, res, next) {
  try {
    const validation = validateNewsFilters(req.query);

    if (validation.error) {
      return res.status(400).json({
        success: false,
        message: validation.error,
      });
    }

    const result = await newsService.getArticles(validation.data);

    return res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
}

async function getArticleById(req, res, next) {
  try {
    const id = validateId(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID berita tidak valid",
      });
    }

    const article = await newsService.getArticleById(id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Berita tidak ditemukan",
      });
    }

    return res.json({
      success: true,
      article,
    });
  } catch (error) {
    next(error);
  }
}

async function createArticle(req, res, next) {
  try {
    const validation = validateArticle(req.body || {});

    if (validation.error) {
      return res.status(400).json({
        success: false,
        message: validation.error,
      });
    }

    const result = await newsService.createArticle(
      validation.data,
      req.session.admin.id,
    );

    if (result.error) {
      return res.status(400).json({
        success: false,
        message: result.error,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Berita berhasil ditambahkan",
      id: result.id,
      slug: result.slug,
    });
  } catch (error) {
    next(error);
  }
}

async function updateArticle(req, res, next) {
  try {
    const id = validateId(req.params.id);

    if (!id) {
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

    const result = await newsService.updateArticle(id, validation.data);

    if (result === null) {
      return res.status(404).json({
        success: false,
        message: "Berita tidak ditemukan",
      });
    }

    if (result.error) {
      return res.status(400).json({
        success: false,
        message: result.error,
      });
    }

    return res.json({
      success: true,
      message: "Berita berhasil diperbarui",
      slug: result.slug,
    });
  } catch (error) {
    next(error);
  }
}

async function deleteArticle(req, res, next) {
  try {
    const id = validateId(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID berita tidak valid",
      });
    }

    const deleted = await newsService.deleteArticle(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Berita tidak ditemukan",
      });
    }

    return res.json({
      success: true,
      message: "Berita berhasil dihapus",
    });
  } catch (error) {
    next(error);
  }
}

async function uploadImage(req, res, next) {
  try {
    const result = await uploadImageToCloudinary(req.file.buffer);

    return res.status(200).json({
      message: "Gambar berhasil diunggah.",
      url: result.secure_url,
    });
  } catch (error) {
    if (error.status === 503) {
      return res.status(503).json({
        message: error.message,
      });
    }

    next(error);
  }
}

module.exports = {
  getCategories,
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  uploadImage,
};
