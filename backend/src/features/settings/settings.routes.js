const express = require("express");
const settingsController = require("./settings.controller");
const requireAdmin = require("../../middleware/requireAdmin");

const router = express.Router();

router.use(requireAdmin);

router.get("/", settingsController.getAdminSettings);
router.patch("/", settingsController.updateSettings);

module.exports = router;
