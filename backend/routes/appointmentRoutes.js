const express = require("express");
const {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  cancelAppointment
} = require("../controllers/appointmentController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createAppointment);
router.get("/", protect, getAppointments);
router.get("/:id", protect, getAppointmentById);
router.patch("/:id/status", protect, authorize("ADMIN"), updateAppointmentStatus);
router.delete("/:id", protect, cancelAppointment);

module.exports = router;