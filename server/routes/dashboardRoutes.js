import { Router } from "express";
import { authRequired } from "../middleware/auth.js";
import { getStats } from "../controllers/dashboardController.js";

const router = Router();

router.use(authRequired);

router.get("/stats", getStats);

export default router;

