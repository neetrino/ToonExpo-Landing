import { describe, expect, it } from "vitest";
import { PROJECT_FIELD } from "@/shared/constants/expoFieldKeys";
import { visibleBlocks } from "@/features/landing/lib/blockVisibility";

const F = PROJECT_FIELD;

describe("visibleBlocks", () => {
  it("hides investment when all empty", () => {
    const f: Record<string, string> = {};
    const v = visibleBlocks(f);
    expect(v.investment).toBe(false);
  });

  it("shows investment when price set", () => {
    const v = visibleBlocks({ [F.priceMin]: "1000" });
    expect(v.investment).toBe(true);
  });

  it("tours block for virtual tour or video", () => {
    expect(visibleBlocks({}).tours).toBe(false);
    expect(visibleBlocks({ [F.virtualTour]: "https://my.matterport.com/show/?m=x" }).tours).toBe(true);
    expect(visibleBlocks({ [F.video]: "https://youtube.com/x" }).tours).toBe(true);
  });
});
