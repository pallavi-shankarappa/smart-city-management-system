const express = require("express");
const router = express.Router();

const { protect, authorize } = require("../middleware/authMiddleware");
const { listOfficers } = require("../controllers/userController");

// GET /api/users/officers (Officer-only)
router.get("/officers", protect, authorize("officer"), listOfficers);

module.exports = router;

