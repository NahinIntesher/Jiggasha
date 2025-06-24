const express = require("express");
const router = express.Router();

const {
  getIncompleteQuests,
  getCompletedQuests,
  claimQuestReward,
  evaluateUserQuestsHandler,
} = require("../controllers/quest.controller");
const verifyToken = require("../middlewares/verifyToken");

router.get("/", verifyToken, getIncompleteQuests);
router.get("/completed", verifyToken, getCompletedQuests);
router.post("/claim", verifyToken, claimQuestReward);
router.post("/evaluate/:userId", verifyToken, evaluateUserQuestsHandler);

module.exports = router;
