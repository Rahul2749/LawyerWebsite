// src/routes/contact.routes.ts

import { Router } from "express";
import * as contactController from "../controllers/contact.controller";
import { generalLimiter } from "../middleware/rateLimiter.middleware";

const router = Router();

router.post("/", generalLimiter, contactController.submitContact);

export default router;
