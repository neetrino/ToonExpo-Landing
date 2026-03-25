/**
 * Column «Վիրտուալ Տուր» may contain a full Matterport iframe or a plain URL.
 * Tour3DBlock expects a single https URL.
 */
export function extractVirtualTourUrl(raw: string): string {
  const s = raw.trim();
  if (!s) {
    return "";
  }
  const lower = s.toLowerCase();
  if (lower.includes("<iframe") || lower.includes("src=")) {
    const fromDoubleQuote = s.match(/\bsrc\s*=\s*"([^"]+)"/i);
    if (fromDoubleQuote?.[1]) {
      return fromDoubleQuote[1].replace(/&amp;/g, "&").trim();
    }
    const fromSingleQuote = s.match(/\bsrc\s*=\s*'([^']+)'/i);
    if (fromSingleQuote?.[1]) {
      return fromSingleQuote[1].replace(/&amp;/g, "&").trim();
    }
    const loose = s.match(/\bsrc\s*=\s*([^\s>]+)/i);
    if (loose?.[1]) {
      return loose[1].replace(/^["']|["']$/g, "").replace(/&amp;/g, "&").trim();
    }
  }
  if (/^https?:\/\//i.test(s)) {
    return s;
  }
  return s;
}
