// src/utils/asyncHandler.ts
// Wraps async route handlers to catch any thrown errors automatically.
// Without this, you'd need try-catch in every controller function.

import { Request, Response, NextFunction, RequestHandler } from "express";

type AsyncFn = (req: Request, res: Response, next: NextFunction) => Promise<void>;

export function asyncHandler(fn: AsyncFn): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
