const express = require("express");
const requireAdmin = require("../../middleware/requireAdmin");
const controller = require("./organization.controller");
const { handleImageUpload } = require("./organization.upload");

const router = express.Router();

router.use(requireAdmin);

router.get("/divisions", controller.getDivisions);
router.post("/divisions", controller.createDivision);
router.put("/divisions/:id", controller.updateDivision);
router.delete("/divisions/:id", controller.deleteDivision);

router.post("/upload-photo", handleImageUpload, controller.uploadPhoto);

router.get("/members", controller.getMembers);
router.post("/members", controller.createMember);
router.get("/members/:id", controller.getMemberById);
router.put("/members/:id", controller.updateMember);
router.delete("/members/:id", controller.deleteMember);

module.exports = router;
