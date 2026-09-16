export function trackEvent(event: string, payload: Record<string, unknown> = {}) {
  console.debug(`[tracking] ${event}`, payload);
  void fetch("/api/webhook/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event, payload }),
    keepalive: true,
  }).catch(() => {
    // Tracking must never interrupt a booking or form action.
  });
}

export function trackBookingClick(label: string, location: string) {
  trackEvent("booking_clicked", { label, location });
}