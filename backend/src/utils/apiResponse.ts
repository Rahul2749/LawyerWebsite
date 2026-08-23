// src/utils/apiResponse.ts
// Standard response shapes used across all controllers.
// Keeping responses consistent makes the frontend integration easier.

import { Response } from "express";

export interface ApiSuccess<T = unknown> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    fieldErrors?: Record<string, string[]>;
  };
}

export interface PaginatedData<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

// Send a success response
export function sendSuccess<T>(
  res: Response,
  data: T,
  message?: string,
  statusCode = 200
): void {
  const body: ApiSuccess<T> = { success: true, data, ...(message && { message }) };
  res.status(statusCode).json(body);
}

// Send an error response
export function sendError(
  res: Response,
  code: string,
  message: string,
  statusCode = 400,
  fieldErrors?: Record<string, string[]>
): void {
  const body: ApiError = {
    success: false,
    error: { code, message, ...(fieldErrors && { fieldErrors }) },
  };
  res.status(statusCode).json(body);
}
