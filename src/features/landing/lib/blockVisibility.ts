import { isFieldNonEmpty } from "@/shared/lib/expoFields";

export type ExpoMap = Record<string, string>;

export function anyFilled(keys: readonly string[], f: ExpoMap): boolean {
  return keys.some((k) => isFieldNonEmpty(f[k]));
}

const KEYS = {
  hero: ["expo_field_02", "expo_field_01", "expo_field_03", "expo_field_50", "expo_field_43"],
  about: ["expo_field_34", "expo_field_11", "expo_field_12", "expo_field_13", "expo_field_14"],
  investment: [
    "expo_field_07",
    "expo_field_08",
    "expo_field_17",
    "expo_field_18",
    "expo_field_10",
    "expo_field_09",
  ],
  gallery: ["expo_field_43", "expo_field_44"],
  payment: ["expo_field_19", "expo_field_09"],
  infrastructure: ["expo_field_33", "expo_field_34"],
  construction: [
    "expo_field_20",
    "expo_field_21",
    "expo_field_22",
    "expo_field_25",
    "expo_field_29",
    "expo_field_30",
    "expo_field_31",
    "expo_field_23",
    "expo_field_24",
    "expo_field_35",
    "expo_field_36",
  ],
  parking: ["expo_field_37", "expo_field_38", "expo_field_39", "expo_field_40", "expo_field_41"],
  tours: [
    "expo_field_45",
    "expo_field_46",
    "expo_field_47",
    "expo_field_48",
    "expo_field_49",
  ],
  location: ["expo_field_15", "expo_field_16"],
  footer: ["expo_field_51", "expo_field_52", "expo_field_53", "expo_field_11"],
} as const;

export type LandingBlockId = keyof typeof KEYS;

export function visibleBlocks(f: ExpoMap): Record<LandingBlockId, boolean> {
  const out = {} as Record<LandingBlockId, boolean>;
  for (const id of Object.keys(KEYS) as LandingBlockId[]) {
    out[id] = anyFilled(KEYS[id], f);
  }
  return out;
}
