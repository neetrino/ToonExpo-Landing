"use client";

import { useState } from "react";

type GalleryItem = {
  label: string;
  image: string;
};

type Props = {
  items: GalleryItem[];
  leftArrowSrc: string;
  rightArrowSrc: string;
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
export function GalleryShowcase({ items, leftArrowSrc, rightArrowSrc }: Props) {
  const [startIndex, setStartIndex] = useState(0);

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

  return (
    <div className="w-full">
      <div className="relative">
        <div className="grid gap-2 lg:grid-cols-[1fr_400px_400px] lg:gap-3">
          {mainItem ? (
            <div className="relative h-[320px] overflow-hidden lg:h-[580px]">
              <img src={mainItem.image} alt={mainItem.label} className="h-full w-full object-cover object-center" />
              <div className="absolute inset-0 bg-black/35" />
              <div className="absolute bottom-6 left-5 text-white lg:left-[140px]">
                <h2 className="text-[clamp(1.7rem,2.4vw,2.15rem)] font-semibold uppercase">Gallery</h2>
                <p className="mt-2 text-[clamp(1.05rem,1.5vw,1.7rem)]">{mainItem.label}</p>
              </div>
            </div>
          ) : null}

          {secondItem ? (
            <div className="relative h-[220px] overflow-hidden lg:h-[580px]">
              <img src={secondItem.image} alt={secondItem.label} className="h-full w-full object-cover object-center" />
              <div className="absolute inset-0 bg-black/15" />
              <p className="absolute bottom-5 left-5 text-xl text-white lg:text-2xl">{secondItem.label}</p>
            </div>
          ) : null}

          {thirdItem ? (
            <div className="relative h-[220px] overflow-hidden lg:h-[580px]">
              <img src={thirdItem.image} alt={thirdItem.label} className="h-full w-full object-cover object-center" />
              <div className="absolute inset-0 bg-black/18" />
              <p className="absolute bottom-5 left-5 max-w-[220px] text-xl text-white lg:text-2xl">{thirdItem.label}</p>
            </div>
          ) : null}
        </div>

        {hasControls ? (
          <>
            <button
              type="button"
              onClick={showPrev}
              aria-label="Previous gallery image"
              className="absolute left-4 top-1/2 z-10 hidden -translate-y-1/2 transition hover:scale-110 lg:block"
            >
              <img src={leftArrowSrc} alt="" className="h-[56px] w-[22px] rotate-180" />
            </button>
            <button
              type="button"
              onClick={showNext}
              aria-label="Next gallery image"
              className="absolute left-[calc(100%-400px-400px-1.5rem-2.5rem)] top-1/2 z-10 hidden -translate-y-1/2 transition hover:scale-110 lg:block"
            >
              <img src={rightArrowSrc} alt="" className="h-[56px] w-[22px]" />
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}
