/**
 * Canonical keys = normalized headers from docs/data/CorrectedToonExpoData2026.csv (columns A–AB).
 */

/** Normalize header cell for stable JSON keys and CSV matching. */
export function normalizeExpoCsvHeader(raw: string): string {
  return raw.replace(/\r?\n/g, " ").replace(/\s+/g, " ").trim();
}

/** Named aliases — values must match CSV first row exactly after normalization. */
export const PROJECT_FIELD = {
  participantName: "Մասնակցի անուն",
  projectId: "Project ID",
  titleExhibition: "1․ Նախագծի անվանումը, որը ներկայացվելու է ցուցահանդեսին:",
  shortName: "Անվանումը",
  completion: "Շին Ավարտ",
  areas: "Մակերեսներ",
  priceMin: "Մինիմում արժեք",
  priceMax: "Մաքսիմում արժեք",
  taxRefund: "Եկամտահարկի վերադարձ",
  bank: "Գործընկեր բանկ",
  developer: "Կառուցապատող",
  locationCoords: "7.1 Տեղադիրք",
  paymentOptions: "Վճարային տարբերակներ",
  structure: "Կառուցվածք",
  floors: "Հարկայնությունը",
  ceiling: "Առաստաղների բարձրությունը",
  elevators: "Վերելակներ",
  handover: "Հանձնման վիճակը։",
  parkingOpen: "Կայանատեղիներ - Բաց",
  parkingClosed: "Կայանատեղիներ փակ",
  video: "Հոլովակ",
  email: "EMail",
  phone: "Հեռախոս",
  website: "49․ Տեղադրել կայքէջի հղումը։",
  instagram: "50․ Տեղադրել ինստագրամյան էջի հղումը։",
  facebook: "51․ Տեղադրել ֆեյսբուքյան էջի հղումը։",
  description: "Նկարագրություն",
  virtualTour: "Վիրտուալ Տուր",
} as const;

export type ProjectFieldKey = (typeof PROJECT_FIELD)[keyof typeof PROJECT_FIELD];

/** Ordered keys (A→AB) for forms, import, and JSON storage. */
export const EXPO_FIELD_KEYS: readonly ProjectFieldKey[] = [
  PROJECT_FIELD.participantName,
  PROJECT_FIELD.projectId,
  PROJECT_FIELD.titleExhibition,
  PROJECT_FIELD.shortName,
  PROJECT_FIELD.completion,
  PROJECT_FIELD.areas,
  PROJECT_FIELD.priceMin,
  PROJECT_FIELD.priceMax,
  PROJECT_FIELD.taxRefund,
  PROJECT_FIELD.bank,
  PROJECT_FIELD.developer,
  PROJECT_FIELD.locationCoords,
  PROJECT_FIELD.paymentOptions,
  PROJECT_FIELD.structure,
  PROJECT_FIELD.floors,
  PROJECT_FIELD.ceiling,
  PROJECT_FIELD.elevators,
  PROJECT_FIELD.handover,
  PROJECT_FIELD.parkingOpen,
  PROJECT_FIELD.parkingClosed,
  PROJECT_FIELD.video,
  PROJECT_FIELD.email,
  PROJECT_FIELD.phone,
  PROJECT_FIELD.website,
  PROJECT_FIELD.instagram,
  PROJECT_FIELD.facebook,
  PROJECT_FIELD.description,
  PROJECT_FIELD.virtualTour,
];

export const EXPO_FIELD_COUNT = EXPO_FIELD_KEYS.length;

/** Labels in admin — same as CSV column titles. */
export const EXPO_FIELD_LABELS_HY: Record<string, string> = Object.fromEntries(
  EXPO_FIELD_KEYS.map((k) => [k, k]),
);

export type ExpoFieldGroupId =
  | "meta"
  | "location"
  | "timing_pricing"
  | "developer"
  | "payment"
  | "construction"
  | "parking"
  | "media";

export const EXPO_FIELD_GROUPS: {
  id: ExpoFieldGroupId;
  titleHy: string;
  keys: readonly ProjectFieldKey[];
}[] = [
  {
    id: "meta",
    titleHy: "Ընդհանուր",
    keys: [
      PROJECT_FIELD.participantName,
      PROJECT_FIELD.projectId,
      PROJECT_FIELD.titleExhibition,
      PROJECT_FIELD.shortName,
    ],
  },
  {
    id: "location",
    titleHy: "Տեղադիրք",
    keys: [PROJECT_FIELD.locationCoords],
  },
  {
    id: "timing_pricing",
    titleHy: "Ժամկետներ, մակերես, գներ",
    keys: [
      PROJECT_FIELD.completion,
      PROJECT_FIELD.areas,
      PROJECT_FIELD.priceMin,
      PROJECT_FIELD.priceMax,
      PROJECT_FIELD.taxRefund,
      PROJECT_FIELD.bank,
    ],
  },
  { id: "developer", titleHy: "Կառուցապատող", keys: [PROJECT_FIELD.developer] },
  { id: "payment", titleHy: "Վճարային տարբերակներ", keys: [PROJECT_FIELD.paymentOptions] },
  {
    id: "construction",
    titleHy: "Շինարարություն",
    keys: [
      PROJECT_FIELD.structure,
      PROJECT_FIELD.floors,
      PROJECT_FIELD.ceiling,
      PROJECT_FIELD.elevators,
      PROJECT_FIELD.handover,
    ],
  },
  {
    id: "parking",
    titleHy: "Կայանատեղի",
    keys: [PROJECT_FIELD.parkingOpen, PROJECT_FIELD.parkingClosed],
  },
  {
    id: "media",
    titleHy: "Մեդիա և կապ",
    keys: [
      PROJECT_FIELD.video,
      PROJECT_FIELD.email,
      PROJECT_FIELD.phone,
      PROJECT_FIELD.website,
      PROJECT_FIELD.instagram,
      PROJECT_FIELD.facebook,
      PROJECT_FIELD.description,
      PROJECT_FIELD.virtualTour,
    ],
  },
];

export type ExpoEditSectionId =
  | "overview"
  | "place_finance"
  | "building"
  | "comfort"
  | "media";

export const EXPO_EDIT_SECTIONS: readonly {
  id: ExpoEditSectionId;
  titleHy: string;
  descriptionHy: string;
  groupIds: readonly ExpoFieldGroupId[];
}[] = [
  {
    id: "overview",
    titleHy: "Անուն և նախագիծ",
    descriptionHy: "Մասնակից, Project ID, վերնագրեր",
    groupIds: ["meta", "developer"],
  },
  {
    id: "place_finance",
    titleHy: "Տեղադիրք և ֆինանսներ",
    descriptionHy: "Կոորդինատներ, ժամկետներ, գներ, բանկ",
    groupIds: ["location", "timing_pricing", "payment"],
  },
  {
    id: "building",
    titleHy: "Շինարարություն",
    descriptionHy: "Շենք, հարկեր, վերելակ",
    groupIds: ["construction"],
  },
  {
    id: "comfort",
    titleHy: "Կայանատեղի",
    descriptionHy: "Բաց և փակ կայան",
    groupIds: ["parking"],
  },
  {
    id: "media",
    titleHy: "Մեդիա, կապ, նկարագրություն",
    descriptionHy: "Տեսանյութ, կոնտակտ, սոցցանցեր, տեքստ, 3D տուր",
    groupIds: ["media"],
  },
];
