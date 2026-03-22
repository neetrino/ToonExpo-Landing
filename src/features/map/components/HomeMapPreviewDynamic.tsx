"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";
import type { HomeMapPreview } from "./HomeMapPreview";

type HomeMapPreviewProps = ComponentProps<typeof HomeMapPreview>;

function HomeMapChunkSkeleton() {
  return (
    <div
      className="h-full w-full min-h-[200px] rounded-xl bg-[#1d5662]/40 animate-pulse"
      aria-hidden
    />
  );
}

/**
 * MapLibre-ը առանձին chunk — գլխավոր bundle-ը չի ծանրացնում, մինչև քարտեզը պետք է։
 */
export const HomeMapPreviewDynamic = dynamic<HomeMapPreviewProps>(
  () => import("./HomeMapPreview").then((mod) => mod.HomeMapPreview),
  { ssr: false, loading: HomeMapChunkSkeleton },
);
