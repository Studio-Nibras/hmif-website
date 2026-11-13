const express = require("express");
const requireAdmin = require("../../middleware/requireAdmin");
const overviewController = require("./overview.controller");

const router = express.Router();

router.use(requireAdmin);

router.get("/stats", overviewController.getStats);
router.get("/publication-activity", overviewController.getPublicationActivity);

module.exports = router;
