// src/routes/payment.routes.ts

import { Router } from "express";
import * as paymentController from "../controllers/payment.controller";
import { validate } from "../middleware/validate.middleware";
import { createRazorpayOrderSchema, verifyRazorpaySchema, initiatePhonePeSchema } from "../validators/appointment.validator";

const router = Router();

// Razorpay
router.post("/razorpay/create-order", validate(createRazorpayOrderSchema), paymentController.createRazorpayOrder);
router.post("/razorpay/verify", validate(verifyRazorpaySchema), paymentController.verifyRazorpayPayment);

// PhonePe
router.post("/phonepe/initiate", validate(initiatePhonePeSchema), paymentController.initiatePhonePePayment);
router.post("/phonepe/callback", paymentController.phonePeCallback); // No validation — raw PhonePe format

export default router;
