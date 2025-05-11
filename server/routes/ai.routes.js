const express = require("express");
const router = express.Router();

const { getResponse, getMessages } = require("../controllers/ai.controller");

const verifyToken = require("../middlewares/verifyToken");

router.post("/response", verifyToken, getResponse);
router.get("/messages", verifyToken, getMessages);

module.exports = router;
