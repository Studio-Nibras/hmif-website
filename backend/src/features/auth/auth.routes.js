const express = require("express");
const authController = require("./auth.controller");

const router = express.Router();

router.post("/login", authController.login);
router.get("/me", authController.getCurrentAdmin);
router.post("/logout", authController.logout);

module.exports = router;
