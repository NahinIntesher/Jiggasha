const express = require("express");
const router = express.Router();
const multer = require("multer");

const authRoutes = require("./auth.routes");
const dashboardRoutes = require("./dashboard.routes");
const userRoutes = require("./user.routes");
const blogRoutes = require("./blog.routes");
const communityRoutes = require("./community.routes");
const aiRoutes = require("./ai.routes");
const courseRoutes = require("./course.routes");

router.use("/", userRoutes);
router.use("/", authRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/blogs", blogRoutes);
router.use("/courses", courseRoutes);
router.use("/communities", communityRoutes);
router.use("/ai", aiRoutes);

module.exports = router;
