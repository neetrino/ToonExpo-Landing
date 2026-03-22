import { parseMediaUrls } from "@/shared/lib/mediaUrls";
import type { ExpoFieldsFormValues } from "@/shared/lib/expoFields";

/**
 * Google Drive / Docs — ոչ թե ուղղակի պատկեր/PDF URL լենդինգի համար։
 * R2-ն միակ աղբյուրն է ֆայլերի համար (բացառությամբ embed `expo_field_45`/`46`)։
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

const CSV_OMIT_FROM_IMPORT_KEYS = [
  "expo_field_47",
  "expo_field_48",
  "expo_field_49",
  "expo_field_50",
] as const;

/**
 * CSV ներմուծումից հետո — մեդիա դաշտերը համաձայն քաղաքականության.
 * - 43–44. միայն ոչ-Drive URL-ներ (R2 կամ այլ հանրային հղումներ)
 * - 45–46. embed (YouTube, Matterport, …) — Drive հղումները հանվում են
 * - 47–50. CSV-ից չեն ներմուծվում (դատարկ — աղբյուրը R2 պանակն է / ադմինը)
 */
export function sanitizeExpoFieldsFromCsvForMediaPolicy(
  fields: ExpoFieldsFormValues,
): ExpoFieldsFormValues {
  const o = { ...fields } as Record<string, string>;
  o.expo_field_43 = sanitizeMediaUrlList(o.expo_field_43 ?? "");
  o.expo_field_44 = sanitizeMediaUrlList(o.expo_field_44 ?? "");
  o.expo_field_45 = sanitizeMediaSingleUrlField(o.expo_field_45 ?? "");
  o.expo_field_46 = sanitizeMediaSingleUrlField(o.expo_field_46 ?? "");
  for (const key of CSV_OMIT_FROM_IMPORT_KEYS) {
    o[key] = "";
  }
  return o as ExpoFieldsFormValues;
}
