"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useBottomBarCallbacks } from "@/features/home/context/BottomBarContext";
import { buildMapMarkersFromProjects } from "@/features/home/buildMapMarkers";
import type { HomeProject } from "@/features/home/homeProject.types";
import { LandingMapFullscreenOverlay } from "@/features/landing/components/LandingMapFullscreenOverlay";

function projectTitle(f: Record<string, string>): string {
  return f.expo_field_02?.trim() || f.expo_field_01?.trim() || "—";
}

type Props = {
  children: React.ReactNode;
  project: HomeProject;
};

/**
 * Լենդինգի ստորին բար — «Քարտեզ»-ը բացում է լրիվ էկրան, միայն այս նախագծի մարկերով։
 */
export function LandingBottomBarCallbacks({ children, project }: Props) {
  const { setCallbacks } = useBottomBarCallbacks();
  const router = useRouter();
  const [isMapOpen, setIsMapOpen] = useState(false);

  const markers = useMemo(() => buildMapMarkersFromProjects([project]), [project]);
  const title = useMemo(() => projectTitle(project.expoFields), [project.expoFields]);

  const closeMap = useCallback(() => setIsMapOpen(false), []);

  useEffect(() => {
    if (!isMapOpen) {
      return;
    }
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMapOpen(false);
      }
    };
    document.addEventListener("keydown", onEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onEscape);
      document.body.style.overflow = "";
    };
  }, [isMapOpen]);

  useEffect(() => {
    const delay = (fn: () => void) => {
      setTimeout(fn, isMapOpen ? 200 : 0);
    };

    setCallbacks({
      onGoHome: () => {
        if (isMapOpen) setIsMapOpen(false);
        delay(() => router.push("/"));
      },
      onScrollToTop: () => {
        if (isMapOpen) setIsMapOpen(false);
        delay(() => window.scrollTo({ top: 0, behavior: "smooth" }));
      },
      onOpenSearch: () => {
        if (isMapOpen) setIsMapOpen(false);
        delay(() => router.push("/#search"));
      },
      onOpenMap: () => setIsMapOpen(true),
    });
    return () => setCallbacks(null);
  }, [isMapOpen, router, setCallbacks]);

  return (
    <>
      {children}
      <LandingMapFullscreenOverlay
        open={isMapOpen}
        onClose={closeMap}
        markers={markers}
        title={title}
      />
    </>
  );
}
