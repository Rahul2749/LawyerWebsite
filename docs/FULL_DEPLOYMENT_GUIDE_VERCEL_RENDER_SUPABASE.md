# Comprehensive Production Deployment Guide
## Deploying Next.js to Vercel, Express Backend to Render, and PostgreSQL to Supabase

This is the **complete, end-to-end production deployment guide** for the Advocate & Legal Consultant platform (`LawyerWebsite`).

---

## 🏗 System Architecture Overview

```
                        ┌──────────────────────────────────────────┐
                        │             USER BROWSER                 │
                        └────────────────────┬─────────────────────┘
                                             │
                       ┌─────────────────────┴─────────────────────┐
                       │                                           │
                       ▼                                           ▼
          ┌─────────────────────────┐                 ┌─────────────────────────┐
          │     VERCEL HOSTING      │                 │  RAZORPAY CHECKOUT SDK  │
          │ Next.js 16 App Router   │                 │ (Client-side Payment)   │
          │ (https://...vercel.app) │                 └────────────┬────────────┘
          └────────────┬────────────┘                              │
                       │ REST API Requests                         │ Webhook Events
                       ▼                                           ▼
          ┌─────────────────────────────────────────────────────────────────────┐
          │                           RENDER HOSTING                            │
          │                   Node.js Express Backend Service                   │
          │               (https://lawyerwebsite-backend.onrender.com)          │
          └──────────────────────────────┬──────────────────────────────────────┘
                                         │
                                         ▼
          ┌─────────────────────────────────────────────────────────────────────┐
          │                          SUPABASE HOSTING                           │
          │               PostgreSQL 15+ Database (PgBouncer Pooler)            │
          │                  (db.xxx.supabase.co:6543 / 5432)                    │
          └─────────────────────────────────────────────────────────────────────┘
```

---

## 🔑 Environment Variables Master Reference Matrix

### 1. Vercel (Frontend Next.js) Environment Variables
Set these variables under **Vercel Project Settings ➔ Environment Variables**:

| Variable Name | Environment | Required? | Description & Example Value |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_API_BASE_URL` | Production, Preview, Dev | **REQUIRED** | Render backend API endpoint URL: `https://lawyerwebsite-backend.onrender.com/api` |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Production, Preview, Dev | **REQUIRED** | Public Key ID from Razorpay Dashboard: `rzp_test_TG09eOXmAcaGSI` |

---

### 2. Render (Backend Node.js Express) Environment Variables
Set these variables under **Render Web Service ➔ Environment**:

| Variable Name | Required? | Example / Default Value | Description |
| :--- | :--- | :--- | :--- |
| `NODE_ENV` | **REQUIRED** | `production` | Enables production mode optimizations |
| `PORT` | Optional | `5000` (Render sets automatically) | Backend HTTP server port |
| `DATABASE_URL` | **REQUIRED** | `postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:6543/postgres?pgbouncer=true` | Supabase PgBouncer Pooled PostgreSQL URL |
| `DIRECT_URL` | **REQUIRED** | `postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres` | Supabase Direct PostgreSQL connection URL (for Prisma migrations) |
| `JWT_SECRET` | **REQUIRED** | `lawyer-secret-jwt-key-minimum-32-chars-2026-xyz` | Secret key used to sign Admin Auth JWT tokens |
| `JWT_EXPIRES_IN` | Optional | `7d` | Admin token expiry time |
| `FRONTEND_URL` | **REQUIRED** | `https://lawyerwebsite.vercel.app` | Vercel production frontend origin (for CORS approval) |
| `RAZORPAY_KEY_ID` | **REQUIRED** | `rzp_test_TG09eOXmAcaGSI` | Razorpay Key ID |
| `RAZORPAY_KEY_SECRET` | **REQUIRED** | `yogLGpRp4jGZFNeRmb8WQN5v` | Razorpay Secret Key |
| `RAZORPAY_WEBHOOK_SECRET` | **REQUIRED** | `tm_abcKL1955_webhook_test_2026` | Secret string set in Razorpay Webhooks |
| `RESEND_API_KEY` | **REQUIRED** | `re_123456789` | Resend API Key for transactional emails |
| `EMAIL_FROM_NAME` | Optional | `Raja Agrawal Legal Consultancy` | Sender Display Name |
| `EMAIL_FROM_ADDRESS` | Optional | `onboarding@resend.dev` | Sender Email Address |
| `LAWYER_PHONE` | Optional | `918605399330` | Advocate Phone Number |
| `LAWYER_EMAIL` | Optional | `rajaagrawal.adv@gmail.com` | Advocate Notification Email |
| `LAWYER_WHATSAPP_NUMBER` | Optional | `918605399330` | Advocate WhatsApp Number (with country code) |

