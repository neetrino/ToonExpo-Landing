/**
 * Normalize Matterport / 3D tour URLs for iframe embed.
 * Matterport share links: https://my.matterport.com/show/?m=...
 */
export function isMatterportUrl(url: string): boolean {
  const u = url.trim().toLowerCase();
  return (
    u.includes("matterport.com") ||
    u.includes("mpembed.com") ||
    u.includes("my.matterport.com")
  );
}

export function toMatterportEmbedUrl(url: string): string {
  const u = url.trim();
  if (u.includes("mpembed.com")) return u;
  const m = u.match(/[?&]m=([^&]+)/);
  if (m) {
    return `https://mpembed.com/show/?m=${m[1]}&amp;qp=1&amp;q=0.5`;
  }
  return u;
}

const YOUTUBE_REGEX = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
const VIMEO_REGEX = /vimeo\.com\/(?:video\/)?(\d+)/;

export function parseYouTubeId(url: string): string | null {
  const m = url.trim().match(YOUTUBE_REGEX);
  return m ? m[1] : null;
}

export function parseVimeoId(url: string): string | null {
  const m = url.trim().match(VIMEO_REGEX);
  return m ? m[1] : null;
}

export function isVideoUrl(url: string): boolean {
  return Boolean(parseYouTubeId(url) || parseVimeoId(url));
}
