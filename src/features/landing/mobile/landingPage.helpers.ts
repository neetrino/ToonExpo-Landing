import { parseMediaUrls } from "@/shared/lib/mediaUrls";
import { isFieldNonEmpty } from "@/shared/lib/expoFields";
import type { ExpoMap } from "@/features/landing/mobile/lib/blockVisibility";

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

/** Վերադարձնում է hero-ի հիմնական նկարը՝ նախընտրելով արտաքին հիմնական render-ը բազայից։ */
export function getHeroMedia(fields: ExpoMap): string {
  return parseMediaUrls(fields.expo_field_43)[0] ?? parseMediaUrls(fields.expo_field_44)[0] ?? "";
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

function extractFirstNumber(raw: string | undefined): string {
  const match = raw?.match(/\d+(?:[.,]\d+)?/);
  return match?.[0]?.replace(",", ".") ?? "";
}

export function parseSizeOptions(raw: string | undefined): string[] {
  if (!raw?.trim()) {
    return [];
  }

  return Array.from(new Set((raw.match(/\d+(?:[.,]\d+)?/g) ?? []).map((item) => item.replace(",", "."))));
}

export function getMobileStats(fields: ExpoMap): Array<{ value: string; label: string; tone: "teal" | "gold" | "navy" }> {
  return [
    {
      value: firstNonEmpty(extractFirstNumber(fields.expo_field_26), "30") + "+",
      label: "Apartments",
      tone: "teal",
    },
    {
      value: firstNonEmpty(extractFirstNumber(fields.expo_field_25), "6"),
      label: "Floors",
      tone: "gold",
    },
    {
      value: firstNonEmpty(extractFirstNumber(fields.expo_field_37), extractFirstNumber(fields.expo_field_38), "45"),
      label: "Parking",
      tone: "navy",
    },
  ];
}

export function toExternalHref(raw: string | undefined): string {
  const value = raw?.trim() ?? "";
  if (!value) {
    return "";
  }
  if (/^https?:\/\//i.test(value)) {
    return value;
  }
  return `https://${value}`;
}
