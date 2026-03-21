"use client";

import type { ReactNode } from "react";
import { useScrolledPastThreshold } from "@/shared/hooks/useScrolledPastThreshold";

type Props = {
  children: ReactNode;
};

/**
 * Լենդինգ `/p/[slug]` — մինչև lg՝ թափանցիկ վերևում, սքրոլից հետո՝ կիսաթափանցիկ։
 * lg+՝ միշտ նույն ստեղծագործ ոճը։
 */
export function LandingStickyHeader({ children }: Props) {
  const scrolled = useScrolledPastThreshold(20);

  const mobileBar = scrolled
    ? "max-lg:border-white/15 max-lg:bg-black/72 max-lg:backdrop-blur"
    : "max-lg:border-transparent max-lg:bg-transparent max-lg:backdrop-blur-none";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b text-white transition-[background-color,backdrop-filter,border-color] duration-200 lg:border-white/15 lg:bg-black/72 lg:backdrop-blur ${mobileBar}`}
    >
      {children}
    </header>
  );
}
