import { Router } from "express";
import { authRequired, requireRole } from "../middleware/auth.js";
import { getMe, listOfficers } from "../controllers/userController.js";

const router = Router();

router.use(authRequired);

router.get("/me", getMe);
router.get("/officers", requireRole(["officer"]), listOfficers);

export default router;

