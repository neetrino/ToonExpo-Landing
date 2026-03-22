"use client";

import { createPortal } from "react-dom";
import { HomeMapPreviewDynamic } from "@/features/map/components/HomeMapPreviewDynamic";
import type { MapMarker } from "@/features/map/components/HomeMapPreview";

type Props = {
  open: boolean;
  onClose: () => void;
  markers: MapMarker[];
  title: string;
};

/**
 * Լենդինգի մասնակցի լրիվ էկրանային քարտեզ (մեկ նախագիծ), նույն UX-ը, ինչ գլխավորում։
 */
export function LandingMapFullscreenOverlay({ open, onClose, markers, title }: Props) {
  if (!open || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/80"
      role="dialog"
      aria-modal="true"
      aria-label={`Карта: ${title}`}
      onClick={onClose}
    >
      <div
        className="toon-home-map relative flex h-[74vh] w-[88vw] flex-col overflow-hidden rounded-[26px] border border-[#246976] bg-black shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 bg-[#1d5662]/90 px-4 py-3 text-white">
          <p className="min-w-0 truncate text-sm font-semibold uppercase tracking-wide sm:text-base">{title}</p>
          <button
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/40 bg-white text-slate-600 transition hover:bg-slate-50"
            aria-label="Закрыть карту"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="relative min-h-0 flex-1">
          <HomeMapPreviewDynamic key="landing-fullscreen-map" markers={markers} className="h-full w-full" />
        </div>
      </div>
    </div>,
    document.body,
  );
}
