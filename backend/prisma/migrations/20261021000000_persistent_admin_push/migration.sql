-- Keep existing device registrations; notification consent is independent of login expiry.
DROP INDEX "AdminPushDevice_expiresAt_idx";
ALTER TABLE "AdminPushDevice" DROP COLUMN "expiresAt";
