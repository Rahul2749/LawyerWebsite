// src/controllers/auth.controller.ts
// Admin authentication (the lawyer's admin login).
// Only the lawyer/admin uses this — clients do NOT log in.

import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess, sendError } from "../utils/apiResponse";
import { prisma } from "../config/database";
import { env } from "../config/env";

// POST /api/auth/login
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    sendError(res, "MISSING_FIELDS", "Email and password are required", 400);
    return;
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    sendError(res, "INVALID_CREDENTIALS", "Invalid email or password", 401);
    return;
  }

  const passwordMatch = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatch) {
    sendError(res, "INVALID_CREDENTIALS", "Invalid email or password", 401);
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    env.JWT_SECRET as jwt.Secret,
    { expiresIn: "7d" }
  );

  sendSuccess(res, {
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  }, "Login successful");
});

// GET /api/auth/me
// Returns the currently logged-in admin's profile
export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.userId },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  if (!user) {
    sendError(res, "NOT_FOUND", "User not found", 404);
    return;
  }

  sendSuccess(res, user);
});
