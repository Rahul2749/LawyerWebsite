// src/services/payment.service.ts
// Handles payment gateway integration for both Razorpay and PhonePe.
// Each gateway has:
//   - createOrder(): Initiates a payment
//   - verify():     Validates the payment after completion (webhook/callback)

import Razorpay from "razorpay";
import crypto from "crypto";
import axios from "axios";
import { env } from "../config/env";

// ─── RAZORPAY ────────────────────────────────────────────────────────────────

const razorpay = new Razorpay({
  key_id: env.RAZORPAY_KEY_ID,
  key_secret: env.RAZORPAY_KEY_SECRET,
});

export interface RazorpayOrderResult {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
}

// Step 1: Create a Razorpay order — returns order details to the frontend
// The frontend uses these to open the Razorpay checkout modal
export async function createRazorpayOrder(
  amountInRupees: number,
  referenceNumber: string
): Promise<RazorpayOrderResult> {
  const order = await razorpay.orders.create({
    amount: amountInRupees * 100, // Razorpay needs amount in paise (₹1 = 100 paise)
    currency: "INR",
    receipt: referenceNumber,
    notes: { referenceNumber },
  });

  return {
    orderId: order.id,
    amount: amountInRupees,
    currency: "INR",
    keyId: env.RAZORPAY_KEY_ID,
  };
}

// Step 2: Verify Razorpay payment signature
// Razorpay signs the payment response — we verify this signature to confirm the payment is genuine
// (Not verifying this is a serious security vulnerability — anyone could fake a payment)
export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const expectedSignature = crypto
    .createHmac("sha256", env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  return expectedSignature === signature;
}

// ─── PHONEPE ─────────────────────────────────────────────────────────────────

export interface PhonePePaymentResult {
  redirectUrl: string;
  merchantTransactionId: string;
}

// Step 1: Initiate a PhonePe payment — returns a redirect URL
// The frontend redirects the user to this URL to complete payment
export async function initiatePhonePePayment(
  amountInRupees: number,
  referenceNumber: string,
  clientPhone: string,
  clientName: string
): Promise<PhonePePaymentResult> {
  const merchantTransactionId = `TXN_${referenceNumber}_${Date.now()}`;
  
  const payload = {
    merchantId: env.PHONEPE_MERCHANT_ID,
    merchantTransactionId,
    merchantUserId: referenceNumber,
    amount: amountInRupees * 100, // PhonePe also uses paise
    redirectUrl: env.PHONEPE_REDIRECT_URL,
    redirectMode: "GET",
    callbackUrl: env.PHONEPE_CALLBACK_URL,
    mobileNumber: clientPhone.replace(/\D/g, ""),
    paymentInstrument: {
      type: "PAY_PAGE",
    },
  };

  // PhonePe requires Base64 encoding of the payload
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64");
  
  // Generate checksum: SHA256(base64payload + "/pg/v1/pay" + saltKey) + "###" + saltIndex
  const checksumData = `${encodedPayload}/pg/v1/pay${env.PHONEPE_SALT_KEY}`;
  const checksum =
    crypto.createHash("sha256").update(checksumData).digest("hex") +
    `###${env.PHONEPE_SALT_INDEX}`;

  const response = await axios.post(
    `${env.PHONEPE_BASE_URL}/pg/v1/pay`,
    { request: encodedPayload },
    {
      headers: {
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
      },
    }
  );

  const redirectUrl = response.data?.data?.instrumentResponse?.redirectInfo?.url;
  if (!redirectUrl) {
    throw new Error("PhonePe did not return a redirect URL");
  }

  return { redirectUrl, merchantTransactionId };
}

// Step 2: Verify PhonePe payment via callback
// PhonePe sends a POST to our callback URL — we verify the X-VERIFY checksum
export function verifyPhonePeCallback(
  base64Response: string,
  receivedChecksum: string
): boolean {
  const expectedChecksum =
    crypto
      .createHash("sha256")
      .update(`${base64Response}${env.PHONEPE_SALT_KEY}`)
      .digest("hex") +
    `###${env.PHONEPE_SALT_INDEX}`;
  return expectedChecksum === receivedChecksum;
}

// Decode PhonePe callback response
export function decodePhonePeResponse(base64Response: string): {
  success: boolean;
  merchantTransactionId: string;
  transactionId: string;
} {
  const decoded = JSON.parse(Buffer.from(base64Response, "base64").toString("utf-8"));
  return {
    success: decoded.code === "PAYMENT_SUCCESS",
    merchantTransactionId: decoded.data?.merchantTransactionId ?? "",
    transactionId: decoded.data?.transactionId ?? "",
  };
}
