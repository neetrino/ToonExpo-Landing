import { describe, expect, it } from "vitest";
import { visibleBlocks } from "@/features/landing/lib/blockVisibility";

describe("visibleBlocks", () => {
  it("hides investment when all empty", () => {
    const f: Record<string, string> = {};
    const v = visibleBlocks(f);
    expect(v.investment).toBe(false);
  });

  it("shows investment when price set", () => {
    const v = visibleBlocks({ expo_field_07: "1000" });
    expect(v.investment).toBe(true);
  });

  it("tours block only for expo_field_45 or expo_field_46", () => {
    expect(visibleBlocks({}).tours).toBe(false);
    expect(visibleBlocks({ expo_field_45: "https://example.com/tour" }).tours).toBe(true);
    expect(visibleBlocks({ expo_field_46: "https://youtube.com/x" }).tours).toBe(true);
    expect(visibleBlocks({ expo_field_47: "https://x.com" }).tours).toBe(false);
  });
});
