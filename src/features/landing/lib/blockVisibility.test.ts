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
});
