// src/server.ts
// Entry point — starts the Express server.
// Separated from app.ts so the app can be imported by tests without binding a port.

import app from "./app";
import { env } from "./config/env";
import { prisma } from "./config/database";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

async function startServer() {
  try {
    // Test database connection on startup
    await prisma.$connect();
    console.log("✅ Database connected");

    // Auto-seed if database is completely empty (no users)
    const userCount = await prisma.user.count();
    if (userCount === 0) {
      console.log("🌱 Database is empty. Running initial seed...");
      try {
        const { stdout } = await execAsync("npm run prisma:seed");
        console.log(stdout);
        console.log("✅ Auto-seed completed successfully.");
      } catch (seedError) {
        console.error("❌ Auto-seed failed:", seedError);
      }
    }

    app.listen(env.PORT, () => {
      console.log(`\n🚀 Server running on http://localhost:${env.PORT}`);
      console.log(`📁 Environment: ${env.NODE_ENV}`);
      console.log(`🏥 Health check: http://localhost:${env.PORT}/api/health\n`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received — shutting down gracefully...");
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

startServer();
