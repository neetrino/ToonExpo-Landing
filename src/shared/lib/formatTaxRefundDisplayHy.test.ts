import { describe, expect, it } from "vitest";
import { HY_UI } from "@/shared/i18n/hyUi.constants";
import { formatTaxRefundForHomeCard } from "@/shared/lib/formatTaxRefundDisplayHy";

describe("formatTaxRefundForHomeCard", () => {
  it("maps yes-like values to Կա", () => {
    expect(formatTaxRefundForHomeCard("Այո")).toBe(HY_UI.TAX_REFUND_PRESENT);
    expect(formatTaxRefundForHomeCard("yes")).toBe(HY_UI.TAX_REFUND_PRESENT);
  });

  it("maps no-like values to Չկա", () => {
    expect(formatTaxRefundForHomeCard("Ոչ")).toBe(HY_UI.TAX_REFUND_ABSENT);
    expect(formatTaxRefundForHomeCard("no")).toBe(HY_UI.TAX_REFUND_ABSENT);
  });

  it("returns ON_REQUEST when empty", () => {
    expect(formatTaxRefundForHomeCard("")).toBe(HY_UI.ON_REQUEST);
    expect(formatTaxRefundForHomeCard(undefined)).toBe(HY_UI.ON_REQUEST);
  });

  it("preserves other text", () => {
    expect(formatTaxRefundForHomeCard("15% մինչև 2027")).toBe("15% մինչև 2027");
  });
});
