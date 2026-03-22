import "server-only";

import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import type { ResolvedProjectFolderMedia } from "@/features/landing/lib/projectFolderMedia.types";
import { sanitizeMediaFolderId } from "@/shared/lib/mediaFolderId";

export type { ResolvedProjectFolderMedia } from "@/features/landing/lib/projectFolderMedia.types";

const PUBLIC_PROJECT_REL = join("public", "project");
const IMAGE_EXT_RE = /\.(jpe?g|png|webp|gif)$/i;

const GALLERY_SUBDIRS = ["Exterior", "Interior", "3DFloorplan", "2Dfloorplan"] as const;

/** Հերթականություն՝ առաջին գտնվածը օգտագործվում է (Linux-ում case-sensitive է)։ */
const LOGO_RELATIVE_CANDIDATES = [
  "Logo/Logo.png",
  "Logo/Logo.webp",
  "Logo/Logo.jpg",
  "Logo/Logo.jpeg",
  "Logo/logo.png",
] as const;

function projectRootAbs(mediaFolderId: string): string {
  return join(process.cwd(), PUBLIC_PROJECT_REL, mediaFolderId);
}

function toPublicUrl(mediaFolderId: string, relativePath: string): string {
  const parts = relativePath.split(/[/\\]+/).filter(Boolean);
  return `/project/${mediaFolderId}/${parts.join("/")}`;
}

function findNumberedFile(absDir: string, baseName: string): string | null {
  if (!existsSync(absDir)) {
    return null;
  }
  const files = readdirSync(absDir);
  const re = new RegExp(`^${escapeRegExp(baseName)}\\.(jpe?g|png|webp|gif)$`, "i");
  const hit = files.find((f) => re.test(f));
  return hit ?? null;
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function findLogoUrl(mediaFolderId: string, baseAbs: string): string | null {
  for (const rel of LOGO_RELATIVE_CANDIDATES) {
    const abs = join(baseAbs, ...rel.split("/"));
    if (existsSync(abs)) {
      return toPublicUrl(mediaFolderId, rel);
    }
  }
  return null;
}

function listImageFilesSorted(absDir: string): string[] {
  if (!existsSync(absDir)) {
    return [];
  }
  return readdirSync(absDir)
    .filter((f) => IMAGE_EXT_RE.test(f))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));
}

/**
 * Գալերեայի հերթականություն՝ Exterior → Interior → 3DFloorplan → 2Dfloorplan
 * (յուրաքանչյուրում՝ բոլոր պատկերները, բացակայող պանակը բաց թողնել)։
 */
function collectGalleryUrls(mediaFolderId: string, baseAbs: string): string[] {
  const out: string[] = [];
  for (const sub of GALLERY_SUBDIRS) {
    const dir = join(baseAbs, sub);
    for (const file of listImageFilesSorted(dir)) {
      out.push(toPublicUrl(mediaFolderId, `${sub}/${file}`));
    }
  }
  return out;
}

/**
 * Server-only. Կարդում է `public/project/{mediaFolderId}/` ֆայլային համակարգից։
 */
export function resolveProjectFolderMedia(
  mediaFolderId: string | null | undefined,
): ResolvedProjectFolderMedia {
  const empty: ResolvedProjectFolderMedia = {
    heroUrl: null,
    aboutLargeUrl: null,
    aboutSmallUrl: null,
    logoUrl: null,
    galleryUrls: [],
    infrastructureLeftUrl: null,
    infrastructureRightUrl: null,
  };

  const id = sanitizeMediaFolderId(mediaFolderId ?? undefined);
  if (!id) {
    return empty;
  }

  const base = projectRootAbs(id);
  const exterior = join(base, "Exterior");
  const interior = join(base, "Interior");

  const heroFile = findNumberedFile(exterior, "1");
  const aboutLargeFile = findNumberedFile(exterior, "2");
  const aboutSmallFile = findNumberedFile(interior, "1");
  const infraLeftFile = findNumberedFile(exterior, "2");
  const infraRightFile = findNumberedFile(exterior, "3");
  const logoUrl = findLogoUrl(id, base);

  return {
    heroUrl: heroFile ? toPublicUrl(id, `Exterior/${heroFile}`) : null,
    aboutLargeUrl: aboutLargeFile ? toPublicUrl(id, `Exterior/${aboutLargeFile}`) : null,
    aboutSmallUrl: aboutSmallFile ? toPublicUrl(id, `Interior/${aboutSmallFile}`) : null,
    logoUrl,
    galleryUrls: collectGalleryUrls(id, base),
    infrastructureLeftUrl: infraLeftFile ? toPublicUrl(id, `Exterior/${infraLeftFile}`) : null,
    infrastructureRightUrl: infraRightFile ? toPublicUrl(id, `Exterior/${infraRightFile}`) : null,
  };
}
