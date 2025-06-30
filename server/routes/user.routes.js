const express = require("express");
const router = express.Router();
const {
  getUserProfile,
  getAllTimeLeaderboard,
  getWeeklyLeaderboard,
  getMonthlyLeaderboard,
  updateProfilePicture,
  changeProfileDetails,
  getAllUsers,
  deleteUser,
  image,
  allCertifications,
} = require("../controllers/user.controller");
const verifyToken = require("../middlewares/verifyToken");

router.get("/", verifyToken, getUserProfile);
router.get("/leaderboard/all-time", getAllTimeLeaderboard);
router.get("/leaderboard/weekly", getWeeklyLeaderboard);
router.get("/leaderboard/monthly", getMonthlyLeaderboard);
router.post("/profile/update/picture", verifyToken, updateProfilePicture);
router.post("/update-profile-details", verifyToken, changeProfileDetails);
router.get("/profile/image/:userId", verifyToken, image);
router.get("/certifications", verifyToken, allCertifications);
router.get("/allUsers", verifyToken, getAllUsers);
router.delete("/profile/delete/:id", verifyToken, deleteUser);

module.exports = router;
