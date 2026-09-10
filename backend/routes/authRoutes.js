const express = require("express");
const { register, login, getMe, updateMe, changePassword, getAllCustomers } = require("../controllers/authController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.put("/me", protect, updateMe);
router.put("/me/password", protect, changePassword);
router.get("/customers", protect, authorize("ADMIN"), getAllCustomers);

module.exports = router;