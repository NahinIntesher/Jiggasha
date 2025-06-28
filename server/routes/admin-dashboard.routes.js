const express = require("express");
const router = express.Router();

const {
  getAllInformationsAdmin,
} = require("../controllers/admin-dashboard.controller");

const verifyToken = require("../middlewares/verifyToken");

router.get("/allInformations", verifyToken, getAllInformationsAdmin);

module.exports = router;
