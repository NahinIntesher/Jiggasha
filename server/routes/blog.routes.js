const express = require("express");
const router = express.Router();

const { getBlogs, addBlog, image } = require("../controllers/blog.controller");

const verifyToken = require("../middlewares/verifyToken");

router.get("/", verifyToken, getBlogs);
router.post("/add", verifyToken, addBlog);
router.get("/image/:blogId", verifyToken, image);

module.exports = router;
