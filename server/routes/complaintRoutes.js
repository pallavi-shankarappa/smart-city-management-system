import { Router } from "express";
import {
  createComplaint,
  listComplaints,
  getComplaint,
  updateComplaintStatus,
  assignComplaint,
} from "../controllers/complaintController.js";
import { authRequired, requireRole } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = Router();

router.use(authRequired);

router
  .route("/")
  .post(upload.single("image"), requireRole(["citizen"]), createComplaint)
  .get(listComplaints);

router.route("/:id").get(getComplaint);

router.put("/:id/status", requireRole(["officer"]), updateComplaintStatus);
router.put("/:id/assign", requireRole(["officer"]), assignComplaint);

export default router;

