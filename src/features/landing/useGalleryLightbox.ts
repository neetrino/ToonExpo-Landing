"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { GALLERY_LIGHTBOX_SWIPE_MIN_PX } from "@/features/landing/galleryLightbox.constants";
import { prefetchGalleryImageUrl } from "@/features/landing/galleryLightbox.parts";

const GALLERY_LIGHTBOX_LOAD_ID_INITIAL = 0;

type Params = {
  images: string[];
  isOpen: boolean;
  initialIndex: number;
  onClose: () => void;
};

/**
 * Լայթբոքսի ինդեքսներ, նախաբեռնում և սվայփ։
 */
export function useGalleryLightbox({ images, isOpen, initialIndex, onClose }: Params) {
  const [targetIndex, setTargetIndex] = useState(initialIndex);
  const [visibleIndex, setVisibleIndex] = useState(initialIndex);
  const [isBusy, setIsBusy] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const visibleIndexRef = useRef(initialIndex);
  const loadIdRef = useRef(GALLERY_LIGHTBOX_LOAD_ID_INITIAL);

  useEffect(() => {
    visibleIndexRef.current = visibleIndex;
  }, [visibleIndex]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    setTargetIndex(initialIndex);
    setVisibleIndex(initialIndex);
    visibleIndexRef.current = initialIndex;
    setIsBusy(false);
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

  useEffect(() => {
    if (!isOpen || images.length < 2) {
      return;
    }
    const safe = Math.min(Math.max(0, initialIndex), images.length - 1);
    const prevIdx = safe === 0 ? images.length - 1 : safe - 1;
    const nextIdx = (safe + 1) % images.length;
    prefetchGalleryImageUrl(images[prevIdx]);
    prefetchGalleryImageUrl(images[nextIdx]);
  }, [isOpen, initialIndex, images]);

  const goPrev = useCallback(() => {
    if (images.length <= 1) {
      return;
    }
    setTargetIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  }, [images.length]);

  const goNext = useCallback(() => {
    if (images.length <= 1) {
      return;
    }
    setTargetIndex((i) => (i + 1) % images.length);
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

  useEffect(() => {
    if (!isOpen || images.length === 0) {
      return;
    }

    const want = Math.min(Math.max(0, targetIndex), images.length - 1);
    if (want === visibleIndexRef.current) {
      setIsBusy(false);
      return;
    }

    const url = images[want];
    if (!url) {
      return;
    }

    const token = ++loadIdRef.current;
    setIsBusy(true);

    const img = new window.Image();
    img.onload = () => {
      if (loadIdRef.current !== token) {
        return;
      }
      const applyVisible = () => {
        if (loadIdRef.current !== token) {
          return;
        }
        visibleIndexRef.current = want;
        setVisibleIndex(want);
        setIsBusy(false);
      };
      if (typeof img.decode === "function") {
        void img.decode().then(applyVisible, applyVisible);
        return;
      }
      applyVisible();
    };
    img.onerror = () => {
      if (loadIdRef.current !== token) {
        return;
      }
      setIsBusy(false);
      setTargetIndex(visibleIndexRef.current);
    };
    img.src = url;
  }, [isOpen, targetIndex, images]);

  useEffect(() => {
    if (!isOpen || images.length < 2) {
      return;
    }
    const safe = Math.min(Math.max(0, visibleIndex), images.length - 1);
    const nextIdx = (safe + 1) % images.length;
    const prevIdx = safe === 0 ? images.length - 1 : safe - 1;
    prefetchGalleryImageUrl(images[nextIdx]);
    prefetchGalleryImageUrl(images[prevIdx]);
  }, [isOpen, visibleIndex, images]);

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

  const safeTarget = Math.min(Math.max(0, targetIndex), Math.max(0, images.length - 1));
  const safeVisible = Math.min(Math.max(0, visibleIndex), Math.max(0, images.length - 1));
  const displaySrc = images[safeVisible] ?? "";

  return {
    targetIndex,
    setTargetIndex,
    isBusy,
    safeTarget,
    safeVisible,
    displaySrc,
    goPrev,
    goNext,
    onTouchStart,
    onTouchEnd,
  };
}
