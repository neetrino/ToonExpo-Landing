"use client";

type GtagCommand = "config" | "event" | "js";

type GtagParameters = Record<string, string | number | boolean | undefined>;

type ContactClickParams = {
  projectSlug: string;
  projectName: string;
  ctaType: "phone" | "instagram" | "facebook" | "website";
  placement: string;
};

type LandingViewParams = {
  projectSlug: string;
  projectName: string;
};

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (command: GtagCommand, target: string | Date, params?: GtagParameters) => void;
  }
}

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ?? "";

function sendGtag(command: GtagCommand, target: string | Date, params?: GtagParameters): void {
  if (!GA_MEASUREMENT_ID || typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }
  window.gtag(command, target, params);
}

export function trackPageView(pagePath: string): void {
  sendGtag("config", GA_MEASUREMENT_ID, { page_path: pagePath });
}

export function trackLandingView({ projectSlug, projectName }: LandingViewParams): void {
  sendGtag("event", "landing_view", {
    project_slug: projectSlug,
    project_name: projectName,
  });
}

export function trackContactClick({
  projectSlug,
  projectName,
  ctaType,
  placement,
}: ContactClickParams): void {
  sendGtag("event", "contact_click", {
    project_slug: projectSlug,
    project_name: projectName,
    cta_type: ctaType,
    placement,
  });
}
