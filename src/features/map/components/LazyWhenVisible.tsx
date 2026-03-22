"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  fallback: ReactNode;
  /** Նախապես բեռնել, երբ բաժինը մոտ է viewport-ին (px) */
  rootMargin?: string;
  className?: string;
};

/**
 * Ֆուտերի քարտեզի նման բեռնում — միայն scroll-ից հետո, առաջին paint-ը արագ է մնում։
 */
export function LazyWhenVisible({
  children,
  fallback,
  rootMargin = "280px",
  className,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible) {
      return;
    }
    const el = ref.current;
    if (!el) {
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
        }
      },
      { rootMargin, threshold: 0 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [visible, rootMargin]);

  return (
    <div ref={ref} className={className}>
      {visible ? children : fallback}
    </div>
  );
}
