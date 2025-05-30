const express = require("express");
const router = express.Router();
const multer = require("multer");

const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");
const blogRoutes = require("./blog.routes");
const communityRoutes = require("./community.routes");
const aiRoutes = require("./ai.routes");

router.use("/", userRoutes);
router.use("/", authRoutes);
router.use("/blogs", blogRoutes);
router.use("/communities", communityRoutes);
router.use("/ai", aiRoutes);

module.exports = router;
