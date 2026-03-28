import { Router } from "express";
import {
  createComplaint,
  listComplaints,
  getComplaint,
  updateComplaintStatus,
} from "../controllers/complaintController.js";
import { authRequired, requireRole } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { validateComplaint, validateStatusUpdate } from "../middleware/validationMiddleware.js";

const router = Router();

router.use(authRequired);

router
  .route("/")
  .post(upload.single("image"), requireRole(["citizen"]), validateComplaint, createComplaint)
  .get(listComplaints);

router.route("/:id").get(getComplaint);

router.put("/:id/status", requireRole(["officer"]), upload.single("evidenceImage"), validateStatusUpdate, updateComplaintStatus);

export default router;

