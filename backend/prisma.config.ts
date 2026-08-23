// prisma.config.ts
// Prisma v7 moved database URL configuration out of schema.prisma and into this file.
// See: https://pris.ly/d/config-datasource

import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});
