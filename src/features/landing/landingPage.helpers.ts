import { parseMediaUrls } from "@/shared/lib/mediaUrls";
import { isFieldNonEmpty } from "@/shared/lib/expoFields";
import type { ExpoMap } from "@/features/landing/lib/blockVisibility";

/** Վերադարձնում է նախագծի ցուցադրվող վերնագիրը։ */
export function getLandingTitle(fields: ExpoMap): string {
  return fields.expo_field_02?.trim() || fields.expo_field_01?.trim() || "Project";
}

/** Վերադարձնում է առաջին ոչ դատարկ արժեքը։ */
export function firstNonEmpty(...values: Array<string | null | undefined>): string {
  return values.find((value) => typeof value === "string" && value.trim())?.trim() ?? "";
}

/** Կտրում է երկար տեքստը առաջին նախադասության սահմանում։ */
export function getLeadText(fields: ExpoMap): string {
  const raw = fields.expo_field_34?.trim();
  if (!raw) {
    return "Discover the joy again!";
  }

  const [sentence] = raw.split(/(?<=[.!?])\s+/);
  return sentence?.trim() || raw;
}

/** Վերադարձնում է նկարների ցուցակը հերոյի/պատկերասրահի համար։ */
export function getProjectMedia(fields: ExpoMap): string[] {
  return [...parseMediaUrls(fields.expo_field_43), ...parseMediaUrls(fields.expo_field_44)];
}

/** Վերադարձնում է տեքստը պարբերությունների տեսքով։ */
export function splitParagraphs(raw: string | undefined): string[] {
  if (!raw?.trim()) {
    return [];
  }

  return raw
    .split(/\n{2,}|\r\n\r\n/)
    .map((part) => part.trim())
    .filter(Boolean);
}

/** Փոխակերպում է տողերը ցուցակի տարրերի։ */
export function splitListItems(raw: string | undefined): string[] {
  if (!raw?.trim()) {
    return [];
  }

  const lines = raw
    .split(/\r?\n|[•;]+/)
    .map((line) => line.replace(/^[\-\u2022\s]+/, "").trim())
    .filter(Boolean);

  if (lines.length > 1) {
    return lines;
  }

  return raw
    .split(/(?<=\.)\s+/)
    .map((line) => line.trim())
    .filter(Boolean);
}

/** Քաշում է բնակարանների չափերը տարբեր դաշտերից։ */
export function extractApartmentSizes(fields: ExpoMap): string[] {
  const candidates = [
    fields.expo_field_06,
    fields.expo_field_26,
    fields.expo_field_27,
    fields.expo_field_28,
  ]
    .filter(Boolean)
    .join(" ");

  const matches = candidates.match(/\d+(?:[.,]\d+)?\s*m²/gi) ?? [];
  const normalized = matches.map((match) => match.replace(",", ".").replace(/\s+/g, " ").trim());

  return [...new Set(normalized)].slice(0, 8);
}

/** Ձևաչափում է միջակայքը գնային քարտերի համար։ */
export function formatRange(minValue?: string, maxValue?: string): string {
  const min = minValue?.trim();
  const max = maxValue?.trim();

  if (min && max) {
    return min === max ? min : `${min} - ${max}`;
  }

  return min || max || "On request";
}

/** Վերադարձնում է նախագծի լոգոն, եթե այն հղում է։ */
export function getLogoUrl(fields: ExpoMap): string {
  return isFieldNonEmpty(fields.expo_field_50) ? fields.expo_field_50.trim() : "";
}
