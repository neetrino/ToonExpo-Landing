"use client";

import { useState } from "react";
import {
  isMatterportUrl,
  toMatterportEmbedUrl,
} from "@/features/landing/lib/embedUrls";
import { HY_UI } from "@/shared/i18n/hyUi.constants";

type Props = {
  url: string;
  title: string;
};

export function Tour3DBlock({ url, title }: Props) {
  const [playing, setPlaying] = useState(false);
  const embeddable = isMatterportUrl(url);
  const embedUrl = embeddable ? toMatterportEmbedUrl(url) : url;

  if (embeddable) {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-900">
        <span className="absolute left-3 top-3 z-10 rounded bg-[#ffd24d] px-2.5 py-1 text-xs font-bold uppercase text-slate-900">
          {HY_UI.TOUR_3D_BADGE}
        </span>
        {!playing ? (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-slate-800/90">
            <p className="text-center text-lg font-semibold text-white">{title}</p>
            <button
              type="button"
              onClick={() => setPlaying(true)}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30"
              aria-label="Բացել 3D տուր"
            >
              <svg className="ml-1 h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
            <span className="text-sm text-white/80">{HY_UI.TOUR_3D_EXPLORE}</span>
          </div>
        ) : null}
        <iframe
          title={title}
          src={embedUrl}
          className="absolute inset-0 h-full w-full"
          allow="fullscreen; xr-spatial-tracking"
          allowFullScreen
        />
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-center text-xs text-white/70">
          POWERED BY Matterport
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <span className="mb-2 inline-block rounded bg-[#ffd24d] px-2.5 py-1 text-xs font-bold uppercase text-slate-900">
        3D
      </span>
      <p className="mb-2 font-medium text-slate-800">{title}</p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="break-all text-[#2eb0b4] underline"
      >
        {url}
      </a>
    </div>
  );
}
