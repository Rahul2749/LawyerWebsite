"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { practiceAreas } from "@/data/practiceAreas";

const consultationSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(7, "Please enter a valid phone number"),
  practiceArea: z.string().min(1, "Please select a practice area"),
  preferredDate: z.string().optional(),
  message: z.string().min(20, "Please provide more detail about your matter (at least 20 characters)"),
  disclaimerAccepted: z.literal(true, {
    errorMap: () => ({ message: "You must acknowledge this disclaimer" }),
  }),
  // Honeypot field — hidden from real users
  website: z.string().max(0).optional(),
});

type ConsultationFormData = z.infer<typeof consultationSchema>;

export default function ConsultationPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ConsultationFormData>({
    resolver: zodResolver(consultationSchema),
  });

  const onSubmit = async (data: ConsultationFormData) => {
    // Honeypot check
    if (data.website && data.website.length > 0) return;

    // Simulate submission (backend integration later)
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const ref = `AM-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    setReferenceNumber(ref);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <>
        <section className="pt-40 pb-32 lg:pt-48 min-h-screen flex items-center">
          <div className="container max-w-2xl text-center">
            <div className="w-16 h-16 border-2 border-state-success flex items-center justify-center mx-auto mb-8">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-state-success"
                aria-hidden="true"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h1 className="text-h2 mb-4">
              Consultation <span className="italic">Received</span>
            </h1>
            <p className="text-body text-text-secondary mb-4">
              Thank you for reaching out. Your consultation request has been
              submitted successfully.
            </p>
            <div className="bg-bg-secondary p-6 border border-border-subtle mb-8 inline-block">
              <p className="text-eyebrow text-accent-gold mb-2">
                Reference Number
              </p>
              <p className="font-mono text-lg font-medium">{referenceNumber}</p>
            </div>
            <p className="text-body text-text-secondary mb-8">
              I respond within <strong>one business day</strong>. Please save your
              reference number for your records.
            </p>
            <p className="text-caption text-text-secondary/60 max-w-lg mx-auto">
              Submitting this form does not create an attorney-client
              relationship. Please do not include highly sensitive or privileged
              information in your submission.
            </p>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="pt-40 pb-16 lg:pt-48 lg:pb-32 bg-bg-secondary relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=2000&auto=format&fit=crop"
            alt="Consultation background"
            className="w-full h-full object-cover opacity-10 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-secondary via-transparent to-transparent" />
        </div>
        <div className="container relative z-10 text-center lg:text-left">
          <p className="text-eyebrow text-accent-gold mb-4">Consultation</p>
          <h1 className="text-hero mx-auto lg:mx-0 max-w-3xl">
            Book a
            <br className="hidden sm:block" />
            <span className="italic"> Consultation</span>
          </h1>
          <p className="text-body text-text-secondary mt-6 mx-auto lg:mx-0 max-w-xl">
            Take the first step. Complete the form below to schedule a
            confidential consultation about your legal matter.
          </p>
          <p className="text-sm text-accent-wine mt-4 font-medium mx-auto lg:mx-0">
            I respond within one business day.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="section">
        <div className="container max-w-3xl">
          {/* Confidentiality Notice */}
          <div className="bg-bg-secondary border border-border-subtle p-6 mb-12">
            <p className="text-sm text-text-secondary leading-relaxed">
              <strong className="text-text-primary">
                Confidentiality Notice:
              </strong>{" "}
              While I take reasonable precautions to protect information
              submitted through this form, this channel is not a secure method
              for transmitting highly sensitive or privileged information.
              Please limit your submission to general details about your matter.
              Full particulars can be discussed during your consultation.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Honeypot — hidden from users */}
            <div className="absolute -left-[9999px]" aria-hidden="true">
              <label htmlFor="website">Website</label>
              <input
                type="text"
                id="website"
                tabIndex={-1}
                autoComplete="off"
                {...register("website")}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label
                  htmlFor="firstName"
                  className="text-eyebrow text-text-primary mb-2 block"
                >
                  First Name *
                </label>
                <input
                  id="firstName"
                  type="text"
                  className={`w-full px-4 py-3 bg-transparent border text-text-primary placeholder:text-text-secondary/40 focus:outline-none focus:border-accent-wine transition-colors ${
                    errors.firstName ? "border-state-error" : "border-border-subtle"
                  }`}
                  placeholder="Your first name"
                  aria-describedby={errors.firstName ? "firstName-error" : undefined}
                  {...register("firstName")}
                />
                {errors.firstName && (
                  <p
                    id="firstName-error"
                    className="text-xs text-state-error mt-1"
                    role="alert"
                  >
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label
                  htmlFor="lastName"
                  className="text-eyebrow text-text-primary mb-2 block"
                >
                  Last Name *
                </label>
                <input
                  id="lastName"
                  type="text"
                  className={`w-full px-4 py-3 bg-transparent border text-text-primary placeholder:text-text-secondary/40 focus:outline-none focus:border-accent-wine transition-colors ${
                    errors.lastName ? "border-state-error" : "border-border-subtle"
                  }`}
                  placeholder="Your last name"
                  aria-describedby={errors.lastName ? "lastName-error" : undefined}
                  {...register("lastName")}
                />
                {errors.lastName && (
                  <p id="lastName-error" className="text-xs text-state-error mt-1" role="alert">
                    {errors.lastName.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="text-eyebrow text-text-primary mb-2 block"
                >
                  Email *
                </label>
                <input
                  id="email"
                  type="email"
                  className={`w-full px-4 py-3 bg-transparent border text-text-primary placeholder:text-text-secondary/40 focus:outline-none focus:border-accent-wine transition-colors ${
                    errors.email ? "border-state-error" : "border-border-subtle"
                  }`}
                  placeholder="your@email.com"
                  aria-describedby={errors.email ? "email-error" : undefined}
                  {...register("email")}
                />
                {errors.email && (
                  <p id="email-error" className="text-xs text-state-error mt-1" role="alert">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="text-eyebrow text-text-primary mb-2 block"
                >
                  Phone *
                </label>
                <input
                  id="phone"
                  type="tel"
                  className={`w-full px-4 py-3 bg-transparent border text-text-primary placeholder:text-text-secondary/40 focus:outline-none focus:border-accent-wine transition-colors ${
                    errors.phone ? "border-state-error" : "border-border-subtle"
                  }`}
                  placeholder="+1 (555) 000-0000"
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                  {...register("phone")}
                />
                {errors.phone && (
                  <p id="phone-error" className="text-xs text-state-error mt-1" role="alert">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* Practice Area */}
              <div>
                <label
                  htmlFor="practiceArea"
                  className="text-eyebrow text-text-primary mb-2 block"
                >
                  Practice Area *
                </label>
                <select
                  id="practiceArea"
                  className={`w-full px-4 py-3 bg-transparent border text-text-primary focus:outline-none focus:border-accent-wine transition-colors appearance-none ${
                    errors.practiceArea ? "border-state-error" : "border-border-subtle"
                  }`}
                  aria-describedby={errors.practiceArea ? "practiceArea-error" : undefined}
                  {...register("practiceArea")}
                >
                  <option value="">Select a practice area</option>
                  {practiceAreas.map((area) => (
                    <option key={area.id} value={area.slug}>
                      {area.title}
                    </option>
                  ))}
                  <option value="other">Other</option>
                </select>
                {errors.practiceArea && (
                  <p id="practiceArea-error" className="text-xs text-state-error mt-1" role="alert">
                    {errors.practiceArea.message}
                  </p>
                )}
              </div>

              {/* Preferred Date */}
              <div>
                <label
                  htmlFor="preferredDate"
                  className="text-eyebrow text-text-primary mb-2 block"
                >
                  Preferred Date
                </label>
                <input
                  id="preferredDate"
                  type="date"
                  className="w-full px-4 py-3 bg-transparent border border-border-subtle text-text-primary focus:outline-none focus:border-accent-wine transition-colors"
                  {...register("preferredDate")}
                />
              </div>
            </div>

            {/* Message */}
            <div className="mt-6">
              <label
                htmlFor="message"
                className="text-eyebrow text-text-primary mb-2 block"
              >
                Brief Description of Your Matter *
              </label>
              <textarea
                id="message"
                rows={5}
                className={`w-full px-4 py-3 bg-transparent border text-text-primary placeholder:text-text-secondary/40 focus:outline-none focus:border-accent-wine transition-colors resize-none ${
                  errors.message ? "border-state-error" : "border-border-subtle"
                }`}
                placeholder="Please provide a brief overview of your legal matter..."
                aria-describedby={errors.message ? "message-error" : undefined}
                {...register("message")}
              />
              {errors.message && (
                <p id="message-error" className="text-xs text-state-error mt-1" role="alert">
                  {errors.message.message}
                </p>
              )}
            </div>

            {/* Disclaimer Checkbox */}
            <div className="mt-8 p-6 bg-bg-secondary border border-border-subtle">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-1 w-4 h-4 accent-accent-wine flex-shrink-0"
                  {...register("disclaimerAccepted")}
                />
                <span className="text-sm text-text-secondary leading-relaxed">
                  I understand that submitting this form does not create an
                  attorney-client relationship. I acknowledge that any
                  information submitted is not protected by attorney-client
                  privilege until an engagement is formally established. *
                </span>
              </label>
              {errors.disclaimerAccepted && (
                <p className="text-xs text-state-error mt-2" role="alert">
                  {errors.disclaimerAccepted.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <div className="mt-8">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Submitting...
                  </>
                ) : (
                  "Submit Consultation Request"
                )}
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