---

## 📍 Phase 1: Database Setup on Supabase

### Step 1.1: Create a Supabase Project
1. Log in to [Supabase Dashboard](https://app.supabase.com).
2. Click **New Project**.
3. Fill in project details:
   - **Name:** `LawyerWebsite-DB`
   - **Database Password:** Set a strong password (save this securely!).
   - **Region:** Choose the region closest to your users (e.g., `Mumbai (ap-south-1)`).
4. Click **Create new project** and wait 1–2 minutes for initialization.

### Step 1.2: Get PostgreSQL Connection Strings
1. In your Supabase project dashboard, navigate to **Project Settings ➔ Database**.
2. Scroll to **Connection Strings**:
   - **Pooled Connection String (PgBouncer - Port 6543):**
     ```text
     postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:6543/postgres?pgbouncer=true
     ```
     *(This is your `DATABASE_URL` for Render)*
   - **Direct Connection String (Direct - Port 5432):**
     ```text
     postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
     ```
     *(This is your `DIRECT_URL` for Prisma migrations)*

### Step 1.3: Run Prisma Migrations and Seed Data
From your local terminal, run the following commands to initialize the remote Supabase database:

```bash
# 1. Navigate to backend directory
cd c:\Github\LawyerWebsite\backend

# 2. Set temporary environment variables pointing to Supabase
set DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:6543/postgres?pgbouncer=true"

# 3. Push Prisma schema to remote Supabase DB
npx prisma db push

# 4. Seed 18 Legal Practice Areas (flat ₹1,000 rate) into Supabase DB
npx tsx prisma/seed.ts
```

---

## 🚀 Phase 2: Backend Deployment on Render

### Step 2.1: Connect Repository to Render
1. Log in to [Render Dashboard](https://dashboard.render.com).
2. Click **New +** ➔ **Web Service**.
3. Connect your GitHub account and select your repository (`Rahul2749/LawyerWebsite`).

### Step 2.2: Configure Render Web Service
Fill in the following exact settings:
- **Name:** `lawyerwebsite-backend`
- **Region:** `Singapore` (or nearest to India/Users)
- **Branch:** `main`
- **Root Directory:** `backend`
- **Runtime:** `Node`
- **Build Command:**
  ```bash
  npm install --include=dev && npx prisma generate && npm run build
  ```
- **Start Command:**
  ```bash
  npm run start
  ```
- **Instance Type:** Free or Starter

### Step 2.3: Enter Environment Variables in Render
In the **Environment** tab of your Render service, add all variables from the Backend Matrix above:
- `NODE_ENV` = `production`
- `DATABASE_URL` = `postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:6543/postgres?pgbouncer=true`
- `JWT_SECRET` = `lawyer-secret-jwt-key-minimum-32-chars-2026-xyz`
- `FRONTEND_URL` = `https://lawyerwebsite.vercel.app` *(update after Step 3)*
- `RAZORPAY_KEY_ID` = `rzp_test_TG09eOXmAcaGSI`
- `RAZORPAY_KEY_SECRET` = `yogLGpRp4jGZFNeRmb8WQN5v`
- `RAZORPAY_WEBHOOK_SECRET` = `tm_abcKL1955_webhook_test_2026`
- `RESEND_API_KEY` = `re_YOUR_RESEND_KEY_HERE` *(your Resend API key)*
- `EMAIL_FROM_NAME` = `Raja Agrawal Legal Consultancy`
- `EMAIL_FROM_ADDRESS` = `onboarding@resend.dev` *(or your verified custom domain)*
- `LAWYER_PHONE` = `918605399330`
- `LAWYER_EMAIL` = `rahulnagrikar123@gmail.com`

Click **Save Changes**. Render will automatically deploy your Node.js backend. Once finished, copy your service URL (e.g. `https://lawyerwebsite-backend.onrender.com`).

---

## ⚡ Phase 3: Frontend Deployment on Vercel

### Step 3.1: Import Project to Vercel
1. Log in to [Vercel Dashboard](https://vercel.com).
2. Click **Add New... ➔ Project**.
3. Select your GitHub repository (`Rahul2749/LawyerWebsite`).

### Step 3.2: Configure Vercel Project Settings
- **Framework Preset:** `Next.js`
- **Root Directory:** `./` (Leave default root directory)
- **Build Command:** `npm run build`
- **Output Directory:** `.next`

### Step 3.3: Configure Vercel Environment Variables
Under the **Environment Variables** section, add:

1. `NEXT_PUBLIC_BACKEND_URL`
   - **Value:** `https://lawyerwebsite-backend.onrender.com`
   - **Environments:** Production, Preview, Development

2. `NEXT_PUBLIC_RAZORPAY_KEY_ID`
   - **Value:** `rzp_test_TG09eOXmAcaGSI`
   - **Environments:** Production, Preview, Development

Click **Deploy**. Vercel will build and deploy your Next.js frontend. Copy your Vercel live URL (e.g. `https://lawyerwebsite.vercel.app`).

---

## 🔗 Phase 4: Inter-Service Wireup & Webhooks

### Step 4.1: Update `FRONTEND_URL` on Render
1. Return to [Render Dashboard](https://dashboard.render.com) ➔ `lawyerwebsite-backend` ➔ **Environment**.
2. Update `FRONTEND_URL` to your production Vercel domain:
   ```text
   FRONTEND_URL = https://lawyerwebsite.vercel.app
   ```
3. Save changes (Render will trigger a quick zero-downtime redeploy).

### Step 4.2: Configure Razorpay Webhook URL
1. Log in to [Razorpay Dashboard](https://dashboard.razorpay.com) (or Sandbox Mode).
2. Go to **Settings ➔ Webhooks**.
3. Click **Add New Webhook**.
4. Set **Webhook URL**:
   ```text
   https://lawyerwebsite-backend.onrender.com/api/payments/razorpay/webhook
   ```
5. Set **Secret**: `tm_abcKL1955_webhook_test_2026`
6. Select **Active Events**:
   - `payment.authorized`
   - `payment.failed`
   - `order.paid`
7. Click **Save**.

---

## ✅ Phase 5: Production Verification Checklist

Run through this verification procedure after deployment:

| Test Case | Procedure | Expected Result | Pass/Fail |
| :--- | :--- | :--- | :---: |
| **1. Frontend Load** | Open `https://lawyerwebsite.vercel.app` in browser | Page loads cleanly with luxury styling, navigation bar, and legal services | [ ] |
| **2. Services Grid** | Scroll to Legal Services section | 18 practice area cards render with metallic gold badges and hover effects | [ ] |
| **3. Consultation Booking** | Click **Book Consultation** ➔ Select service from dropdown | Form populates service details and displays flat fee ₹1,000 with zero hidden charges | [ ] |
| **4. Razorpay Modal** | Fill form details and click **Proceed to Payment** | Razorpay checkout popup opens cleanly showing ₹1,000 amount | [ ] |
| **5. Test Payment** | Complete test payment using Razorpay Test UPI / Card | Payment completes, redirects to `/consultation?status=success` confirmation | [ ] |
| **6. Webhook Processing** | Check Render backend logs | Log shows `[Webhook] Payment order.paid received for appointment RA-xxxx` | [ ] |
| **7. Admin Panel Login** | Navigate to `https://lawyerwebsite.vercel.app/admin-lawyersite` | Log in with admin credentials and verify booked appointment appears in list | [ ] |

---

## 🛠 Troubleshooting & Common Fixes

### 1. Render Free Tier Cold Starts
- **Symptom:** First API request after 15 minutes of inactivity takes 30-50 seconds to respond.
- **Fix:** Keep the free instance warm using a free cron service (e.g. [cron-job.org](https://cron-job.org)) pinging `https://lawyerwebsite-backend.onrender.com/api/health` every 10 minutes.

### 2. CORS Blocked Errors in Browser Console
- **Symptom:** `Access to fetch at 'https://...onrender.com/api' from origin 'https://...vercel.app' has been blocked by CORS policy`.
- **Fix:** Ensure `FRONTEND_URL` on Render matches your exact Vercel domain without trailing slashes.

### 3. Supabase Connection Pool Exhaustion
- **Symptom:** `PrismaClientInitializationError: Too many clients connected`.
- **Fix:** Verify `DATABASE_URL` uses port `6543` with `?pgbouncer=true` parameter.

---

## 📄 Summary of Target Production Endpoints

- **Live Website (Vercel):** `https://lawyerwebsite.vercel.app`
- **Backend API (Render):** `https://lawyerwebsite-backend.onrender.com/api`
- **Database (Supabase):** `db.xxx.supabase.co:6543` (PgBouncer)
- **Admin Dashboard:** `https://lawyerwebsite.vercel.app/admin-lawyersite`
