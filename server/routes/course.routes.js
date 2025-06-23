const express = require("express");
const router = express.Router();

const {
  getCourses,
  image,
  getSingleCourse,
  searchCourses,
  getEnrolledCourses,
  addMaterial,
  getCourseMaterial,
} = require("../controllers/course.controller");

const verifyToken = require("../middlewares/verifyToken");

router.get("/", verifyToken, getCourses);
router.get("/enrolled", verifyToken, getEnrolledCourses);
router.get("/image/:courseId", verifyToken, image);
router.get("/single/:courseId", verifyToken, getSingleCourse);
router.get("/search/:keyword", verifyToken, searchCourses);
router.post("/material/add", verifyToken, addMaterial);
router.get("/courseMaterial/:materialId", getCourseMaterial);
module.exports = router;
