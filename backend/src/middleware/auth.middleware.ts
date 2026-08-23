// src/middleware/auth.middleware.ts
// JWT authentication middleware.
// Protects admin routes by verifying the Bearer token in the Authorization header.

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { sendError } from "../utils/apiResponse";

export interface AuthPayload {
  userId: string;
  email: string;
  role: string;
}

// Extend Express Request type to include authenticated user
declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    sendError(res, "UNAUTHORIZED", "Authentication required", 401);
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as AuthPayload;
    req.user = payload;
    next();
  } catch {
    sendError(res, "INVALID_TOKEN", "Invalid or expired token", 401);
  }
}
