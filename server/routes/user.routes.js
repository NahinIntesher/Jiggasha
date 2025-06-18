const express = require("express");
const router = express.Router();
const { getUserProfile, leaderboard } = require("../controllers/user.controller");
const verifyToken = require("../middlewares/verifyToken");

router.get("/", verifyToken, getUserProfile);
router.get("/leaderboard", verifyToken, leaderboard);

module.exports = router;
