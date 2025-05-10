const express = require("express");
const router = express.Router();

const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");
const blogRoutes = require("./blog.routes");

router.use("/", userRoutes);
router.use("/", authRoutes);
router.use("/blogs", blogRoutes);

module.exports = router;
