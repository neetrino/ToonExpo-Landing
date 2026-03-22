"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { MOBILE_LANDING_BREAKPOINT_QUERY } from "@/shared/constants/viewport.constants";

export const MOBILE_BREAKPOINT_QUERY = MOBILE_LANDING_BREAKPOINT_QUERY;

export function LandingAutoRedirect({ slug }: { slug: string }) {
  const router = useRouter();

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_LANDING_BREAKPOINT_QUERY);

    const redirectToMobile = () => {
      if (!mediaQuery.matches) {
        return;
      }

      router.replace(`/p/${slug}/mobile`);
    };

    redirectToMobile();
    mediaQuery.addEventListener("change", redirectToMobile);

    return () => {
      mediaQuery.removeEventListener("change", redirectToMobile);
    };
  }, [router, slug]);

  return null;
}

export function LandingDesktopRedirect({ slug }: { slug: string }) {
  const router = useRouter();

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_LANDING_BREAKPOINT_QUERY);

    const redirectToDesktop = () => {
      if (mediaQuery.matches) {
        return;
      }

      router.replace(`/p/${slug}`);
    };

    redirectToDesktop();
    mediaQuery.addEventListener("change", redirectToDesktop);

    return () => {
      mediaQuery.removeEventListener("change", redirectToDesktop);
    };
  }, [router, slug]);

  return null;
}
