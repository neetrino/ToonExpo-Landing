import { PROJECT_FIELD } from "@/shared/constants/expoFieldKeys";
import { extractVirtualTourUrl } from "@/shared/lib/extractVirtualTourUrl";
import type { ExpoMap } from "@/features/landing/lib/blockVisibility";

/** Վերադարձնում է նախագծի ցուցադրվող վերնագիրը։ */
export function getLandingTitle(fields: ExpoMap): string {
  const t = PROJECT_FIELD.titleExhibition;
  const p = PROJECT_FIELD.participantName;
  return fields[t]?.trim() || fields[p]?.trim() || "Project";
}

/** Վերադարձնում է առաջին ոչ դատարկ արժեքը։ */
export function firstNonEmpty(...values: Array<string | null | undefined>): string {
  return values.find((value) => typeof value === "string" && value.trim())?.trim() ?? "";
}

/** Կտրում է երկար տեքստը առաջին նախադասության սահմանում։ */
export function getLeadText(fields: ExpoMap): string {
  const raw = fields[PROJECT_FIELD.description]?.trim();
  if (!raw) {
    return "Discover the joy again!";
  }

  const [sentence] = raw.split(/(?<=[.!?])\s+/);
  return sentence?.trim() || raw;
}

/** Գալերիայի URL-ներ CSV-ում չկան — դատարկ ցուցակ (R2 պանակ)։ */
export function getProjectMedia(_fields: ExpoMap): string[] {
  return [];
}

/** Տեքստը պարբերությունների տեսքով։ */
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

/** Ձևաչափում է միջակայքը գնային քարտերի համար։ */
export function formatRange(minValue?: string, maxValue?: string): string {
  const min = minValue?.trim();
  const max = maxValue?.trim();

  if (min && max) {
    return min === max ? min : `${min} - ${max}`;
  }

  return min || max || "On request";
}

/** Լոգոն միայն R2/պանակից — CSV-ում URL չկա։ */
export function getLogoUrl(_fields: ExpoMap): string {
  return "";
}

/** Վիրտուալ տուր՝ iframe-ից URL։ */
export function getVirtualTourUrl(fields: ExpoMap): string {
  return extractVirtualTourUrl(fields[PROJECT_FIELD.virtualTour] ?? "");
}
