import { describe, expect, it } from "vitest";
import type { ResolvedProjectFolderMedia } from "@/features/landing/lib/projectFolderMedia.types";
import {
  resolveGalleryImageUrls,
  resolveGalleryItems,
  resolveSecondaryGalleryItems,
} from "@/features/landing/lib/resolveGalleryImageUrls";

describe("resolveGalleryImageUrls", () => {
  it("prefers folder galleryUrls when non-empty", () => {
    const folder: ResolvedProjectFolderMedia = {
      heroUrl: null,
      aboutLargeUrl: null,
      aboutSmallUrl: null,
      logoUrl: null,
      galleryUrls: ["https://cdn/a.webp", "https://cdn/b.webp"],
      galleryInteriorThenExteriorUrls: [],
      infrastructureLeftUrl: null,
      infrastructureRightUrl: null,
    };
    const media = ["https://expo/legacy.jpg"];
    expect(resolveGalleryImageUrls(media, folder)).toEqual(folder.galleryUrls);
  });

  it("falls back to unique expo media when no folder gallery", () => {
    const folder: ResolvedProjectFolderMedia = {
      heroUrl: null,
      aboutLargeUrl: null,
      aboutSmallUrl: null,
      logoUrl: null,
      galleryUrls: [],
      galleryInteriorThenExteriorUrls: [],
      infrastructureLeftUrl: null,
      infrastructureRightUrl: null,
    };
    const media = ["https://x/a.jpg", "https://x/b.jpg", "https://x/a.jpg"];
    expect(resolveGalleryImageUrls(media, folder)).toEqual(["https://x/a.jpg", "https://x/b.jpg"]);
  });
});

describe("resolveGalleryItems", () => {
  it("maps thumbUrl from galleryThumbUrls by index", () => {
    const folder: ResolvedProjectFolderMedia = {
      heroUrl: null,
      aboutLargeUrl: null,
      aboutSmallUrl: null,
      logoUrl: null,
      galleryUrls: ["https://cdn/full-1.webp", "https://cdn/full-2.webp"],
      galleryInteriorThenExteriorUrls: [],
      galleryThumbUrls: ["https://cdn/t1.webp", "https://cdn/t2.webp"],
      infrastructureLeftUrl: null,
      infrastructureRightUrl: null,
    };
    expect(resolveGalleryItems([], folder)).toEqual([
      { fullUrl: "https://cdn/full-1.webp", thumbUrl: "https://cdn/t1.webp" },
      { fullUrl: "https://cdn/full-2.webp", thumbUrl: "https://cdn/t2.webp" },
    ]);
  });

  it("uses fullUrl as thumb when galleryThumbUrls missing", () => {
    const folder: ResolvedProjectFolderMedia = {
      heroUrl: null,
      aboutLargeUrl: null,
      aboutSmallUrl: null,
      logoUrl: null,
      galleryUrls: ["https://cdn/a.webp"],
      galleryInteriorThenExteriorUrls: [],
      infrastructureLeftUrl: null,
      infrastructureRightUrl: null,
    };
    expect(resolveGalleryItems([], folder)).toEqual([
      { fullUrl: "https://cdn/a.webp", thumbUrl: "https://cdn/a.webp" },
    ]);
  });
});

describe("resolveSecondaryGalleryItems", () => {
  it("returns Interior then Exterior order and maps thumbs by main gallery index", () => {
    const folder: ResolvedProjectFolderMedia = {
      heroUrl: null,
      aboutLargeUrl: null,
      aboutSmallUrl: null,
      logoUrl: null,
      galleryUrls: ["https://cdn/ext-1.webp", "https://cdn/int-1.webp", "https://cdn/3d.png"],
      galleryInteriorThenExteriorUrls: ["https://cdn/int-1.webp", "https://cdn/ext-1.webp"],
      galleryThumbUrls: ["https://cdn/te1.webp", "https://cdn/ti1.webp", "https://cdn/t3d.webp"],
      infrastructureLeftUrl: null,
      infrastructureRightUrl: null,
    };
    expect(resolveSecondaryGalleryItems(folder)).toEqual([
      { fullUrl: "https://cdn/int-1.webp", thumbUrl: "https://cdn/ti1.webp" },
      { fullUrl: "https://cdn/ext-1.webp", thumbUrl: "https://cdn/te1.webp" },
    ]);
  });

  it("returns empty when folder null or secondary list empty", () => {
    expect(resolveSecondaryGalleryItems(null)).toEqual([]);
    const folder: ResolvedProjectFolderMedia = {
      heroUrl: null,
      aboutLargeUrl: null,
      aboutSmallUrl: null,
      logoUrl: null,
      galleryUrls: ["https://cdn/a.webp"],
      galleryInteriorThenExteriorUrls: [],
      infrastructureLeftUrl: null,
      infrastructureRightUrl: null,
    };
    expect(resolveSecondaryGalleryItems(folder)).toEqual([]);
  });
});
