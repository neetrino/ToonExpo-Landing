"use client";

import { useEffect, useRef } from "react";
import { RemoteAwareImage } from "@/shared/components/RemoteAwareImage";
import { HY_UI } from "@/shared/i18n/hyUi.constants";

const GALLERY_FILMSTRIP_SIZES = "56px";

type Props = {
  images: string[];
  targetIndex: number;
  onSelectIndex: (index: number) => void;
  imageAltBase: string;
};

/**
 * Լայթբոքսի ներքևի հորիզոնական մանրապատկերներ՝ ակտիվ սլայդի scroll-ով։
 */
export function GalleryLightboxFilmstrip({ images, targetIndex, onSelectIndex, imageAltBase }: Props) {
  const activeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [targetIndex]);

  if (images.length <= 1) {
    return null;
  }

  const safeTarget = Math.min(Math.max(0, targetIndex), images.length - 1);

  return (
    <nav
      aria-label={HY_UI.ARIA_GALLERY_THUMBS}
      className="flex max-h-[88px] shrink-0 gap-2 overflow-x-auto overflow-y-hidden px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-1"
    >
      {images.map((url, index) => {
        const isActive = index === safeTarget;
        return (
          <button
            key={`${index}-${url.slice(0, 48)}`}
            ref={isActive ? activeRef : undefined}
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onSelectIndex(index);
            }}
            aria-current={isActive ? "true" : undefined}
            aria-label={`${imageAltBase} — ${index + 1}`}
            className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition ${
              isActive ? "border-white ring-2 ring-white/35" : "border-white/20 opacity-80 hover:opacity-100"
            }`}
          >
            <RemoteAwareImage
              src={url}
              alt=""
              fill
              sizes={GALLERY_FILMSTRIP_SIZES}
              className="object-cover"
            />
          </button>
        );
      })}
    </nav>
  );
}
