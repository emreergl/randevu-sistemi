const express = require("express");
const {
    getAllServices,
    getServiceById,
    createService,
    updateService,
    deleteService
    } = require("../controllers/serviceController");
    const { protect, authorize } = require("../middleware/authMiddleware");

    const router = express.Router();

    router.get("/", getAllServices);
    router.get("/:id", getServiceById);

    router.post ("/", protect, authorize("ADMIN"), createService);
    router.put("/:id", protect, authorize("ADMIN"), updateService);
    router.delete("/:id", protect, authorize("ADMIN"), deleteService);

    module.exports = router;