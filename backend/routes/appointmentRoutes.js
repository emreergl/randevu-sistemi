const express = require("express");
const { createAppointment } = require("../controllers/appointmentController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createAppointment);

module.exports = router;