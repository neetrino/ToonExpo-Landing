import { parseMediaUrls } from "@/shared/lib/mediaUrls";
import type { ExpoFieldsFormValues } from "@/shared/lib/expoFields";
import { PROJECT_FIELD } from "@/shared/constants/expoFieldKeys";
import { extractVirtualTourUrl } from "@/shared/lib/extractVirtualTourUrl";

/**
 * Google Drive / Docs — ոչ թե ուղղակի պատկեր/PDF URL լենդինգի համար։
 * R2-ն միակ աղբյուրն է ֆայլերի համար (բացառությամբ embed տուր/տեսանյութ դաշտերից)։
 */
export function isDriveOrDocsUrl(url: string): boolean {
  const lower = url.toLowerCase();
  return lower.includes("drive.google.com") || lower.includes("docs.google.com");
}

/** Բազմակի URL-ների տողից հանում է Drive/Docs հղումները */
export function sanitizeMediaUrlList(raw: string): string {
  const urls = parseMediaUrls(raw);
  if (urls.length === 0) {
    return raw.trim();
  }
  return urls.filter((u) => !isDriveOrDocsUrl(u)).join("\n");
}

/**
 * Մեկ URL դաշտ — եթե ամբողջությամբ Drive/Docs է, դատարկում է։
 * HTTP-ից բացի տեքստը չի հեռացվում (անսովոր դեպքեր)։
 */
export function sanitizeMediaSingleUrlField(raw: string): string {
  const t = raw.trim();
  if (!t) {
    return "";
  }
  if (!/^https?:\/\//i.test(t)) {
    return t;
  }
  return isDriveOrDocsUrl(t) ? "" : t;
}

/**
 * CSV ներմուծումից հետո — տեսանյութ և վիրտուալ տուր՝ մաքրել Drive, iframe-ից URL։
 */
export function sanitizeExpoFieldsFromCsvForMediaPolicy(
  fields: ExpoFieldsFormValues,
): ExpoFieldsFormValues {
  const o = { ...fields } as Record<string, string>;
  o[PROJECT_FIELD.video] = sanitizeMediaSingleUrlField(o[PROJECT_FIELD.video] ?? "");
  const vt = extractVirtualTourUrl(o[PROJECT_FIELD.virtualTour] ?? "");
  o[PROJECT_FIELD.virtualTour] = sanitizeMediaSingleUrlField(vt);
  return o as ExpoFieldsFormValues;
}
