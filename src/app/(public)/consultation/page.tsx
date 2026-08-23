"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { siteSettings } from "@/data/siteSettings";

// ─── Validation schema ────────────────────────────────────────────────────────
const consultationSchema = z.object({
  clientName: z.string().min(2, "Name must be at least 2 characters"),
  clientEmail: z.string().email("Please enter a valid email address"),
  clientPhone: z.string().min(7, "Please enter a valid phone number"),
  clientMessage: z.string().optional(),
  serviceId: z.string().min(1, "Please select a service"),
  preferredDate: z.string().optional(),
  disclaimerAccepted: z.literal(true, {
    errorMap: () => ({ message: "You must accept the disclaimer to proceed" }),
  }),
  website: z.string().max(0).optional(), // Honeypot
});

type ConsultationFormData = z.infer<typeof consultationSchema>;

// ─── Payment gateway choice ───────────────────────────────────────────────────
type Gateway = "razorpay" | "phonepe";

// ─── Step indicator ──────────────────────────────────────────────────────────
function StepIndicator({ currentStep }: { currentStep: 1 | 2 | 3 }) {
  const steps = [
    { num: 1, label: "Your Details" },
    { num: 2, label: "Payment" },
    { num: 3, label: "Confirmation" },
  ];

  return (
    <div className="flex items-center justify-center gap-0 mb-12">
      {steps.map((step, i) => (
        <div key={step.num} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                currentStep > step.num
                  ? "bg-accent-wine text-text-inverse"
                  : currentStep === step.num
                  ? "border-2 border-accent-wine text-accent-wine bg-transparent"
                  : "border-2 border-border-subtle text-text-secondary bg-transparent"
              }`}
            >
              {currentStep > step.num ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                step.num
              )}
            </div>
            <span
              className={`text-caption mt-1.5 hidden sm:block ${
                currentStep === step.num ? "text-text-primary font-medium" : "text-text-secondary"
              }`}
            >
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`w-16 sm:w-24 h-px mx-2 transition-all duration-300 ${
                currentStep > step.num ? "bg-accent-wine" : "bg-border-subtle"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Service selector card ────────────────────────────────────────────────────
function ServiceCard({
  service,
  isSelected,
  onClick,
}: {
  service: (typeof siteSettings.services)[number];
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
        isSelected
          ? "border-accent-wine bg-accent-wine/5"
          : "border-border-subtle hover:border-accent-gold/50 hover:bg-bg-secondary"
      }`}
      aria-pressed={isSelected}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className={`font-medium text-sm ${isSelected ? "text-accent-wine" : "text-text-primary"}`}>
            {service.name}
          </p>
          <p className="text-caption text-text-secondary mt-0.5 leading-relaxed">
            {service.description}
          </p>
        </div>
      </div>
    </button>
  );
}

// ─── Main consultation form (Step 1) ─────────────────────────────────────────
function ConsultationForm({ onSubmitSuccess }: { onSubmitSuccess: (data: { appointmentId: string; servicePrice: number; serviceName: string; referenceNumber: string }) => void }) {
  const searchParams = useSearchParams();
  const preSelectedSlug = searchParams.get("service") ?? "";
  const preSelected = siteSettings.services.find((s) => s.slug === preSelectedSlug);

  const [selectedService, setSelectedService] = useState<(typeof siteSettings.services)[number] | undefined>(
    preSelected
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ConsultationFormData>({
    resolver: zodResolver(consultationSchema),
    defaultValues: { serviceId: preSelected?.id ?? "" },
  });

  const onSubmit = async (data: ConsultationFormData) => {
    if (data.website && data.website.length > 0) return; // Honeypot
    if (!data.disclaimerAccepted) return;

    setIsSubmitting(true);
    setServerError("");

    try {
      const res = await fetch(`${siteSettings.BACKEND_URL}/api/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (!res.ok) {
        setServerError(json.error?.message ?? "Something went wrong. Please try again.");
        return;
      }

      onSubmitSuccess({
        appointmentId: json.data.id,
        servicePrice: json.data.servicePrice,
        serviceName: json.data.serviceName,
        referenceNumber: json.data.referenceNumber,
      });
    } catch {
      setServerError("Could not connect to server. Please check your internet connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {/* Honeypot */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <input type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      {/* Service selection */}
      <div className="mb-8">
        <label htmlFor="serviceSelect" className="text-eyebrow text-text-primary mb-2 block">
          Select Service *
        </label>
        <div className="relative">
          <select
            id="serviceSelect"
            value={selectedService?.id ?? ""}
            onChange={(e) => {
              const service = siteSettings.services.find((s) => s.id === e.target.value);
              setSelectedService(service);
              setValue("serviceId", e.target.value);
            }}
            className={`w-full px-4 py-3.5 bg-bg-secondary/30 border text-text-primary focus:outline-none focus:border-accent-wine transition-colors rounded-lg appearance-none cursor-pointer text-sm font-medium ${
              errors.serviceId ? "border-state-error" : "border-border-subtle"
            }`}
          >
            <option value="" disabled className="bg-bg-primary text-text-secondary py-2">
              Select a service...
            </option>
            {siteSettings.services.map((service) => (
              <option key={service.id} value={service.id} className="bg-bg-primary text-text-primary py-2">
                {service.name}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {selectedService && (
          <p className="text-xs text-text-secondary mt-2.5 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-gold shrink-0" />
            <span>{selectedService.description}</span>
          </p>
        )}
        <input type="hidden" {...register("serviceId")} />
        {errors.serviceId && (
          <p className="text-xs text-state-error mt-2">{errors.serviceId.message}</p>
        )}
      </div>

      {/* Personal details */}
      <div className="mb-8">
        <h3 className="text-eyebrow text-text-primary mb-4">Your Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Name */}
          <div className="sm:col-span-2">
            <label htmlFor="clientName" className="text-eyebrow text-text-primary mb-2 block">
              Full Name *
            </label>
            <input
              id="clientName"
              type="text"
              className={`w-full px-4 py-3 bg-transparent border text-text-primary placeholder:text-text-secondary/40 focus:outline-none focus:border-accent-wine transition-colors rounded-lg ${
                errors.clientName ? "border-state-error" : "border-border-subtle"
              }`}
              placeholder="Your full name"
              {...register("clientName")}
            />
            {errors.clientName && (
              <p className="text-xs text-state-error mt-1">{errors.clientName.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="clientEmail" className="text-eyebrow text-text-primary mb-2 block">
              Email Address *
            </label>
            <input
              id="clientEmail"
              type="email"
              className={`w-full px-4 py-3 bg-transparent border text-text-primary placeholder:text-text-secondary/40 focus:outline-none focus:border-accent-wine transition-colors rounded-lg ${
                errors.clientEmail ? "border-state-error" : "border-border-subtle"
              }`}
              placeholder="your@email.com"
              {...register("clientEmail")}
            />
            {errors.clientEmail && (
              <p className="text-xs text-state-error mt-1">{errors.clientEmail.message}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="clientPhone" className="text-eyebrow text-text-primary mb-2 block">
              Phone Number *
            </label>
            <input
              id="clientPhone"
              type="tel"
              className={`w-full px-4 py-3 bg-transparent border text-text-primary placeholder:text-text-secondary/40 focus:outline-none focus:border-accent-wine transition-colors rounded-lg ${
                errors.clientPhone ? "border-state-error" : "border-border-subtle"
              }`}
              placeholder="+91 98765 43210"
              {...register("clientPhone")}
            />
            {errors.clientPhone && (
              <p className="text-xs text-state-error mt-1">{errors.clientPhone.message}</p>
            )}
          </div>

          {/* Preferred date */}
          <div>
            <label htmlFor="preferredDate" className="text-eyebrow text-text-primary mb-2 block">
              Preferred Date
            </label>
            <input
              id="preferredDate"
              type="date"
              className="w-full px-4 py-3 bg-transparent border border-border-subtle text-text-primary focus:outline-none focus:border-accent-wine transition-colors rounded-lg"
              min={new Date().toISOString().split("T")[0]}
              {...register("preferredDate")}
            />
          </div>

          {/* Message */}
          <div className="sm:col-span-2">
            <label htmlFor="clientMessage" className="text-eyebrow text-text-primary mb-2 block">
              Brief Description of Matter{" "}
              <span className="text-text-secondary font-normal normal-case">(optional)</span>
            </label>
            <textarea
              id="clientMessage"
              rows={4}
              className="w-full px-4 py-3 bg-transparent border border-border-subtle text-text-primary placeholder:text-text-secondary/40 focus:outline-none focus:border-accent-wine transition-colors resize-none rounded-lg"
              placeholder="Please share a brief overview of your legal matter…"
              {...register("clientMessage")}
            />
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-bg-secondary border border-border-subtle rounded-xl p-5 mb-6">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            className="mt-1 w-4 h-4 accent-accent-wine flex-shrink-0"
            {...register("disclaimerAccepted")}
          />
          <span className="text-sm text-text-secondary leading-relaxed">
            I understand that submitting this form and completing payment does{" "}
            <strong className="text-text-primary">not</strong> create an attorney-client
            relationship. Such relationship is established only upon a written retainer
            agreement. I also acknowledge that this channel is not secure for transmitting
            highly sensitive or privileged information. *
          </span>
        </label>
        {errors.disclaimerAccepted && (
          <p className="text-xs text-state-error mt-2">{errors.disclaimerAccepted.message}</p>
        )}
      </div>

      {/* Confidentiality notice */}
      <div className="text-caption text-text-secondary/60 mb-6 flex gap-2 items-start">
        <svg className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-accent-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        Your information is kept strictly confidential and is never shared with third parties.
      </div>

      {serverError && (
        <div className="bg-state-error/10 border border-state-error/30 rounded-lg p-4 mb-4 text-sm text-state-error">
          {serverError}
        </div>
      )}

      {/* Submit */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="text-eyebrow text-text-secondary">Consultation Fee</p>
          <p className="text-h3 text-accent-gold font-serif">
            {selectedService ? `₹${selectedService.price.toLocaleString("en-IN")}` : "---"}
            {selectedService && (
              <span className="text-sm font-sans text-text-secondary font-normal ml-1">
                / {selectedService.duration} min
              </span>
            )}
          </p>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Processing…
            </>
          ) : (
            "Continue to Payment →"
          )}
        </button>
      </div>
    </form>
  );
}

// ─── Payment step (Step 2) ────────────────────────────────────────────────────
function PaymentStep({
  appointmentId,
  servicePrice,
  serviceName,
  referenceNumber,
  onSuccess,
}: {
  appointmentId: string;
  servicePrice: number;
  serviceName: string;
  referenceNumber: string;
  onSuccess: () => void;
}) {
  const [gateway, setGateway] = useState<Gateway>("razorpay");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  const handleRazorpay = async () => {
    setIsProcessing(true);
    setError("");
    try {
      const res = await fetch(`${siteSettings.BACKEND_URL}/api/payments/razorpay/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message ?? "Failed to create order");

      const { orderId, amount, keyId, clientName, clientEmail, clientPhone, description } = json.data;

      // Load Razorpay script
      await loadScript("https://checkout.razorpay.com/v1/checkout.js");

      const options = {
        key: keyId,
        amount: amount * 100, // paise
        currency: "INR",
        name: siteSettings.firmName,
        description,
        order_id: orderId,
        prefill: { name: clientName, email: clientEmail, contact: clientPhone },
        theme: { color: "#5A1824" },
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          // Verify payment on backend
          const verifyRes = await fetch(
            `${siteSettings.BACKEND_URL}/api/payments/razorpay/verify`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                appointmentId,
              }),
            }
          );
          if (verifyRes.ok) {
            onSuccess();
          } else {
            setError("Payment verification failed. Please contact support.");
          }
        },
        modal: { ondismiss: () => setIsProcessing(false) },
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Payment failed");
      setIsProcessing(false);
    }
  };

  const handlePhonePe = async () => {
    setIsProcessing(true);
    setError("");
    try {
      const res = await fetch(`${siteSettings.BACKEND_URL}/api/payments/phonepe/initiate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message ?? "Failed to initiate PhonePe payment");

      // Redirect to PhonePe payment page
      window.location.href = json.data.redirectUrl;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Payment failed");
      setIsProcessing(false);
    }
  };

  const handlePay = () => {
    if (gateway === "razorpay") handleRazorpay();
    else handlePhonePe();
  };

  return (
    <div>
      {/* Summary */}
      <div className="bg-bg-secondary border border-border-subtle rounded-xl p-6 mb-8">
        <p className="text-eyebrow text-text-secondary mb-3">Booking Summary</p>
        <div className="flex items-start justify-between">
          <div>
            <p className="font-medium text-text-primary">{serviceName}</p>
            <p className="text-caption text-text-secondary mt-1">Ref: {referenceNumber}</p>
          </div>
          <p className="text-h3 font-serif text-accent-gold">
            ₹{servicePrice.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* Gateway choice */}
      <div className="mb-8">
        <p className="text-eyebrow text-text-primary mb-4">Choose Payment Method</p>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setGateway("razorpay")}
            className={`p-5 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-3 ${
              gateway === "razorpay"
                ? "border-accent-wine bg-accent-wine/5"
                : "border-border-subtle hover:border-border-subtle/80"
            }`}
            aria-pressed={gateway === "razorpay"}
          >
            {/* Razorpay logo */}
            <svg viewBox="0 0 100 32" className="h-7 w-auto" fill="none">
              <text x="0" y="24" fontFamily="Arial" fontWeight="700" fontSize="22" fill={gateway === "razorpay" ? "#5A1824" : "#171717"}>
                Razorpay
              </text>
            </svg>
            <span className={`text-caption ${gateway === "razorpay" ? "text-accent-wine font-medium" : "text-text-secondary"}`}>
              UPI · Cards · Netbanking
            </span>
          </button>

          <button
            type="button"
            onClick={() => setGateway("phonepe")}
            className={`p-5 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-3 ${
              gateway === "phonepe"
                ? "border-accent-wine bg-accent-wine/5"
                : "border-border-subtle hover:border-border-subtle/80"
            }`}
            aria-pressed={gateway === "phonepe"}
          >
            {/* PhonePe text */}
            <svg viewBox="0 0 100 32" className="h-7 w-auto" fill="none">
              <text x="0" y="24" fontFamily="Arial" fontWeight="700" fontSize="22" fill={gateway === "phonepe" ? "#5A1824" : "#171717"}>
                PhonePe
              </text>
            </svg>
            <span className={`text-caption ${gateway === "phonepe" ? "text-accent-wine font-medium" : "text-text-secondary"}`}>
              UPI · PhonePe Wallet
            </span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-state-error/10 border border-state-error/30 rounded-lg p-4 mb-4 text-sm text-state-error">
          {error}
        </div>
      )}

      <button
        onClick={handlePay}
        disabled={isProcessing}
        className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed py-4 text-sm"
      >
        {isProcessing ? (
          <>
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Processing Payment…
          </>
        ) : (
          `Pay ₹${servicePrice.toLocaleString("en-IN")} via ${gateway === "razorpay" ? "Razorpay" : "PhonePe"}`
        )}
      </button>

      <p className="text-caption text-text-secondary/60 text-center mt-4">
        🔒 Payments are processed securely. Your card details are never stored on our servers.
      </p>
    </div>
  );
}

// ─── Success step (Step 3) ────────────────────────────────────────────────────
function SuccessStep({ referenceNumber }: { referenceNumber: string }) {
  return (
    <div className="text-center py-8">
      <div className="w-16 h-16 rounded-full bg-state-success/10 border-2 border-state-success flex items-center justify-center mx-auto mb-6">
        <svg className="w-8 h-8 text-state-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h2 className="text-h2 mb-3">
        Appointment <span className="italic">Confirmed</span>
      </h2>
      <p className="text-body text-text-secondary mb-6">
        Your payment was successful and your appointment has been confirmed.
        A confirmation email has been sent to you.
      </p>

      <div className="bg-bg-secondary border border-border-subtle rounded-xl p-6 inline-block mb-6">
        <p className="text-eyebrow text-accent-gold mb-1">Booking Reference</p>
        <p className="font-mono text-xl font-semibold text-text-primary">{referenceNumber}</p>
      </div>

      <p className="text-caption text-text-secondary/70 max-w-md mx-auto mb-8">
        I will contact you within <strong className="text-text-primary">one business day</strong> to
        confirm the appointment time. Please keep your phone and email accessible.
      </p>

      {/* WhatsApp link for quick follow-up */}
      <a
        href={`https://wa.me/${siteSettings.whatsapp}?text=${encodeURIComponent(`Hi, I just booked a consultation. My reference number is ${referenceNumber}.`)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-secondary mb-4 inline-flex items-center gap-2"
      >
        <svg className="w-4 h-4 text-state-success" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        Message on WhatsApp
      </a>

      <div className="mt-4">
        <Link href="/" className="btn btn-ghost">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}

// ─── Script loader utility ────────────────────────────────────────────────────
function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.body.appendChild(script);
  });
}

// ─── Page wrapper ─────────────────────────────────────────────────────────────
function ConsultationPageInner() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [appointmentData, setAppointmentData] = useState<{
    appointmentId: string;
    servicePrice: number;
    serviceName: string;
    referenceNumber: string;
  } | null>(null);

  const handleFormSuccess = (data: typeof appointmentData) => {
    setAppointmentData(data);
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePaymentSuccess = () => {
    setStep(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Hero */}
      <section
        className="pt-32 pb-10 lg:pt-36 lg:pb-14 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0d1b35 0%, #172B54 100%)" }}
      >
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, #C9A84C 1px, transparent 0)", backgroundSize: "40px 40px" }} aria-hidden="true" />
        <div className="container relative z-10">
          <p className="text-eyebrow mb-3" style={{ color: "#C9A84C" }}>
            Book a Consultation
          </p>
          <h1 className="text-hero" style={{ color: "#F7F4EE" }}>
            Schedule Your <span className="italic" style={{ color: "#C9A84C" }}>Consultation</span>
          </h1>
          <p className="text-body mt-4" style={{ color: "rgba(247,244,238,0.6)", maxWidth: "480px" }}>
            Select a service, share your details, and complete a secure payment to confirm your appointment.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="py-14 lg:py-20">
        <div className="container max-w-3xl">
          <StepIndicator currentStep={step} />

          {step === 1 && <ConsultationForm onSubmitSuccess={handleFormSuccess} />}

          {step === 2 && appointmentData && (
            <PaymentStep
              appointmentId={appointmentData.appointmentId}
              servicePrice={appointmentData.servicePrice}
              serviceName={appointmentData.serviceName}
              referenceNumber={appointmentData.referenceNumber}
              onSuccess={handlePaymentSuccess}
            />
          )}

          {step === 3 && appointmentData && (
            <SuccessStep referenceNumber={appointmentData.referenceNumber} />
          )}
        </div>
      </section>

      {/* Trust bar */}
      {step !== 3 && (
        <section className="pb-16">
          <div className="container max-w-3xl">
            <div className="grid grid-cols-3 gap-4 border-t border-border-subtle pt-10">
              {[
                { icon: "🔒", label: "Secure Payment", sub: "256-bit SSL encrypted" },
                { icon: "🕐", label: "Quick Response", sub: "Within 1 business day" },
                { icon: "🤝", label: "Confidential", sub: "Strictly private" },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <p className="text-sm font-medium text-text-primary">{item.label}</p>
                  <p className="text-caption text-text-secondary">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

export default function ConsultationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-wine" /></div>}>
      <ConsultationPageInner />
    </Suspense>
  );
}
