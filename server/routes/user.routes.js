const express = require("express");
const router = express.Router();
const { getUserProfile } = require("../controllers/user.controller");
const verifyToken = require("../middlewares/verifyToken");

router.get("/", verifyToken, getUserProfile);

module.exports = router;
