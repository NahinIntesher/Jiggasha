const express = require("express");
const router = express.Router();
const {
  getUserProfile,
  getAllTimeLeaderboard,
  getWeeklyLeaderboard,
  getMonthlyLeaderboard,
  updateProfilePicture,
  changeProfileDetails,
} = require("../controllers/user.controller");
const verifyToken = require("../middlewares/verifyToken");

router.get("/", verifyToken, getUserProfile);
router.get("/leaderboard/all-time", getAllTimeLeaderboard);
router.get("/leaderboard/weekly", getWeeklyLeaderboard);
router.get("/leaderboard/monthly", getMonthlyLeaderboard);
router.post("/profile/update/picture", verifyToken, updateProfilePicture);
router.post("/update-profile-details", verifyToken, changeProfileDetails);

module.exports = router;
