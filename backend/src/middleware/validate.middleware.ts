// src/middleware/validate.middleware.ts
// Request body validation using Zod schemas.
// Usage: router.post("/", validate(mySchema), controller)

import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { sendError } from "../utils/apiResponse";

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const fieldErrors: Record<string, string[]> = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path.join(".");
        if (!fieldErrors[key]) fieldErrors[key] = [];
        fieldErrors[key].push(issue.message);
      });
      sendError(res, "VALIDATION_ERROR", "Invalid request data", 422, fieldErrors);
      return;
    }
    req.body = result.data; // Replaces body with parsed+validated data
    next();
  };
}
