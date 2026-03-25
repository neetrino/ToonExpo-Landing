import { describe, expect, it } from "vitest";
import { EXPO_FIELD_COUNT, PROJECT_FIELD } from "@/shared/constants/expoFieldKeys";
import {
  emptyExpoFields,
  expoFieldsToJson,
  isFieldNonEmpty,
  trimExpoFields,
} from "@/shared/lib/expoFields";

describe("expoFields", () => {
  it("emptyExpoFields has corrected column count", () => {
    const e = emptyExpoFields();
    expect(Object.keys(e).length).toBe(EXPO_FIELD_COUNT);
  });

  it("expoFieldsToJson drops empty", () => {
    const v = emptyExpoFields();
    (v as Record<string, string>)[PROJECT_FIELD.participantName] = "  x  ";
    expect(expoFieldsToJson(v)).toEqual({ [PROJECT_FIELD.participantName]: "x" });
  });

  it("isFieldNonEmpty", () => {
    expect(isFieldNonEmpty("")).toBe(false);
    expect(isFieldNonEmpty("  ")).toBe(false);
    expect(isFieldNonEmpty("a")).toBe(true);
  });

  it("trimExpoFields", () => {
    const v = emptyExpoFields();
    (v as Record<string, string>)[PROJECT_FIELD.titleExhibition] = "  hi  ";
    const t = trimExpoFields(v);
    expect((t as Record<string, string>)[PROJECT_FIELD.titleExhibition]).toBe("hi");
  });
});
