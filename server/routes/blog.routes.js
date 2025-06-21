const express = require("express");
const router = express.Router();

const {
  getBlogs,
  addBlog,
  image,
  vote,
  unvote,
  getSingleBlog,
  getMyBlogs,
  searchBlogs,
} = require("../controllers/blog.controller");

const verifyToken = require("../middlewares/verifyToken");

router.get("/", verifyToken, getBlogs);
router.get("/my", verifyToken, getMyBlogs);
router.post("/add", verifyToken, addBlog);
// router.post("/edit/:blogId", verifyToken, editBlog);
// router.post("/delete/:blogId", verifyToken, deleteBlog);
router.post("/vote", verifyToken, vote);
router.post("/unvote", verifyToken, unvote);
router.get("/image/:blogId", verifyToken, image);
router.get("/single/:blogId", verifyToken, getSingleBlog);
router.get("/search/:keyword", verifyToken, searchBlogs);

module.exports = router;
