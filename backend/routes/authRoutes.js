import { Router } from "express";
import { register, login } from "../controllers/authController.js";
import { validateRegister } from "../middleware/validationMiddleware.js";

const router = Router();

router.post("/register", validateRegister, register);
router.post("/login", login);

export default router;

