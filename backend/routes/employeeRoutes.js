const express = require("express");
const {
    getAllEmployees,
    getEmployeeById,
    createEmployee,
    deleteEmployee,
    setWorkingHours,
    getAvailability
} = require("../controllers/employeeController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getAllEmployees);
router.get("/:id", getEmployeeById);
router.post("/", protect, authorize("ADMIN"), createEmployee);
router.delete("/:id", protect, authorize("ADMIN"), deleteEmployee);
router.put("/:id/working-hours", protect, authorize("ADMIN"), setWorkingHours);
router.get("/:id/availability", getAvailability);

module.exports = router;