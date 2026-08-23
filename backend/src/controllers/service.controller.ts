// src/controllers/service.controller.ts
// Handles legal services (the consultation types offered by the lawyer).

import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess, sendError } from "../utils/apiResponse";
import { prisma } from "../config/database";

// GET /api/services
// Public — returns all active services
export const getServices = asyncHandler(async (_req: Request, res: Response) => {
  const services = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      icon: true,
      price: true,
      duration: true,
    },
  });
  sendSuccess(res, services);
});

// GET /api/services/:slug
// Public — get a specific service by slug
export const getServiceBySlug = asyncHandler(async (req: Request, res: Response) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const slug: string = (req.params as any).slug ?? "";
  const service = await prisma.service.findUnique({
    where: { slug },
  });
  if (!service || !service.isActive) {
    sendError(res, "NOT_FOUND", "Service not found", 404);
    return;
  }
  sendSuccess(res, service);
});

// POST /api/admin/services
// Admin only
export const createService = asyncHandler(async (req: Request, res: Response) => {
  const service = await prisma.service.create({ data: req.body });
  sendSuccess(res, service, "Service created", 201);
});

// PUT /api/admin/services/:id
// Admin only
export const updateService = asyncHandler(async (req: Request, res: Response) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const id: string = (req.params as any).id ?? "";
  const service = await prisma.service.update({
    where: { id },
    data: req.body,
  });
  sendSuccess(res, service, "Service updated");
});
