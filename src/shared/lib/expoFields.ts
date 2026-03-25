import { z } from "zod";
import { EXPO_FIELD_KEYS } from "@/shared/constants/expoFieldKeys";
import { migrateLegacyExpoFieldsJson } from "@/shared/lib/expoFieldsLegacyMigration";

const shape: Record<string, z.ZodOptional<z.ZodString>> = {};
for (const k of EXPO_FIELD_KEYS) {
  shape[k] = z.string().optional();
}

export const expoFieldsFormSchema = z.object(shape);

export type ExpoFieldsFormValues = z.infer<typeof expoFieldsFormSchema>;

export function emptyExpoFields(): ExpoFieldsFormValues {
  const o: Record<string, string> = {};
  for (const k of EXPO_FIELD_KEYS) {
    o[k] = "";
  }
  return o as ExpoFieldsFormValues;
}

export function normalizeExpoFields(raw: unknown): ExpoFieldsFormValues {
  const base = emptyExpoFields();
  if (!raw || typeof raw !== "object") {
    return base;
  }
  const obj = raw as Record<string, unknown>;
  const hasLegacy = Object.keys(obj).some((k) => k.startsWith("expo_field_"));
  if (hasLegacy) {
    const migrated = migrateLegacyExpoFieldsJson(obj);
    for (const k of EXPO_FIELD_KEYS) {
      if (Object.prototype.hasOwnProperty.call(migrated, k)) {
        const v = migrated[k];
        (base as Record<string, string>)[k] = typeof v === "string" ? v : "";
      }
    }
    return base;
  }
  for (const k of EXPO_FIELD_KEYS) {
    const v = obj[k];
    if (typeof v === "string") {
      (base as Record<string, string>)[k] = v;
    }
  }
  return base;
}

export function trimExpoFields(values: ExpoFieldsFormValues): ExpoFieldsFormValues {
  const out: Record<string, string> = {};
  for (const k of EXPO_FIELD_KEYS) {
    const v = (values as Record<string, string>)[k]?.trim() ?? "";
    out[k] = v;
  }
  return out as ExpoFieldsFormValues;
}

export function expoFieldsToJson(values: ExpoFieldsFormValues): Record<string, string> {
  const trimmed = trimExpoFields(values);
  const json: Record<string, string> = {};
  for (const k of EXPO_FIELD_KEYS) {
    const v = (trimmed as Record<string, string>)[k];
    if (v) {
      json[k] = v;
    }
  }
  return json;
}

export function isFieldNonEmpty(value: string | undefined): boolean {
  return Boolean(value?.trim());
}
