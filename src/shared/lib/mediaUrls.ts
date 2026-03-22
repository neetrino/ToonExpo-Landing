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

export {
  isValidLatLng,
  parseDmsLatLng,
  parseLatLng,
  resolveLatLngForMap,
} from "./latLng";
