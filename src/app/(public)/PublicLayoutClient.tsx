"use client";

import { BottomBarProvider } from "@/features/home/context/BottomBarContext";
import { HomeBottomBar } from "@/features/home/components/HomeBottomBar";

export function PublicLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BottomBarProvider>
      {children}
      <HomeBottomBar />
    </BottomBarProvider>
  );
}
