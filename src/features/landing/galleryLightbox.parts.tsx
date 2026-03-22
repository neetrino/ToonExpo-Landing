/**
 * Օգնական կոմպոնեննտներ և նախաբեռնում՝ GalleryLightbox-ի համար։
 */

/**
 * Նախաբեռնում հարևան սլայդերը՝ cache-ում տաքացնելու համար։
 */
export function prefetchGalleryImageUrl(url: string): void {
  if (!url) {
    return;
  }
  const img = new Image();
  img.src = url;
}

/** Indeterminate բեռնման գիծ՝ globals.css-ում `@keyframes gallery-lightbox-indeterminate`։ */
export function GalleryIndeterminateProgress() {
  return (
    <div
      className="relative h-0.5 w-full shrink-0 overflow-hidden bg-white/12"
      role="progressbar"
      aria-valuetext="indeterminate"
      aria-hidden="true"
    >
      <div className="gallery-lightbox-indeterminate-bar absolute inset-y-0 left-0 w-[32%] rounded-full bg-white/75" />
    </div>
  );
}

export function GallerySpinner() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-white/20 bg-black/55 px-8 py-6 shadow-lg backdrop-blur-sm">
      <svg
        className="h-10 w-10 animate-spin text-white/90"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="3"
        />
        <path
          className="opacity-90"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
}

export function GalleryChevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-6 w-6 md:h-7 md:h-7"
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
