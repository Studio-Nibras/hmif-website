const express = require("express");
const publicProgramsController = require("./publicPrograms.controller");

const router = express.Router();

router.get("/", publicProgramsController.getPrograms);
router.get("/:slug", publicProgramsController.getProgramBySlug);

module.exports = router;
