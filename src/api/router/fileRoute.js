const express = require("express");
const router = new express.Router();
const auth = require("../../utils/auth");
const fileService = require("../../services/auth/fileService");

router.get("/fileUpload", fileService.fileUpload);
router.get("/getallobjects", fileService.getallObjects);
router.get("/file/:locationName", fileService.getObjectByLocation);

module.exports = router;
