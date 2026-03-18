import { describe, expect, it } from "vitest";
import {
  emptyExpoFields,
  expoFieldsToJson,
  isFieldNonEmpty,
  trimExpoFields,
} from "@/shared/lib/expoFields";

describe("expoFields", () => {
  it("emptyExpoFields has 53 keys", () => {
    const e = emptyExpoFields();
    expect(Object.keys(e).length).toBe(53);
  });

  it("expoFieldsToJson drops empty", () => {
    const v = emptyExpoFields();
    (v as Record<string, string>).expo_field_01 = "  x  ";
    expect(expoFieldsToJson(v)).toEqual({ expo_field_01: "x" });
  });

  it("isFieldNonEmpty", () => {
    expect(isFieldNonEmpty("")).toBe(false);
    expect(isFieldNonEmpty("  ")).toBe(false);
    expect(isFieldNonEmpty("a")).toBe(true);
  });

  it("trimExpoFields", () => {
    const v = emptyExpoFields();
    (v as Record<string, string>).expo_field_02 = "  hi  ";
    const t = trimExpoFields(v);
    expect((t as Record<string, string>).expo_field_02).toBe("hi");
  });
});
