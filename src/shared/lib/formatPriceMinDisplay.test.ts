import { describe, expect, it } from "vitest";
import { formatPriceMinForDisplay } from "@/shared/lib/formatPriceMinDisplay";

describe("formatPriceMinForDisplay", () => {
  it("formats plain digits with NBSP grouping and dram sign (SSR-safe)", () => {
    expect(formatPriceMinForDisplay("550000")).toBe("550\u00A0000\u00A0\u058F");
  });

  it("strips spaces from source", () => {
    expect(formatPriceMinForDisplay("550 000")).toBe(formatPriceMinForDisplay("550000"));
  });

  it("returns empty when no number", () => {
    expect(formatPriceMinForDisplay("")).toBe("");
    expect(formatPriceMinForDisplay(undefined)).toBe("");
    expect(formatPriceMinForDisplay("abc")).toBe("");
  });
});
