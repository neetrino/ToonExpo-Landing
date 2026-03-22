import { sep } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const fsMock = vi.hoisted(() => ({
  existsSync: vi.fn(),
  readdirSync: vi.fn(),
}));

const r2Mock = vi.hoisted(() => ({
  configured: false,
  /** prefix → keys (ListObjectsV2) */
  keysByPrefix: new Map<string, string[]>(),
}));

vi.mock("server-only", () => ({}));

vi.mock("node:fs", () => ({
  existsSync: (p: string) => fsMock.existsSync(p),
  readdirSync: (p: string) => fsMock.readdirSync(p),
}));

vi.mock("@/shared/lib/r2", () => ({
  isR2Configured: () => r2Mock.configured,
  listR2ObjectKeysUnderPrefix: async (prefix: string) => r2Mock.keysByPrefix.get(prefix) ?? [],
}));

import { resolveProjectFolderMedia } from "@/features/landing/lib/resolveProjectFolderMedia";

describe("resolveProjectFolderMedia", () => {
  beforeEach(() => {
    fsMock.existsSync.mockReset();
    fsMock.readdirSync.mockReset();
    r2Mock.configured = false;
    r2Mock.keysByPrefix = new Map();
  });

  afterEach(() => {
    delete process.env.R2_PUBLIC_URL;
  });

  it("returns empty URLs when id is null or invalid", async () => {
    const empty = {
      heroUrl: null,
      aboutLargeUrl: null,
      aboutSmallUrl: null,
      logoUrl: null,
      galleryUrls: [] as string[],
      infrastructureLeftUrl: null,
      infrastructureRightUrl: null,
    };
    await expect(resolveProjectFolderMedia(null)).resolves.toEqual(empty);
    await expect(resolveProjectFolderMedia("")).resolves.toEqual(empty);
    await expect(resolveProjectFolderMedia("../x")).resolves.toEqual(empty);
  });

  it("resolves hero, about, infra and gallery from mocked fs for folder 42", async () => {
    fsMock.existsSync.mockImplementation((p: string) => {
      const n = p.split(sep).join("/");
      return (
        n.includes("/project/42/Exterior") ||
        n.includes("/project/42/Interior") ||
        n.includes("/project/42/3DFloorplan") ||
        n.includes("/project/42/2Dfloorplan") ||
        n.includes("/project/42/Logo/Logo.png")
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

    const r = await resolveProjectFolderMedia("42");

    expect(r.logoUrl).toBe("/project/42/Logo/Logo.png");
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

  it("R2: case-insensitive folders and arbitrary logo file resolve to public URLs", async () => {
    process.env.R2_PUBLIC_URL = "https://cdn.example.com";
    r2Mock.configured = true;
    r2Mock.keysByPrefix.set("projects/2/", [
      "projects/2/exterior/1.webp",
      "projects/2/exterior/2.jpg",
      "projects/2/exterior/3.png",
      "projects/2/interior/1.jpg",
      "projects/2/logo/company-brand.png",
    ]);

    const r = await resolveProjectFolderMedia("2");

    expect(r.heroUrl).toBe("https://cdn.example.com/projects/2/exterior/1.webp");
    expect(r.logoUrl).toBe("https://cdn.example.com/projects/2/logo/company-brand.png");
    expect(r.galleryUrls).toContain("https://cdn.example.com/projects/2/exterior/1.webp");
    expect(r.galleryUrls.length).toBe(4);
  });

  it("R2: tries Projects/ prefix when projects/ returns no keys", async () => {
    process.env.R2_PUBLIC_URL = "https://cdn.example.com";
    r2Mock.configured = true;
    r2Mock.keysByPrefix.set("projects/9/", []);
    r2Mock.keysByPrefix.set("Projects/9/", ["Projects/9/Exterior/1.png"]);

    const r = await resolveProjectFolderMedia("9");
    expect(r.heroUrl).toBe("https://cdn.example.com/projects/9/Exterior/1.png");
  });
});
