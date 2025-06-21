const express = require("express");
const router = express.Router();


const { getCourses, image, getSingleCourse, searchCourses } = require("../controllers/course.controller");

const verifyToken = require("../middlewares/verifyToken");

router.get("/", verifyToken, getCourses);
router.get("/image/:courseId", verifyToken, image);
router.get("/single/:courseId", verifyToken, getSingleCourse);
router.get("/search/:keyword", verifyToken, searchCourses);

module.exports = router;
