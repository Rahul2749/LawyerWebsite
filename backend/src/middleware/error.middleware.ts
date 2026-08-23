// src/middleware/error.middleware.ts
// Global error handler — Express calls this when next(error) is called or an async error is thrown.
// All unhandled errors flow through here, so error formatting is consistent.

import { Request, Response, NextFunction } from "express";
import { env } from "../config/env";
import { ZodError } from "zod";
import { sendError } from "../utils/apiResponse";

export function errorMiddleware(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error(`[ERROR] ${req.method} ${req.path}:`, err.message);

  // Zod validation errors — invalid request data
  if (err instanceof ZodError) {
    const fieldErrors: Record<string, string[]> = {};
    err.issues.forEach((issue) => {
      const key = issue.path.join(".");
      if (!fieldErrors[key]) fieldErrors[key] = [];
      fieldErrors[key].push(issue.message);
    });
    sendError(res, "VALIDATION_ERROR", "Invalid request data", 422, fieldErrors);
    return;
  }

  // Prisma unique constraint errors (e.g. duplicate email)
  if ((err as { code?: string }).code === "P2002") {
    sendError(res, "DUPLICATE_ENTRY", "A record with this value already exists", 409);
    return;
  }

  // Prisma not found errors
  if ((err as { code?: string }).code === "P2025") {
    sendError(res, "NOT_FOUND", "Record not found", 404);
    return;
  }

  // Generic server error — hide internal details in production
  const message = env.NODE_ENV === "development" ? err.message : "Internal server error";
  sendError(res, "INTERNAL_ERROR", message, 500);
}
