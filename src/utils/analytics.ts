declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
    wcs_add?: Record<string, string>;
    wcs?: { do: () => void };
  }
}

export function trackEvent(event: string, params?: Record<string, unknown>) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
}
