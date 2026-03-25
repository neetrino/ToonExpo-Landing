import { PROJECT_FIELD } from "@/shared/constants/expoFieldKeys";

/** WGS84 bounds for map markers */
const LAT_MIN = -90;
const LAT_MAX = 90;
const LNG_MIN = -180;
const LNG_MAX = 180;

export function isValidLatLng(lat: number, lng: number): boolean {
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= LAT_MIN &&
    lat <= LAT_MAX &&
    lng >= LNG_MIN &&
    lng <= LNG_MAX
  );
}

/**
 * Parses decimal `lat,lng` or `lat;lng` (spaces allowed). Rejects values that are not plausible coordinates.
 */
export function parseLatLng(raw: string | undefined): { lat: number; lng: number } | null {
  if (!raw?.trim()) {
    return null;
  }
  const normalized = raw.trim().replace(/\u00a0/g, " ").replace(/\s+/g, " ");
  const strict = normalized.match(
    /^(-?\d+(?:[.,]\d+)?)\s*[,;]\s*(-?\d+(?:[.,]\d+)?)(?:\s|$)/,
  );
  if (strict) {
    const lat = Number.parseFloat(strict[1].replace(",", "."));
    const lng = Number.parseFloat(strict[2].replace(",", "."));
    if (!Number.isNaN(lat) && !Number.isNaN(lng) && isValidLatLng(lat, lng)) {
      return { lat, lng };
    }
  }
  const parts = normalized.split(/[,\s]+/).filter(Boolean);
  if (parts.length < 2) {
    return null;
  }
  const lat = Number.parseFloat(parts[0].replace(",", "."));
  const lng = Number.parseFloat(parts[1].replace(",", "."));
  if (Number.isNaN(lat) || Number.isNaN(lng) || !isValidLatLng(lat, lng)) {
    return null;
  }
  return { lat, lng };
}

function dmsPairToDecimal(
  degStr: string,
  minStr: string,
  secStr: string,
  hemi: string,
): number {
  const deg = Number.parseInt(degStr, 10);
  const min = Number.parseInt(minStr, 10);
  const sec = Number.parseFloat(secStr);
  if (Number.isNaN(deg) || Number.isNaN(min) || Number.isNaN(sec)) {
    return Number.NaN;
  }
  let v = deg + min / 60 + sec / 3600;
  const h = hemi.toUpperCase();
  if (h === "S" || h === "W") {
    v = -v;
  }
  return v;
}

/**
 * Parses strings like `40°16'05.6"N 44°38'18.4"E` (common in spreadsheet «map» cells).
 */
export function parseDmsLatLng(raw: string | undefined): { lat: number; lng: number } | null {
  if (!raw?.trim()) {
    return null;
  }
  const s = raw.trim().replace(/\s+/g, " ");
  const re =
    /(\d{1,3})[°]\s*(\d{1,2})['′]\s*([\d.]+)["″]?\s*([NS])\s+(\d{1,3})[°]\s*(\d{1,2})['′]\s*([\d.]+)["″]?\s*([EW])/i;
  const m = s.match(re);
  if (!m) {
    return null;
  }
  const lat = dmsPairToDecimal(m[1], m[2], m[3], m[4]);
  const lng = dmsPairToDecimal(m[5], m[6], m[7], m[8]);
  if (Number.isNaN(lat) || Number.isNaN(lng) || !isValidLatLng(lat, lng)) {
    return null;
  }
  return { lat, lng };
}

/**
 * Decimal coordinates from «7.1 Տեղադիրք»; optional DMS in the same cell.
 */
export function resolveLatLngForMap(
  fields: Record<string, string>,
): { lat: number; lng: number } | null {
  const cell = fields[PROJECT_FIELD.locationCoords];
  const fromDecimal = parseLatLng(cell);
  if (fromDecimal) {
    return fromDecimal;
  }
  return parseDmsLatLng(cell);
}
