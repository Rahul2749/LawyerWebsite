// src/utils/generateReference.ts
// Generates a human-readable, unique booking reference number.
// Format: RA-YYYYMMDD-XXXX (e.g. RA-20260823-A3F2)

export function generateReference(): string {
  const date = new Date();
  const datePart = date.getFullYear().toString() +
    String(date.getMonth() + 1).padStart(2, "0") +
    String(date.getDate()).padStart(2, "0");
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `RA-${datePart}-${randomPart}`;
}
