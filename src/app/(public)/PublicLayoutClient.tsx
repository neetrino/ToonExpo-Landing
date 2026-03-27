"use client";

import { BottomBarProvider } from "@/features/home/context/BottomBarContext";
import { HomeBottomBar } from "@/features/home/components/HomeBottomBar";
import { PublicPageViewTracker } from "@/app/(public)/PublicPageViewTracker";

export function PublicLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BottomBarProvider>
      <PublicPageViewTracker />
      {children}
      <HomeBottomBar />
    </BottomBarProvider>
  );
}
