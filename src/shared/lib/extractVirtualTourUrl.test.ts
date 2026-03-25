import { describe, expect, it } from "vitest";
import { extractVirtualTourUrl } from "@/shared/lib/extractVirtualTourUrl";

describe("extractVirtualTourUrl", () => {
  it("extracts src from Matterport iframe", () => {
    const html =
      '<iframe width="853" height="480" src="https://my.matterport.com/show/?m=XsjJabQSxG4" frameborder="0"></iframe>';
    expect(extractVirtualTourUrl(html)).toBe("https://my.matterport.com/show/?m=XsjJabQSxG4");
  });

  it("returns plain https URL unchanged", () => {
    const u = "https://my.matterport.com/show/?m=NAkLVBnHH53";
    expect(extractVirtualTourUrl(u)).toBe(u);
  });

  it("returns empty for empty input", () => {
    expect(extractVirtualTourUrl("")).toBe("");
    expect(extractVirtualTourUrl("   ")).toBe("");
  });
});
