export type IncompleteCheckoutReason = "CANCELLED" | "FAILED";

// A failed attempt can be retried inside the same popup. Alert only when that popup closes.
export function checkoutOutcomeTracker(report: (reason: IncompleteCheckoutReason) => Promise<void>) {
  let succeeded = false;
  let failed = false;
  let dismissed = false;
  return {
    onSuccess() { succeeded = true; },
    onFailure() { failed = true; },
    onDismiss() {
      if (succeeded || dismissed) return;
      dismissed = true;
      void report(failed ? "FAILED" : "CANCELLED").catch(() => {
        // Reporting an unfinished checkout must never prevent a payment retry.
        console.error("Unable to report unfinished checkout.");
      });
    },
  };
}
