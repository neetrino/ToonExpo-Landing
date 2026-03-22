"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { GalleryLightbox } from "@/features/landing/GalleryLightbox";
import { HY_UI } from "@/shared/i18n/hyUi.constants";

type GalleryItem = {
  label: string;
  image: string;
};

type Props = {
  items: GalleryItem[];
  leftArrowSrc: string;
  rightArrowSrc: string;
  /** Լայթբոքսում alt-ի հիմք (նախագծի անուն) */
  imageAltBase: string;
};

function getVisibleItems(items: GalleryItem[], startIndex: number): GalleryItem[] {
  if (items.length === 0) {
    return [];
  }

  return Array.from({ length: Math.min(3, items.length) }, (_, offset) => {
    return items[(startIndex + offset) % items.length];
  });
}

/** Галерея проекта с рабочими стрелками и ротацией изображений. */
export function GalleryShowcase({ items, leftArrowSrc, rightArrowSrc, imageAltBase }: Props) {
  const [startIndex, setStartIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (items.length === 0) {
    return null;
  }

  const visibleItems = getVisibleItems(items, startIndex);
  const [mainItem, secondItem, thirdItem] = visibleItems;
  const hasControls = items.length > 1;

  const showPrev = () => {
    setStartIndex((current) => (current === 0 ? items.length - 1 : current - 1));
  };

  const showNext = () => {
    setStartIndex((current) => (current + 1) % items.length);
  };

  const openLightboxAt = (offset: number) => {
    setLightboxIndex((startIndex + offset) % items.length);
  };

  const galleryUrls = items.map((item) => item.image);

  return (
    <div className="w-full">
      <div className="relative">
        <div className="grid gap-2 lg:grid-cols-[1fr_400px_400px] lg:gap-3">
          {mainItem ? (
            <button
              type="button"
              onClick={() => openLightboxAt(0)}
              className="relative h-[320px] w-full cursor-zoom-in overflow-hidden p-0 text-left lg:h-[580px]"
            >
              <img
                src={mainItem.image}
                alt={mainItem.label.trim() ? mainItem.label : `${imageAltBase}`}
                className="h-full w-full object-cover object-center"
              />
              <div className="pointer-events-none absolute inset-0 bg-black/35" />
              <div className="pointer-events-none absolute bottom-6 left-5 text-white lg:left-[140px]">
                <h2 className="text-[clamp(1.7rem,2.4vw,2.15rem)] font-semibold uppercase">{HY_UI.SECTION_GALLERY}</h2>
                {mainItem.label.trim() ? (
                  <p className="mt-2 text-[clamp(1.05rem,1.5vw,1.7rem)]">{mainItem.label}</p>
                ) : null}
              </div>
            </button>
          ) : null}

          {secondItem ? (
            <button
              type="button"
              onClick={() => openLightboxAt(1)}
              className="relative h-[220px] w-full cursor-zoom-in overflow-hidden p-0 text-left lg:h-[580px]"
            >
              <img
                src={secondItem.image}
                alt={secondItem.label.trim() ? secondItem.label : `${imageAltBase}`}
                className="h-full w-full object-cover object-center"
              />
              <div className="pointer-events-none absolute inset-0 bg-black/15" />
              {secondItem.label.trim() ? (
                <p className="pointer-events-none absolute bottom-5 left-5 text-xl text-white lg:text-2xl">{secondItem.label}</p>
              ) : null}
            </button>
          ) : null}

          {thirdItem ? (
            <button
              type="button"
              onClick={() => openLightboxAt(2)}
              className="relative h-[220px] w-full cursor-zoom-in overflow-hidden p-0 text-left lg:h-[580px]"
            >
              <img
                src={thirdItem.image}
                alt={thirdItem.label.trim() ? thirdItem.label : `${imageAltBase}`}
                className="h-full w-full object-cover object-center"
              />
              <div className="pointer-events-none absolute inset-0 bg-black/18" />
              {thirdItem.label.trim() ? (
                <p className="pointer-events-none absolute bottom-5 left-5 max-w-[220px] text-xl text-white lg:text-2xl">
                  {thirdItem.label}
                </p>
              ) : null}
            </button>
          ) : null}
        </div>

        {hasControls ? (
          <>
            <button
              type="button"
              onClick={showPrev}
              aria-label={HY_UI.ARIA_PREV_GALLERY}
              className="absolute left-4 top-1/2 z-10 hidden -translate-y-1/2 transition hover:scale-110 lg:block"
            >
              <img src={leftArrowSrc} alt="" className="h-[56px] w-[22px] rotate-180" />
            </button>
            <button
              type="button"
              onClick={showNext}
              aria-label={HY_UI.ARIA_NEXT_GALLERY}
              className="absolute left-[calc(100%-400px-400px-1.5rem-2.5rem)] top-1/2 z-10 hidden -translate-y-1/2 transition hover:scale-110 lg:block"
            >
              <img src={rightArrowSrc} alt="" className="h-[56px] w-[22px]" />
            </button>
          </>
        ) : null}
      </div>

      <GalleryLightbox
        images={galleryUrls}
        isOpen={lightboxIndex !== null}
        initialIndex={lightboxIndex ?? 0}
        onClose={() => setLightboxIndex(null)}
        imageAltBase={imageAltBase}
      />
    </div>
  );
}
