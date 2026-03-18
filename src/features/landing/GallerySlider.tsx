"use client";

import Image from "next/image";
import { useState } from "react";

type Props = { urls: string[] };

export function GallerySlider({ urls }: Props) {
  const [index, setIndex] = useState(0);
  if (urls.length === 0) return null;
  const prev = () => setIndex((i) => (i <= 0 ? urls.length - 1 : i - 1));
  const next = () => setIndex((i) => (i >= urls.length - 1 ? 0 : i + 1));

  return (
    <div className="relative w-full">
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-slate-200">
        <Image
          src={urls[index]}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 1024px"
          priority={index === 0}
        />
        {urls.length > 1 ? (
          <>
            <button
              type="button"
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/70"
              aria-label="Նախորդ"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
              </svg>
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/70"
              aria-label="Հաջորդ"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
              </svg>
            </button>
            <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
              {urls.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  className={`h-2 rounded-full transition ${
                    i === index ? "w-6 bg-white" : "w-2 bg-white/60 hover:bg-white/80"
                  }`}
                  aria-label={`Սլայդ ${i + 1}`}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
