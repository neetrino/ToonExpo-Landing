import { PROJECT_FIELD } from "@/shared/constants/expoFieldKeys";
import type { ExpoMap } from "@/features/landing/mobile/lib/blockVisibility";
import { HY_UI } from "@/shared/i18n/hyUi.constants";

const F = PROJECT_FIELD;

/** Վերադարձնում է նախագծի ցուցադրվող վերնագիրը։ */
export function getLandingTitle(fields: ExpoMap): string {
  return fields[F.titleExhibition]?.trim() || fields[F.participantName]?.trim() || "Project";
}

/** Վերադարձնում է առաջին ոչ դատարկ արժեքը։ */
export function firstNonEmpty(...values: Array<string | null | undefined>): string {
  return values.find((value) => typeof value === "string" && value.trim())?.trim() ?? "";
}

/** Կտրում է երկար տեքստը առաջին նախադասության սահմանում։ */
export function getLeadText(fields: ExpoMap): string {
  const raw = fields[F.description]?.trim();
  if (!raw) {
    return "Discover the joy again!";
  }

  const [sentence] = raw.split(/(?<=[.!?])\s+/);
  return sentence?.trim() || raw;
}

/** CSV-ում պատկերների URL չկա — դատարկ։ */
export function getProjectMedia(_fields: ExpoMap): string[] {
  return [];
}

/** Hero նկար՝ միայն R2/պանակից `getHeroMedia` fallback-ով։ */
export function getHeroMedia(_fields: ExpoMap): string {
  return "";
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

/** Լոգո՝ միայն պանակից։ */
export function getLogoUrl(_fields: ExpoMap): string {
  return "";
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
      value: firstNonEmpty(extractFirstNumber(fields[F.areas]), "30") + "+",
      label: HY_UI.NAV_APARTMENTS,
      tone: "teal",
    },
    {
      value: firstNonEmpty(extractFirstNumber(fields[F.floors]), "6"),
      label: HY_UI.MOBILE_STAT_FLOORS,
      tone: "gold",
    },
    {
      value: firstNonEmpty(
        extractFirstNumber(fields[F.parkingOpen]),
        extractFirstNumber(fields[F.parkingClosed]),
        "45",
      ),
      label: HY_UI.MOBILE_STAT_PARKING,
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
