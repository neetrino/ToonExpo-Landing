"use client";

import { useEffect, useState } from "react";

const DEFAULT_THRESHOLD_PX = 20;

/**
 * `true`, երբ `window.scrollY` մեծ է շեմից (մոբայլ sticky հեդերի համար)։
 */
export function useScrolledPastThreshold(thresholdPx: number = DEFAULT_THRESHOLD_PX): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > thresholdPx);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [thresholdPx]);

  return scrolled;
}
