// src/routes/service.routes.ts

import { Router } from "express";
import * as serviceController from "../controllers/service.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// Public
router.get("/", serviceController.getServices);
router.get("/:slug", serviceController.getServiceBySlug);

// Admin
router.post("/", authMiddleware, serviceController.createService);
router.put("/:id", authMiddleware, serviceController.updateService);

export default router;
