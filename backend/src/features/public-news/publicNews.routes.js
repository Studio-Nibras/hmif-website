const express = require("express");
const publicNewsController = require("./publicNews.controller");

const router = express.Router();

router.get("/", publicNewsController.getNews);
router.get("/:slug", publicNewsController.getNewsBySlug);

module.exports = router;
