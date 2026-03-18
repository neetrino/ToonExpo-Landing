import { describe, expect, it } from "vitest";
import { isMatterportUrl, toMatterportEmbedUrl } from "@/features/landing/lib/embedUrls";

describe("isMatterportUrl", () => {
  it("allows official Matterport and mpembed hosts", () => {
    expect(isMatterportUrl("https://my.matterport.com/show/?m=abc")).toBe(true);
    expect(isMatterportUrl("https://matterport.com/")).toBe(true);
    expect(isMatterportUrl("https://cdn.matterport.com/x")).toBe(true);
    expect(isMatterportUrl("https://mpembed.com/show/?m=x")).toBe(true);
    expect(isMatterportUrl("https://www.mpembed.com/")).toBe(true);
  });

  it("rejects substring tricks in path or query", () => {
    expect(isMatterportUrl("https://evil.com/matterport.com")).toBe(false);
    expect(isMatterportUrl("https://evil.com?x=mpembed.com")).toBe(false);
    expect(isMatterportUrl("https://evil.com/my.matterport.com")).toBe(false);
    expect(isMatterportUrl("https://mpembed.com.evil.com")).toBe(false);
  });

  it("rejects empty and invalid URLs", () => {
    expect(isMatterportUrl("")).toBe(false);
    expect(isMatterportUrl("   ")).toBe(false);
    expect(isMatterportUrl("not a url at all")).toBe(false);
  });
});

describe("toMatterportEmbedUrl", () => {
  it("returns URL unchanged for real mpembed hosts (not path substring)", () => {
    expect(toMatterportEmbedUrl("https://mpembed.com/show/?m=1")).toBe(
      "https://mpembed.com/show/?m=1",
    );
    expect(toMatterportEmbedUrl("https://cdn.mpembed.com/x?m=2")).toBe(
      "https://cdn.mpembed.com/x?m=2",
    );
    const evilPath = "https://evil.com/path/mpembed.com";
    expect(toMatterportEmbedUrl(evilPath)).toBe(evilPath);
  });

  it("builds embed from m param on Matterport host", () => {
    expect(toMatterportEmbedUrl("https://my.matterport.com/show/?m=MODEL")).toContain(
      "mpembed.com/show/?m=MODEL",
    );
  });
});
