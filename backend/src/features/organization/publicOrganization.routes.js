const express = require("express");
const controller = require("./organization.controller");

const router = express.Router();

router.get("/", controller.getPublicOrganization);

module.exports = router;
