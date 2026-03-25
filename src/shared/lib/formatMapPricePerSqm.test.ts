import { describe, expect, it } from "vitest";
import { formatMapMinPricePerSqm } from "@/shared/lib/formatMapPricePerSqm";

const DRAM = "\u058F";
const SQM = " - ք/մ";

describe("formatMapMinPricePerSqm", () => {
  it("formats integer min price with hy-AM grouping, dram and sqm suffix", () => {
    const n = 550_000;
    const formatted = new Intl.NumberFormat("hy-AM", {
      useGrouping: true,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(n);
    expect(formatMapMinPricePerSqm("550000")).toBe(`${formatted}\u00A0${DRAM}${SQM}`);
  });

  it("preserves fractional digits from source without rounding to integer", () => {
    const n = 550_000.42;
    const formatted = new Intl.NumberFormat("hy-AM", {
      useGrouping: true,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(n);
    expect(formatMapMinPricePerSqm("550000.42")).toBe(`${formatted}\u00A0${DRAM}${SQM}`);
  });

  it("accepts comma as decimal separator", () => {
    const n = 100.5;
    const formatted = new Intl.NumberFormat("hy-AM", {
      useGrouping: true,
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(n);
    expect(formatMapMinPricePerSqm("100,5")).toBe(`${formatted}\u00A0${DRAM}${SQM}`);
  });

  it("returns null when empty", () => {
    expect(formatMapMinPricePerSqm("")).toBe(null);
    expect(formatMapMinPricePerSqm(undefined)).toBe(null);
  });

  it("falls back to raw text with suffix when not a number", () => {
    expect(formatMapMinPricePerSqm("On request")).toBe(`On request${SQM}`);
  });
});
