const express = require("express");
const requireAdmin = require("../../middleware/requireAdmin");

const programsController = require("./programs.controller");
const { handleImageUpload } = require("./programs.upload");

const router = express.Router();

router.use(requireAdmin);

router.get("/divisions", programsController.getDivisions);
router.get("/", programsController.getPrograms);

router.post(
  "/upload-image",
  handleImageUpload,
  programsController.uploadImage,
);

router.get("/:id", programsController.getProgramById);
router.post("/", programsController.createProgram);
router.put("/:id", programsController.updateProgram);
router.delete("/:id", programsController.deleteProgram);

module.exports = router;
