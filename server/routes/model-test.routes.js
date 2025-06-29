const express = require("express");
const router = express.Router();

const {
  allModelTests,
  singleModelTest,
  submitToModelTestAttempt,
} = require("../controllers/model-test.controller");

const verifyToken = require("../middlewares/verifyToken");

router.get("/:classLevel", verifyToken, allModelTests);
router.get("/single/:modelTestId", verifyToken, singleModelTest);
router.post("/model-test-attempt", verifyToken, submitToModelTestAttempt);

module.exports = router;
