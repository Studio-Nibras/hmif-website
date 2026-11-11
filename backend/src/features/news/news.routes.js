const express = require("express");
const requireAdmin = require("../../middleware/requireAdmin");

const newsController = require("./news.controller");
const { handleImageUpload } = require("./news.upload");

const router = express.Router();

router.use(requireAdmin);

router.get("/categories", newsController.getCategories);
router.get("/", newsController.getArticles);

router.post("/upload-image", handleImageUpload, newsController.uploadImage);

router.get("/:id", newsController.getArticleById);
router.post("/", newsController.createArticle);
router.put("/:id", newsController.updateArticle);
router.delete("/:id", newsController.deleteArticle);

module.exports = router;
