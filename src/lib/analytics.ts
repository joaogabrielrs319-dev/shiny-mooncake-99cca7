/**
 * Lightweight analytics layer.
 *
 * Pushes events to:
 *  - window.dataLayer (Google Tag Manager / GA4 compatible)
 *  - window.gtag (Google Analytics 4 direct)
 *  - window.fbq (Meta Pixel) when present
 *  - console (development)
 *
 * Tracking script tags can be added later in __root.tsx without changing
 * the call sites in the app.
 */

export type AnalyticsEvent =
  | "cta_click"
  | "form_start"
  | "form_submit_success"
  | "form_submit_error"
  | "whatsapp_redirect"
  | "lead_conversion";

export interface EventParams {
  [key: string]: string | number | boolean | undefined;
}

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export function track(event: AnalyticsEvent, params: EventParams = {}) {
  if (typeof window === "undefined") return;

  const payload = {
    event,
    timestamp: new Date().toISOString(),
    ...params,
  };

  // GTM / dataLayer
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);

  // GA4 direct
  if (typeof window.gtag === "function") {
    window.gtag("event", event, params);
  }

  // Meta Pixel — map conversions to standard events
  if (typeof window.fbq === "function") {
    if (event === "lead_conversion" || event === "form_submit_success") {
      window.fbq("track", "Lead", params);
    }
  }

  if (import.meta.env.DEV) {
    console.info("[analytics]", event, params);
  }
}

export const analytics = { track };
