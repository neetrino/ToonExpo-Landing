"use client";

import { usePathname } from "next/navigation";
import { BottomBarProvider } from "@/features/home/context/BottomBarContext";
import { HomeBottomBar } from "@/features/home/components/HomeBottomBar";

export function PublicLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const shouldShowBottomBar = !pathname.endsWith("/mobile");

  return (
    <BottomBarProvider>
      {children}
      {shouldShowBottomBar ? <HomeBottomBar /> : null}
    </BottomBarProvider>
  );
}
