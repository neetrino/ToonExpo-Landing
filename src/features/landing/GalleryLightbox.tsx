"use client";

/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const GALLERY_LIGHTBOX_SWIPE_MIN_PX = 48;
const GALLERY_LIGHTBOX_Z_INDEX_CLASS = "z-[10003]";

type Props = {
  images: string[];
  isOpen: boolean;
  initialIndex: number;
  onClose: () => void;
  /** Մեկ պատկերի alt, օրինակ նախագծի անուն */
  imageAltBase: string;
};

/**
 * Լիաէկրանային պատկերասրահ՝ սլայդներ, սվայփ, ստեղնաշար, մարմնի սքրոլի արգելում։
 */
export function GalleryLightbox({ images, isOpen, initialIndex, onClose, imageAltBase }: Props) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    setActiveIndex(initialIndex);
  }, [isOpen, initialIndex]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  const goPrev = useCallback(() => {
    if (images.length <= 1) {
      return;
    }
    setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  }, [images.length]);

  const goNext = useCallback(() => {
    if (images.length <= 1) {
      return;
    }
    setActiveIndex((i) => (i + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrev();
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, goNext, goPrev, onClose]);

  const onTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const onTouchEnd = (event: React.TouchEvent) => {
    if (touchStartX.current === null) {
      return;
    }
    const endX = event.changedTouches[0].clientX;
    const delta = endX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < GALLERY_LIGHTBOX_SWIPE_MIN_PX) {
      return;
    }
    if (delta > 0) {
      goPrev();
    } else {
      goNext();
    }
  };

  if (!isOpen || images.length === 0 || typeof document === "undefined") {
    return null;
  }

  const safeIndex = Math.min(Math.max(0, activeIndex), images.length - 1);
  const src = images[safeIndex];

  return createPortal(
    <div
      className={`fixed inset-0 ${GALLERY_LIGHTBOX_Z_INDEX_CLASS} flex flex-col bg-black/92 backdrop-blur-[2px]`}
      role="dialog"
      aria-modal="true"
      aria-label="Gallery fullscreen"
      onClick={onClose}
    >
      <div
        className="flex shrink-0 items-center justify-between px-3 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="text-sm font-medium tabular-nums text-white/80">
          {safeIndex + 1} / {images.length}
        </p>
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/10 text-xl leading-none text-white transition hover:bg-white/18"
        >
          ×
        </button>
      </div>

      <div
        className="relative flex min-h-0 flex-1 touch-pan-y items-center justify-center px-2 pb-[max(1rem,env(safe-area-inset-bottom))]"
        onClick={onClose}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="relative flex max-h-full max-w-full items-center justify-center" onClick={(event) => event.stopPropagation()}>
          <img
            src={src}
            alt={`${imageAltBase} — ${safeIndex + 1}`}
            className="max-h-[min(85vh,calc(100vh-7rem))] max-w-full object-contain object-center shadow-[0_8px_40px_rgba(0,0,0,0.45)]"
          />

          {images.length > 1 ? (
            <>
              <button
                type="button"
                aria-label="Previous image"
                onClick={(event) => {
                  event.stopPropagation();
                  goPrev();
                }}
                className="absolute -left-1 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/45 text-white shadow-lg backdrop-blur-sm transition hover:bg-black/60 md:-left-2 md:h-12 md:w-12"
              >
                <GalleryChevron direction="left" />
              </button>
              <button
                type="button"
                aria-label="Next image"
                onClick={(event) => {
                  event.stopPropagation();
                  goNext();
                }}
                className="absolute -right-1 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/45 text-white shadow-lg backdrop-blur-sm transition hover:bg-black/60 md:-right-2 md:h-12 md:w-12"
              >
                <GalleryChevron direction="right" />
              </button>
            </>
          ) : null}
        </div>
      </div>
    </div>,
    document.body,
  );
}

function GalleryChevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-6 w-6 md:h-7 md:w-7"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {direction === "left" ? (
        <path d="M15 18l-6-6 6-6" />
      ) : (
        <path d="M9 18l6-6-6-6" />
      )}
    </svg>
  );
}
