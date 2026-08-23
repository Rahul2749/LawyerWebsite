// src/routes/auth.routes.ts

import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { authLimiter } from "../middleware/rateLimiter.middleware";

const router = Router();

router.post("/login", authLimiter, authController.login);
router.get("/me", authMiddleware, authController.getMe);

export default router;
