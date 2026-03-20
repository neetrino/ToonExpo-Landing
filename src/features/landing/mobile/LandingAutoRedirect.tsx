"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const MOBILE_BREAKPOINT_QUERY = "(max-width: 1024px)";

export function LandingAutoRedirect({ slug }: { slug: string }) {
  const router = useRouter();

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_BREAKPOINT_QUERY);

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
