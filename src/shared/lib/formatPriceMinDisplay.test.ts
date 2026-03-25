import { describe, expect, it } from "vitest";
import { formatPriceMinForDisplay } from "@/shared/lib/formatPriceMinDisplay";

describe("formatPriceMinForDisplay", () => {
  it("formats plain digits with hy-AM grouping and dram sign", () => {
    const num = new Intl.NumberFormat("hy-AM", {
      maximumFractionDigits: 0,
      useGrouping: true,
    }).format(550000);
    expect(formatPriceMinForDisplay("550000")).toBe(`${num}\u00A0\u058F`);
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
