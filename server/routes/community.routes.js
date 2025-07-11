const express = require("express");
const router = express.Router();

const {
  getCommunities,
  getSingleCommunities,
  getMyCommunities,
  addCommunity,
  joinCommunity,
  getAllPosts,
  createPost,
  image,
  postMedia,
  getSinglePost,
  postReaction,
  postComment,
  getAllReportedPosts,
  searchCommunities,
} = require("../controllers/community.controller");

const verifyToken = require("../middlewares/verifyToken");

router.get("/", verifyToken, getCommunities);
router.get("/my", verifyToken, getMyCommunities);
router.post("/add", verifyToken, addCommunity);
router.post("/join", verifyToken, joinCommunity);
router.get("/allPosts/:communityId", verifyToken, getAllPosts);
router.get("/allReportedPosts", verifyToken, getAllReportedPosts);
router.get("/singlePost/:postId", verifyToken, getSinglePost);
// router.get("/postReports/:postId", verifyToken, makeReport);

router.post("/post/comments", verifyToken, postComment);
router.post("/post/react", verifyToken, postReaction);
router.post("/newPost", verifyToken, createPost);
// router.post("/edit/:communityId", verifyToken, editCommunity);
// router.post("/delete/:communityId", verifyToken, deleteCommunity);
router.get("/image/:communityId", verifyToken, image);
router.get("/postMedia/:mediaId", verifyToken, postMedia);
router.get("/single/:communityId", verifyToken, getSingleCommunities);
router.get("/search/:keyword", verifyToken, searchCommunities);

module.exports = router;
