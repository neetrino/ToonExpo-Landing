/** Բազմակի URL-ներ բջիջից՝ նոր տող, `;`, կամ ստորակետ */
export function parseMediaUrls(raw: string | undefined): string[] {
  if (!raw?.trim()) {
    return [];
  }
  return raw
    .split(/[\n;]+|,\s*/)
    .map((s) => s.trim())
    .filter((s) => /^https?:\/\//i.test(s));
}

export function parseLatLng(raw: string | undefined): { lat: number; lng: number } | null {
  if (!raw?.trim()) {
    return null;
  }
  const parts = raw.split(/[,\s]+/).filter(Boolean);
  if (parts.length < 2) {
    return null;
  }
  const lat = Number.parseFloat(parts[0].replace(",", "."));
  const lng = Number.parseFloat(parts[1].replace(",", "."));
  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return null;
  }
  return { lat, lng };
}
