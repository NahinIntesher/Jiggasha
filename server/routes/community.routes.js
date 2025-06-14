const express = require("express");
const router = express.Router();

const {
  getCommunities,
  getSingleCommunities,
  getMyCommunities,
  addCommunity,
  getAllPosts,
  joinCommunity,
  image,
} = require("../controllers/community.controller");

const verifyToken = require("../middlewares/verifyToken");

router.get("/", verifyToken, getCommunities);
router.get("/my", verifyToken, getMyCommunities);
router.post("/add", verifyToken, addCommunity);
router.post("/join", verifyToken, joinCommunity);
router.get("/allPosts/:communityId", verifyToken, getAllPosts);
// router.post("/edit/:communityId", verifyToken, editCommunity);
// router.post("/delete/:communityId", verifyToken, deleteCommunity);
router.get("/image/:communityId", verifyToken, image);
router.get("/single/:communityId", verifyToken, getSingleCommunities);

module.exports = router;
