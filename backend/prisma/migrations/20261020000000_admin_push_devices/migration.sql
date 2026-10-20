CREATE TABLE "AdminPushDevice" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "AdminPushDevice_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "AdminPushDevice_token_key" ON "AdminPushDevice"("token");
CREATE INDEX "AdminPushDevice_userId_idx" ON "AdminPushDevice"("userId");
CREATE INDEX "AdminPushDevice_expiresAt_idx" ON "AdminPushDevice"("expiresAt");
ALTER TABLE "AdminPushDevice" ADD CONSTRAINT "AdminPushDevice_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
