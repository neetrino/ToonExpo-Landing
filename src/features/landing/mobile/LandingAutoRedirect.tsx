"use client";

import { useLayoutEffect } from "react";
import { useRouter } from "next/navigation";
import { MOBILE_LANDING_BREAKPOINT_QUERY } from "@/shared/constants/viewport.constants";

export const MOBILE_BREAKPOINT_QUERY = MOBILE_LANDING_BREAKPOINT_QUERY;

const REPLACE_OPTS = { scroll: false } as const;

export function LandingAutoRedirect({ slug }: { slug: string }) {
  const router = useRouter();

  useLayoutEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_LANDING_BREAKPOINT_QUERY);

    const redirectToMobile = () => {
      if (!mediaQuery.matches) {
        return;
      }

      router.replace(`/p/${slug}/mobile`, REPLACE_OPTS);
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

  useLayoutEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_LANDING_BREAKPOINT_QUERY);

    const redirectToDesktop = () => {
      if (mediaQuery.matches) {
        return;
      }

      router.replace(`/p/${slug}`, REPLACE_OPTS);
    };

    redirectToDesktop();
    mediaQuery.addEventListener("change", redirectToDesktop);

    return () => {
      mediaQuery.removeEventListener("change", redirectToDesktop);
    };
  }, [router, slug]);

  return null;
}
