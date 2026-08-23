# Backend Guide — Raja Agrawal Legal Consultancy

> **Who is this for?** This guide is written for someone new to Express.js. It explains what every file does, how to set things up, and how the API works — in plain English.

---

## Table of Contents

1. [What is the Backend?](#1-what-is-the-backend)
2. [Project Structure](#2-project-structure)
3. [Setup — Step by Step](#3-setup--step-by-step)
4. [Environment Variables](#4-environment-variables)
5. [Database Schema](#5-database-schema)
6. [API Reference](#6-api-reference)
7. [Payment Gateways](#7-payment-gateways)
8. [Email & WhatsApp Notifications](#8-email--whatsapp-notifications)
9. [How a Booking Works End-to-End](#9-how-a-booking-works-end-to-end)
10. [Common Commands](#10-common-commands)
11. [Common Errors & Fixes](#11-common-errors--fixes)
12. [Adding a New Route](#12-adding-a-new-route)

---

## 1. What is the Backend?

The **backend** is a server built with **Express.js** (Node.js). It does the following:

- Stores appointments, payments, and contact messages in a **PostgreSQL** database
- Processes **payments** via Razorpay and PhonePe
- Sends **emails** to clients (booking confirmation) and to the lawyer (internal alerts)
- Generates **WhatsApp links** so the lawyer can quickly message clients
- Protects admin routes with **JWT tokens** (so only the lawyer can access admin data)

The **frontend** (Next.js) calls the backend using `fetch()` API calls.

```
Client Browser → Next.js Frontend → Express Backend → PostgreSQL Database
                                  ↘ Razorpay / PhonePe
                                  ↘ Email (Nodemailer)
```

---

## 2. Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── env.ts          ← Reads .env variables and validates them
│   │   └── database.ts     ← Prisma database connection
│   │
│   ├── controllers/        ← Handle HTTP requests (what happens when an API is called)
│   │   ├── appointment.controller.ts
│   │   ├── auth.controller.ts
│   │   ├── contact.controller.ts
│   │   ├── payment.controller.ts
│   │   └── service.controller.ts
│   │
│   ├── middleware/         ← Code that runs BEFORE controllers (validation, auth checks)
│   │   ├── auth.middleware.ts      ← Checks JWT token for admin routes
│   │   ├── error.middleware.ts     ← Catches all errors and formats them
│   │   ├── rateLimiter.middleware.ts  ← Prevents spam/abuse
│   │   └── validate.middleware.ts  ← Validates request data using Zod schemas
│   │
│   ├── routes/             ← Defines which URL goes to which controller
│   │   ├── appointment.routes.ts
│   │   ├── auth.routes.ts
│   │   ├── contact.routes.ts
│   │   ├── payment.routes.ts
│   │   └── service.routes.ts
│   │
│   ├── services/           ← Business logic (database queries, external APIs)
│   │   ├── appointment.service.ts  ← Appointment CRUD logic
│   │   ├── email.service.ts        ← Send emails via Nodemailer
│   │   ├── payment.service.ts      ← Razorpay & PhonePe integration
│   │   └── whatsapp.service.ts     ← Generate WhatsApp links
│   │
│   ├── validators/         ← Zod schemas that describe valid request data
│   │   └── appointment.validator.ts
│   │
│   ├── utils/              ← Small helper functions
│   │   ├── apiResponse.ts          ← Standard { success, data, error } format
│   │   ├── asyncHandler.ts         ← Wraps async functions so errors are caught
│   │   └── generateReference.ts    ← Creates booking reference like RA-20260823-A3F2
│   │
│   ├── app.ts              ← Sets up Express (middleware, routes, error handler)
│   └── server.ts           ← Starts the server on a port
│
├── prisma/
│   ├── schema.prisma       ← Database table definitions
│   └── seed.ts             ← Initial data (services, admin user)
│
├── .env.example            ← Template for environment variables
├── .env                    ← Your actual secrets (DO NOT commit to git)
├── package.json
└── tsconfig.json
```

### The Flow of a Request

When the frontend calls `POST /api/appointments`:

```
1. Express receives the request
2. Rate limiter checks: too many requests? → block
3. validate middleware: is the data valid? → error if not
4. appointment.controller.ts handles it:
   - calls appointment.service.ts (which talks to the database)
   - returns JSON response
5. If anything throws an error → error.middleware.ts catches it and formats it
```

---

## 3. Setup — Step by Step

### Prerequisites

- **Node.js** 18+ — download from [nodejs.org](https://nodejs.org)
- **PostgreSQL** — download from [postgresql.org](https://www.postgresql.org/download/) or use [Docker](https://docs.docker.com/get-docker/)

### Step 1: Install dependencies

```bash
cd c:\Github\LawyerWebsite\backend
npm install
```

### Step 2: Create your `.env` file

```bash
# Copy the template
copy .env.example .env

# Open .env and fill in your values (see Section 4 below)
```

### Step 3: Create the PostgreSQL database

Open **pgAdmin** (installed with PostgreSQL) or use the command line:

```bash
# Using psql command line
psql -U postgres
CREATE DATABASE lawyer_db;
\q
```

Update `DATABASE_URL` in your `.env`:
```
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/lawyer_db"
```

### Step 4: Run database migrations

This creates all the tables in your PostgreSQL database:

```bash
npm run prisma:migrate
# When asked for a migration name, type: init
```

### Step 5: Seed initial data

This creates the 8 legal services and default admin account:

```bash
npm run prisma:seed
```

After seeding, you'll see:
```
✅ Admin user created: admin@rajaagrawal.in / Admin@123456
⚠️  Change the password immediately after first login!
✅ 8 services seeded
✅ 8 site settings seeded
```

### Step 6: Start the server

```bash
npm run dev
```

You should see:
```
✅ Database connected
🚀 Server running on http://localhost:5000
📁 Environment: development
🏥 Health check: http://localhost:5000/api/health
```

### Step 7: Test it

Open your browser and go to: `http://localhost:5000/api/health`

You should see:
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2026-08-23T...",
    "environment": "development"
  }
}
```

---

## 4. Environment Variables

Open `.env` and fill in these values:

### Server
| Variable | Example | What it does |
|---|---|---|
| `PORT` | `5000` | Which port the server runs on |
| `NODE_ENV` | `development` | Changes logging and error messages |

### Database
| Variable | Example | What it does |
|---|---|---|
| `DATABASE_URL` | `postgresql://postgres:pass@localhost:5432/lawyer_db` | PostgreSQL connection string |

### JWT (Authentication)
| Variable | Example | What it does |
|---|---|---|
| `JWT_SECRET` | `some-long-random-string` | Secret key for signing login tokens. Generate one: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |
| `JWT_EXPIRES_IN` | `7d` | How long the admin stays logged in |

### Email (Gmail SMTP)
1. Go to your Google Account → Security → 2-Step Verification (enable it)
2. Then go to: [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Create an App Password for "Mail"
4. Use that 16-character password as `EMAIL_PASS`

| Variable | Example |
|---|---|
| `EMAIL_HOST` | `smtp.gmail.com` |
| `EMAIL_PORT` | `587` |
| `EMAIL_USER` | `your-email@gmail.com` |
| `EMAIL_PASS` | `abcd efgh ijkl mnop` (Gmail App Password) |
| `EMAIL_FROM_NAME` | `Raja Agrawal Legal Consultancy` |
| `LAWYER_EMAIL` | `lawyer@rajaagrawal.in` (where alerts are sent) |

### Razorpay
1. Sign up at [dashboard.razorpay.com](https://dashboard.razorpay.com)
2. Go to Settings → API Keys
3. Generate a key pair (use Test mode first)

| Variable | Example |
|---|---|
| `RAZORPAY_KEY_ID` | `rzp_test_xxxxxxxxxxxxxxxx` |
| `RAZORPAY_KEY_SECRET` | `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` |

### PhonePe
1. Sign up at [developer.phonepe.com](https://developer.phonepe.com)
2. Get your sandbox credentials first

| Variable | Example |
|---|---|
| `PHONEPE_MERCHANT_ID` | `MERCHANTID` |
| `PHONEPE_SALT_KEY` | `your-salt-key` |
| `PHONEPE_SALT_INDEX` | `1` |
| `PHONEPE_BASE_URL` | `https://api-preprod.phonepe.com/apis/pg-sandbox` (for testing) |

---

## 5. Database Schema

### Tables Overview

| Table | What it stores |
|---|---|
| `User` | Admin accounts (only the lawyer uses this) |
| `Service` | Legal services (Family Law, Criminal, etc.) |
| `TimeSlot` | Available appointment slots |
| `Appointment` | Client bookings |
| `Payment` | Payment records (Razorpay/PhonePe) |
| `ContactMessage` | General contact form messages |
| `SiteSetting` | Key-value settings (editable without code changes) |

### Appointment Status Flow

```
PENDING_PAYMENT → CONFIRMED → COMPLETED
                          ↘ CANCELLED
                          ↘ REFUNDED
```

An appointment is `PENDING_PAYMENT` until the client pays. After payment verification, it becomes `CONFIRMED`.

---

## 6. API Reference

### Standard Response Format

**Success:**
```json
{ "success": true, "data": { ... }, "message": "optional message" }
```

**Error:**
```json
{ "success": false, "error": { "code": "ERROR_CODE", "message": "Human readable message" } }
```

### Appointments

#### `POST /api/appointments`
Create a new appointment (client facing).

**Request body:**
```json
{
  "clientName": "Rahul Sharma",
  "clientEmail": "rahul@example.com",
  "clientPhone": "+91 98765 43210",
  "clientMessage": "I need help with property dispute",
  "serviceId": "uuid-of-service",
  "preferredDate": "2026-09-01",
  "disclaimerAccepted": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "referenceNumber": "RA-20260823-A3F2",
    "status": "PENDING_PAYMENT",
    "serviceName": "Property & Real Estate",
    "servicePrice": 1500
  }
}
```

#### `GET /api/appointments/ref/:ref`
Check appointment status (client facing — by reference number).

#### `GET /api/slots?date=YYYY-MM-DD`
Get available time slots for a date.

#### `GET /api/appointments` (Admin only)
List all appointments. Add `?status=CONFIRMED` to filter.

### Services

#### `GET /api/services`
List all active services.

**Response:**
```json
{
  "success": true,
  "data": [
    { "id": "...", "name": "Family Law", "slug": "family-law", "price": 1500, "duration": 60, ... }
  ]
}
```

### Payments

#### `POST /api/payments/razorpay/create-order`
**Request:** `{ "appointmentId": "uuid" }`
**Response:** `{ "orderId": "order_xxx", "amount": 1500, "keyId": "rzp_test_xxx", ... }`

The frontend uses `orderId` and `keyId` to open the Razorpay checkout modal.

#### `POST /api/payments/razorpay/verify`
Called after user completes payment.
**Request:** `{ "razorpay_order_id": "...", "razorpay_payment_id": "...", "razorpay_signature": "...", "appointmentId": "..." }`

#### `POST /api/payments/phonepe/initiate`
**Request:** `{ "appointmentId": "uuid" }`
**Response:** `{ "redirectUrl": "https://mercury-uat.phonepe.com/..." }` — frontend redirects to this URL.

#### `POST /api/payments/phonepe/callback`
Called automatically by PhonePe after payment. No manual action needed.

### Auth

#### `POST /api/auth/login`
**Request:** `{ "email": "admin@rajaagrawal.in", "password": "Admin@123456" }`
**Response:** `{ "token": "jwt-token", "user": { ... } }`

Save the `token` and include it in subsequent admin requests as:
```
Authorization: Bearer <token>
```

---

## 7. Payment Gateways

### How Razorpay Works (Step by Step)

```
1. Frontend calls POST /api/payments/razorpay/create-order
2. Backend creates a Razorpay order → returns order_id
3. Frontend opens Razorpay checkout modal with the order_id
4. User completes payment on Razorpay's secure modal
5. Razorpay returns payment_id, order_id, signature to the frontend
6. Frontend calls POST /api/payments/razorpay/verify
7. Backend verifies the signature (IMPORTANT: prevents fake payments)
8. If valid → appointment confirmed, emails sent
```

**Test Card Numbers (Razorpay Test Mode):**
- Card: `4111 1111 1111 1111`
- CVV: Any 3 digits
- Expiry: Any future date
- OTP: `123456`

### How PhonePe Works (Step by Step)

```
1. Frontend calls POST /api/payments/phonepe/initiate
2. Backend creates PhonePe payment request → returns redirect URL
3. Frontend redirects user to PhonePe payment page
4. User pays on PhonePe's page
5. PhonePe calls our callback URL (POST /api/payments/phonepe/callback)
6. Backend verifies checksum → confirms appointment
7. PhonePe redirects user back to our confirmation page
```

### Switching from Test to Production

**Razorpay:**
- Change `rzp_test_xxx` keys to `rzp_live_xxx` keys in `.env`
- That's it!

**PhonePe:**
- Change `PHONEPE_BASE_URL` to `https://api.phonepe.com/apis/hermes`
- Update your production merchant credentials

---

## 8. Email & WhatsApp Notifications

### Emails Sent

| Event | To | Subject |
|---|---|---|
| Payment confirmed | Client | "Appointment Confirmed — RA-20260823-A3F2" |
| Payment confirmed | Lawyer | "🔔 New Appointment — RA-20260823-A3F2 (Family Law)" |

### WhatsApp (Internal)

When a booking is confirmed, the lawyer receives an email that includes a **WhatsApp click-to-chat link**. Clicking it opens a pre-filled WhatsApp message to the client.

This is done using the `https://wa.me/` URL format — no WhatsApp Business Account required.

**To upgrade to fully automated WhatsApp messages:**
1. Sign up for [Twilio](https://twilio.com) or [WATI](https://wati.io)
2. Uncomment the Twilio section in `src/services/whatsapp.service.ts`
3. Add your Twilio credentials to `.env`

---

## 9. How a Booking Works End-to-End

```
Step 1: Client fills the consultation form on /consultation page
        → Selects service (e.g., Family Law — ₹1500)
        → Enters name, email, phone, message
        → Accepts disclaimer
        → Clicks "Continue to Payment"

Step 2: Frontend calls POST /api/appointments
        → Backend creates appointment with status: PENDING_PAYMENT
        → Returns: appointmentId + referenceNumber

Step 3: Client chooses payment method (Razorpay or PhonePe)
        → Clicks "Pay ₹1500"

Step 4 (Razorpay path):
        Frontend calls POST /api/payments/razorpay/create-order
        → Razorpay checkout opens
        → Client pays
        → Frontend calls POST /api/payments/razorpay/verify
        → Backend verifies signature
        → Appointment status → CONFIRMED
        → Confirmation email → client
        → Alert email + WhatsApp link → lawyer

Step 4 (PhonePe path):
        Frontend calls POST /api/payments/phonepe/initiate
        → User redirected to PhonePe
        → Payment completed
        → PhonePe calls POST /api/payments/phonepe/callback (automatic)
        → Backend verifies → CONFIRMED
        → Emails sent

Step 5: Client sees "Appointment Confirmed" page with reference number
```

---

## 10. Common Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Open Prisma Studio (visual database browser)
npm run prisma:studio

# Re-run migrations after schema changes
npm run prisma:migrate

# Regenerate Prisma TypeScript types after schema changes
npm run prisma:generate

# Re-seed the database
npm run prisma:seed
```

---

## 11. Common Errors & Fixes

### `DATABASE_URL is not set`
→ Make sure your `.env` file exists and has `DATABASE_URL` filled in

### `P2002: Unique constraint failed`
→ You're trying to insert a duplicate record (e.g., same email for admin). Use a different email or delete the existing record.

### `P2025: Record not found`
→ The ID you're using doesn't exist in the database. Check if the record was deleted.

### `Invalid signature` (Razorpay)
→ The `RAZORPAY_KEY_SECRET` in `.env` doesn't match your Razorpay dashboard. Double-check the key.

### `CORS error` in browser
→ Make sure `FRONTEND_URL` in `.env` matches exactly the URL your Next.js dev server runs on (e.g., `http://localhost:3000`)

### Email not sending
→ Check that you're using a **Gmail App Password** (not your regular Gmail password). Enable 2FA first at [myaccount.google.com/security](https://myaccount.google.com/security).

### Port already in use
→ Another process is using port 5000. Either kill it or change `PORT` in `.env` to `5001`.

---

## 12. Adding a New Route

Example: Add a `GET /api/testimonials` endpoint.

**Step 1: Create the controller** (`src/controllers/testimonial.controller.ts`)
```typescript
import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/apiResponse";

export const getTestimonials = asyncHandler(async (_req: Request, res: Response) => {
  // Fetch from DB or return static data
  const testimonials = [{ name: "Client A", text: "Great lawyer!" }];
  sendSuccess(res, testimonials);
});
```

**Step 2: Create the route** (`src/routes/testimonial.routes.ts`)
```typescript
import { Router } from "express";
import { getTestimonials } from "../controllers/testimonial.controller";
const router = Router();
router.get("/", getTestimonials);
export default router;
```

**Step 3: Register in `app.ts`**
```typescript
import testimonialRoutes from "./routes/testimonial.routes";
app.use("/api/testimonials", testimonialRoutes);
```

**Done!** The endpoint is now available at `GET /api/testimonials`.

---

*Last updated: August 2026 — Raja Agrawal Legal Consultancy Backend*
