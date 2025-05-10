const express = require("express");
const router = express.Router();

const { getBlogs, addBlog } = require("../controllers/blog.controller");

const verifyToken = require("../middlewares/verifyToken");

router.get("/", verifyToken, getBlogs);
router.post("/add", verifyToken, addBlog);

module.exports = router;
