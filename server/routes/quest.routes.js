const express = require("express");
const router = express.Router();

const {
  getIncompleteQuests,
  getCompletedQuests,
  claimQuestReward,
  evaluateUserQuests,
} = require("../controllers/quest.controller");
const verifyToken = require("../middlewares/verifyToken");

router.get("/", verifyToken, getIncompleteQuests);
router.get("/completed", verifyToken, getCompletedQuests);
router.post("/claim", verifyToken, claimQuestReward);
router.post("/evaluate", verifyToken, evaluateUserQuests);
module.exports = router;
