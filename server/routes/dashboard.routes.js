const express = require("express");
const router = express.Router();


const { getRecentCourses, getRecentBattles} = require("../controllers/dashboard.controller");

const verifyToken = require("../middlewares/verifyToken");

router.get("/", verifyToken, getRecentCourses);
router.get("/battles", verifyToken, getRecentBattles);
// router.get("/image/:courseId", verifyToken, image);
// router.get("/single/:courseId", verifyToken, getSingleCourse);
// router.get("/search/:keyword", verifyToken, searchCourses);

module.exports = router;
