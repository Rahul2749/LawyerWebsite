import { Router } from "express";
import { z } from "zod";
import { authMiddleware } from "../middleware/auth.middleware";
import { asyncHandler } from "../utils/asyncHandler";
import { sendError, sendSuccess } from "../utils/apiResponse";
import { getAdminPushConfiguration } from "../config/firebase";
import { prisma } from "../config/database";

const router = Router();
const deviceSchema = z.object({ token: z.string().min(20).max(4096) }).strict();

router.use(authMiddleware);
router.use(asyncHandler(async (req, res, next) => {
  if (typeof req.user?.userId !== "string" || !req.user.userId) {
    sendError(res, "UNAUTHORIZED", "Authentication required", 401);
    return;
  }
  // Check the database role, including account deletion/demotion, on every registration request.
  const user = await prisma.user.findUnique({ where: { id: req.user!.userId }, select: { role: true } });
  if (!user || !["ADMIN", "SUPER_ADMIN"].includes(user.role)) {
    sendError(res, "FORBIDDEN", "Admin access required", 403);
    return;
  }
  res.setHeader("Cache-Control", "no-store");
  next();
}));

router.get("/config", (_req, res) => {
  sendSuccess(res, getAdminPushConfiguration());
});

router.post("/devices", asyncHandler(async (req, res) => {
  const parsed = deviceSchema.safeParse(req.body);
  if (!parsed.success) {
    sendError(res, "VALIDATION_ERROR", "A valid notification token is required", 400);
    return;
  }
  if (!getAdminPushConfiguration().configured) {
    sendError(res, "NOT_CONFIGURED", "Admin notifications are not configured yet", 503);
    return;
  }
  const expiry = req.user!.exp;
  if (typeof expiry !== "number" || !Number.isFinite(expiry) || expiry * 1000 <= Date.now()) {
    sendError(res, "INVALID_TOKEN", "Please sign in again to enable notifications", 401);
    return;
  }
  const expiresAt = new Date(expiry * 1000);
  const userId = req.user!.userId;
  const existing = await prisma.adminPushDevice.findUnique({ where: { token: parsed.data.token } });
  if (existing?.userId !== userId && await prisma.adminPushDevice.count({ where: { userId, expiresAt: { gt: new Date() } } }) >= 20) {
    sendError(res, "DEVICE_LIMIT", "The limit of 20 notification devices has been reached", 409);
    return;
  }
  await prisma.adminPushDevice.upsert({
    where: { token: parsed.data.token },
    create: { token: parsed.data.token, userId, expiresAt },
    update: { userId, expiresAt },
  });
  sendSuccess(res, { expiresAt: expiresAt.toISOString() }, "Notifications enabled for this browser");
}));

router.delete("/devices", asyncHandler(async (req, res) => {
  const parsed = deviceSchema.safeParse(req.body);
  if (!parsed.success) {
    sendError(res, "VALIDATION_ERROR", "A valid notification token is required", 400);
    return;
  }
  await prisma.adminPushDevice.deleteMany({ where: { token: parsed.data.token, userId: req.user!.userId } });
  sendSuccess(res, null, "Notifications disabled for this browser");
}));

export default router;
