const express = require("express");
const router = express.Router();

const {
  allModelTests,
} = require("../controllers/model-test.controller");

const verifyToken = require("../middlewares/verifyToken");

router.get("/:classLevel", verifyToken, allModelTests);

module.exports = router;
