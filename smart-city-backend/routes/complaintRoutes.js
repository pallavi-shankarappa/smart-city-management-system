/**
 * @swagger
 * tags:
 *   name: Complaints
 *   description: Complaint Management APIs
 */

const express = require("express");
const router = express.Router();

const { protect, authorize } = require("../middleware/authMiddleware");

const {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaintStatus,
  getDashboardStats,
  assignComplaint
} = require("../controllers/complaintController");

const {
  validateComplaint,
  validateStatusUpdate,
  validateAssign
} = require("../middleware/validationMiddleware");

const upload = require("../middleware/upload");

router.post(
  "/",
  protect,
  authorize("citizen"),
  upload.single("image"),
  validateComplaint,
  createComplaint
);


// ===============================
// Get Dashboard Statistics
// IMPORTANT: keep this BEFORE "/"
// ===============================
router.get(
  "/stats",
  protect,
  authorize("officer"),
  getDashboardStats
);


// ===============================
// Get All Complaints
// ===============================
router.get(
  "/",
  protect,
  getComplaints
);

// ===============================
// Get Complaint Details
// ===============================
router.get(
  "/:id",
  protect,
  getComplaintById
);


// ===============================
// Assign Complaint to Officer
// ===============================
router.put(
  "/:id/assign",
  protect,
  authorize("officer"),
  validateAssign,
  assignComplaint
);


// ===============================
// Update Complaint Status
// ===============================
router.put(
  "/:id/status",
  protect,
  authorize("officer"),
  validateStatusUpdate,
  updateComplaintStatus
);


module.exports = router;