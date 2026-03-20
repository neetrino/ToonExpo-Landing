import {
  parseYouTubeId,
  parseVimeoId,
} from "@/features/landing/mobile/lib/embedUrls";

type Props = {
  url: string;
  title?: string;
};

export function VideoEmbedBlock({ url, title }: Props) {
  const ytId = parseYouTubeId(url);
  const vimeoId = parseVimeoId(url);

  if (ytId) {
    return (
      <div className="relative w-full overflow-hidden rounded-xl bg-black">
        <span className="absolute left-3 top-3 z-10 rounded bg-[#ffd24d] px-2.5 py-1 text-xs font-bold uppercase text-slate-900">
          Video
        </span>
        <div className="relative aspect-video w-full">
          <iframe
            title={title ?? "YouTube"}
            src={`https://www.youtube.com/embed/${ytId}`}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    );
  }

  if (vimeoId) {
    return (
      <div className="relative w-full overflow-hidden rounded-xl bg-black">
        <span className="absolute left-3 top-3 z-10 rounded bg-[#ffd24d] px-2.5 py-1 text-xs font-bold uppercase text-slate-900">
          Video
        </span>
        <div className="relative aspect-video w-full">
          <iframe
            title={title ?? "Vimeo"}
            src={`https://player.vimeo.com/video/${vimeoId}`}
            className="absolute inset-0 h-full w-full"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <span className="mb-2 inline-block rounded bg-[#ffd24d] px-2.5 py-1 text-xs font-bold uppercase text-slate-900">
        Video
      </span>
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
