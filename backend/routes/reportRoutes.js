const express = require("express");
const { protect, authorize } = require("../middleware/authMiddleware");
const { getSummary, getRevenue, getPopularServices, getOccupancy } = require("../controllers/reportController");
const router = express.Router();

router.get("/Summary", protect, authorize("ADMIN"), getSummary);
router.get("/revenue", protect, authorize("ADMIN"), getRevenue);
router.get("/popular-services", protect, authorize("ADMIN"), getPopularServices);
router.get("/occupancy", protect, authorize("ADMIN"), getOccupancy);

module.exports = router;