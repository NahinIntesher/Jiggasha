const express = require("express");
const router = express.Router();

const {
  allModelTests,
  singleModelTest,
} = require("../controllers/model-test.controller");

const verifyToken = require("../middlewares/verifyToken");

router.get("/:classLevel", verifyToken, allModelTests);
router.get("/single/:modelTestId", verifyToken, singleModelTest);

module.exports = router;
