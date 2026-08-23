// src/config/env.ts
// Validates all required environment variables at startup.
// If anything is missing, the server refuses to start — no silent failures.

import dotenv from "dotenv";
dotenv.config();

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}\nCheck your .env file.`);
  }
  return value;
}

function optionalEnv(name: string, fallback: string): string {
  return process.env[name] ?? fallback;
}

export const env = {
  // Server
  PORT: parseInt(optionalEnv("PORT", "5000"), 10),
  NODE_ENV: optionalEnv("NODE_ENV", "development"),

  // Database
  DATABASE_URL: requireEnv("DATABASE_URL"),

  // JWT
  JWT_SECRET: requireEnv("JWT_SECRET"),
  JWT_EXPIRES_IN: optionalEnv("JWT_EXPIRES_IN", "7d"),

  // Frontend (for CORS)
  FRONTEND_URL: optionalEnv("FRONTEND_URL", "http://localhost:3000"),

  // Email
  EMAIL_HOST: optionalEnv("EMAIL_HOST", "smtp.gmail.com"),
  EMAIL_PORT: parseInt(optionalEnv("EMAIL_PORT", "587"), 10),
  EMAIL_USER: optionalEnv("EMAIL_USER", ""),
  EMAIL_PASS: optionalEnv("EMAIL_PASS", ""),
  EMAIL_FROM_NAME: optionalEnv("EMAIL_FROM_NAME", "Raja Agrawal Legal Consultancy"),
  EMAIL_FROM_ADDRESS: optionalEnv("EMAIL_FROM_ADDRESS", "noreply@rajaagrawal.in"),

  // Lawyer contact
  LAWYER_PHONE: optionalEnv("LAWYER_PHONE", "919999999999"),
  LAWYER_EMAIL: optionalEnv("LAWYER_EMAIL", "lawyer@rajaagrawal.in"),
  LAWYER_WHATSAPP_NUMBER: optionalEnv("LAWYER_WHATSAPP_NUMBER", "919999999999"),

  // Razorpay
  RAZORPAY_KEY_ID: optionalEnv("RAZORPAY_KEY_ID", ""),
  RAZORPAY_KEY_SECRET: optionalEnv("RAZORPAY_KEY_SECRET", ""),

  // PhonePe
  PHONEPE_MERCHANT_ID: optionalEnv("PHONEPE_MERCHANT_ID", ""),
  PHONEPE_SALT_KEY: optionalEnv("PHONEPE_SALT_KEY", ""),
  PHONEPE_SALT_INDEX: parseInt(optionalEnv("PHONEPE_SALT_INDEX", "1"), 10),
  PHONEPE_BASE_URL: optionalEnv("PHONEPE_BASE_URL", "https://api-preprod.phonepe.com/apis/pg-sandbox"),
  PHONEPE_REDIRECT_URL: optionalEnv("PHONEPE_REDIRECT_URL", "http://localhost:3000/consultation/confirmed"),
  PHONEPE_CALLBACK_URL: optionalEnv("PHONEPE_CALLBACK_URL", "http://localhost:5000/api/payments/phonepe/callback"),
} as const;
