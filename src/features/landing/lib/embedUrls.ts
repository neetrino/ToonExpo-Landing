/**
 * Normalize Matterport / 3D tour URLs for iframe embed.
 * Matterport share links: https://my.matterport.com/show/?m=...
 */

const MATTERPORT_ROOT = "matterport.com";
const MPEMBED_ROOT = "mpembed.com";
const HAS_URL_SCHEME = /^[a-zA-Z][a-zA-Z0-9+.-]*:/;

/**
 * Վերադարձնում է hostname-ը (lowercase) կամ null, եթե parse-ը ձախողվի։
 */
function parseUrlHostname(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) {
    return null;
  }
  try {
    const toParse = HAS_URL_SCHEME.test(trimmed) ? trimmed : `https://${trimmed}`;
    return new URL(toParse).hostname.toLowerCase();
  } catch {
    return null;
  }
}

function isAllowedMatterportHostname(hostname: string): boolean {
  return (
    hostname === MATTERPORT_ROOT ||
    hostname.endsWith(`.${MATTERPORT_ROOT}`) ||
    hostname === MPEMBED_ROOT ||
    hostname.endsWith(`.${MPEMBED_ROOT}`)
  );
}

export function isMatterportUrl(url: string): boolean {
  const hostname = parseUrlHostname(url);
  if (!hostname) {
    return false;
  }
  return isAllowedMatterportHostname(hostname);
}

export function toMatterportEmbedUrl(url: string): string {
  const u = url.trim();
  const host = parseUrlHostname(u);
  if (host && (host === MPEMBED_ROOT || host.endsWith(`.${MPEMBED_ROOT}`))) {
    return u;
  }
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
