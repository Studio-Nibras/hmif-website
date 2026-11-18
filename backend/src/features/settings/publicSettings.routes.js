const express = require("express");
const settingsController = require("./settings.controller");

const router = express.Router();

router.get("/", settingsController.getPublicSettings);

module.exports = router;
