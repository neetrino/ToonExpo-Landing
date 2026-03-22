"use client";

import { createPortal } from "react-dom";
import { GalleryLightboxFilmstrip } from "@/features/landing/GalleryLightboxFilmstrip";
import { GALLERY_LIGHTBOX_Z_INDEX_CLASS } from "@/features/landing/galleryLightbox.constants";
import {
  GalleryChevron,
  GalleryIndeterminateProgress,
  GallerySpinner,
} from "@/features/landing/galleryLightbox.parts";
import { useGalleryLightbox } from "@/features/landing/useGalleryLightbox";
import { RemoteAwareImage } from "@/shared/components/RemoteAwareImage";
import { HY_UI } from "@/shared/i18n/hyUi.constants";

const GALLERY_LIGHTBOX_MAIN_SIZES = "100vw";

type Props = {
  images: string[];
  isOpen: boolean;
  initialIndex: number;
  onClose: () => void;
  /** Մեկ պատկերի alt, օրինակ նախագծի անուն */
  imageAltBase: string;
};

/**
 * Լիաէկրանային պատկերասրահ՝ սլայդեր, սվայփ, ստեղնաշար, մարմնի սքրոլի արգելում։
 * Նպատակային ինդեքսը (target) կարող է առաջ անցնել տեսանելիից՝ բեռնման ժամանակ մնալով նախորդ պատկերը։
 */
export function GalleryLightbox({ images, isOpen, initialIndex, onClose, imageAltBase }: Props) {
  const {
    setTargetIndex,
    isBusy,
    safeTarget,
    safeVisible,
    displaySrc,
    goPrev,
    goNext,
    onTouchStart,
    onTouchEnd,
  } = useGalleryLightbox({ images, isOpen, initialIndex, onClose });

  if (!isOpen || images.length === 0) {
    return null;
  }

  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div
      className={`fixed inset-0 ${GALLERY_LIGHTBOX_Z_INDEX_CLASS} flex flex-col bg-black/92 backdrop-blur-[2px]`}
      role="dialog"
      aria-modal="true"
      aria-busy={isBusy}
      aria-label={HY_UI.ARIA_GALLERY_FULLSCREEN}
      onClick={onClose}
    >
      <div
        className="flex shrink-0 flex-col pt-[max(0.75rem,env(safe-area-inset-top))]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between px-3 pb-2">
          <div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-1">
            <p className="text-sm font-medium tabular-nums text-white/80">
              {safeTarget + 1} / {images.length}
            </p>
            {isBusy ? (
              <span className="text-xs font-medium text-white/55">{HY_UI.GALLERY_IMAGE_LOADING}</span>
            ) : null}
          </div>
          <button
            type="button"
            aria-label={HY_UI.ARIA_CLOSE}
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/10 text-xl leading-none text-white transition hover:bg-white/18"
          >
            ×
          </button>
        </div>
        {isBusy ? <GalleryIndeterminateProgress /> : null}
      </div>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <div
          className="relative flex min-h-0 min-w-0 w-full flex-1 touch-pan-y items-center justify-center px-2"
          onClick={onClose}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div
            className="relative z-10 flex h-full min-h-0 w-full min-w-0 max-w-full flex-col items-center justify-center"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative h-[min(85vh,calc(100vh-7rem))] w-full min-w-0 max-w-full">
              <RemoteAwareImage
                src={displaySrc}
                alt={`${imageAltBase} — ${safeVisible + 1}`}
                fill
                sizes={GALLERY_LIGHTBOX_MAIN_SIZES}
                className={`object-contain object-center shadow-[0_8px_40px_rgba(0,0,0,0.45)] transition-opacity duration-200 ${
                  isBusy ? "opacity-[0.42]" : "opacity-100"
                }`}
                placeholder="empty"
                priority
              />
            </div>

            {isBusy ? (
              <div
                className="pointer-events-none absolute inset-0 flex items-center justify-center"
                aria-hidden="true"
              >
                <GallerySpinner />
              </div>
            ) : null}

            {images.length > 1 ? (
              <>
                <button
                  type="button"
                  aria-label={HY_UI.ARIA_PREV_IMAGE}
                  onClick={(event) => {
                    event.stopPropagation();
                    goPrev();
                  }}
                  className="absolute left-1 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/45 text-white shadow-lg backdrop-blur-sm transition hover:bg-black/60 md:left-2 md:h-12 md:w-12"
                >
                  <GalleryChevron direction="left" />
                </button>
                <button
                  type="button"
                  aria-label={HY_UI.ARIA_NEXT_IMAGE}
                  onClick={(event) => {
                    event.stopPropagation();
                    goNext();
                  }}
                  className="absolute right-1 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/45 text-white shadow-lg backdrop-blur-sm transition hover:bg-black/60 md:right-2 md:h-12 md:w-12"
                >
                  <GalleryChevron direction="right" />
                </button>
              </>
            ) : null}
          </div>
        </div>

        <div onClick={(event) => event.stopPropagation()}>
          <GalleryLightboxFilmstrip
            images={images}
            targetIndex={safeTarget}
            onSelectIndex={setTargetIndex}
            imageAltBase={imageAltBase}
          />
        </div>
      </div>
    </div>,
    document.body,
  );
}
