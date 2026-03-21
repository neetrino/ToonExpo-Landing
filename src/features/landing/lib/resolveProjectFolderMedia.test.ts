import { sep } from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";

const fsMock = vi.hoisted(() => ({
  existsSync: vi.fn(),
  readdirSync: vi.fn(),
}));

vi.mock("server-only", () => ({}));

vi.mock("node:fs", () => ({
  existsSync: (p: string) => fsMock.existsSync(p),
  readdirSync: (p: string) => fsMock.readdirSync(p),
}));

import { resolveProjectFolderMedia } from "@/features/landing/lib/resolveProjectFolderMedia";

describe("resolveProjectFolderMedia", () => {
  beforeEach(() => {
    fsMock.existsSync.mockReset();
    fsMock.readdirSync.mockReset();
  });

  it("returns empty URLs when id is null or invalid", () => {
    const empty = {
      heroUrl: null,
      aboutLargeUrl: null,
      aboutSmallUrl: null,
      galleryUrls: [] as string[],
      infrastructureLeftUrl: null,
      infrastructureRightUrl: null,
    };
    expect(resolveProjectFolderMedia(null)).toEqual(empty);
    expect(resolveProjectFolderMedia("")).toEqual(empty);
    expect(resolveProjectFolderMedia("../x")).toEqual(empty);
  });

  it("resolves hero, about, infra and gallery from mocked fs for folder 42", () => {
    fsMock.existsSync.mockImplementation((p: string) => {
      const n = p.split(sep).join("/");
      return (
        n.includes("/project/42/Exterior") ||
        n.includes("/project/42/Interior") ||
        n.includes("/project/42/3DFloorplan") ||
        n.includes("/project/42/2Dfloorplan")
      );
    });
    fsMock.readdirSync.mockImplementation((p: string) => {
      const n = p.split(sep).join("/");
      if (n.endsWith("/Exterior")) {
        return ["1.webp", "2.jpg", "3.png", "readme.txt"];
      }
      if (n.endsWith("/Interior")) {
        return ["1.jpg"];
      }
      if (n.endsWith("/3DFloorplan")) {
        return ["fp.png"];
      }
      if (n.endsWith("/2Dfloorplan")) {
        return [];
      }
      return [];
    });

    const r = resolveProjectFolderMedia("42");

    expect(r.heroUrl).toBe("/project/42/Exterior/1.webp");
    expect(r.aboutLargeUrl).toBe("/project/42/Exterior/2.jpg");
    expect(r.aboutSmallUrl).toBe("/project/42/Interior/1.jpg");
    expect(r.infrastructureLeftUrl).toBe("/project/42/Exterior/2.jpg");
    expect(r.infrastructureRightUrl).toBe("/project/42/Exterior/3.png");
    expect(r.galleryUrls).toEqual([
      "/project/42/Exterior/1.webp",
      "/project/42/Exterior/2.jpg",
      "/project/42/Exterior/3.png",
      "/project/42/Interior/1.jpg",
      "/project/42/3DFloorplan/fp.png",
    ]);
  });
});
