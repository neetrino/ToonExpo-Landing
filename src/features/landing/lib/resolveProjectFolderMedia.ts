import "server-only";

import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import type { ResolvedProjectFolderMedia } from "@/features/landing/lib/projectFolderMedia.types";
import { sanitizeMediaFolderId } from "@/shared/lib/mediaFolderId";
import { isR2Configured, listR2ObjectKeysUnderPrefix } from "@/shared/lib/r2";

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

function toFilesystemPublicUrl(mediaFolderId: string, relativePath: string): string {
  const parts = relativePath.split(/[/\\]+/).filter(Boolean);
  return `/project/${mediaFolderId}/${parts.join("/")}`;
}

function toR2PublicUrlForRelative(mediaFolderId: string, relativePath: string): string {
  const base = process.env.R2_PUBLIC_URL?.replace(/\/$/, "") ?? "";
  const parts = relativePath.split(/[/\\]+/).filter(Boolean);
  const key = `projects/${mediaFolderId}/${parts.join("/")}`;
  return `${base}/${key}`;
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function findNumberedFileInRelList(relativePaths: string[], subdir: string, baseName: string): string | null {
  const re = new RegExp(
    `^${escapeRegExp(subdir)}/${escapeRegExp(baseName)}\\.(jpe?g|png|webp|gif)$`,
    "i",
  );
  const hit = relativePaths.find((r) => re.test(r));
  return hit ?? null;
}

function findLogoRelative(relativePaths: string[]): string | null {
  for (const rel of LOGO_RELATIVE_CANDIDATES) {
    if (relativePaths.includes(rel)) {
      return rel;
    }
  }
  return null;
}

function listImageRelsInSubdir(relativePaths: string[], subdir: string): string[] {
  const prefix = `${subdir}/`;
  return relativePaths
    .filter((r) => r.startsWith(prefix) && IMAGE_EXT_RE.test(r))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));
}

function collectFilesystemRelativePaths(mediaFolderId: string, baseAbs: string): string[] {
  const out: string[] = [];
  for (const sub of GALLERY_SUBDIRS) {
    const dir = join(baseAbs, sub);
    if (!existsSync(dir)) {
      continue;
    }
    for (const file of readdirSync(dir)) {
      if (IMAGE_EXT_RE.test(file)) {
        out.push(`${sub}/${file}`);
      }
    }
  }
  for (const rel of LOGO_RELATIVE_CANDIDATES) {
    const abs = join(baseAbs, ...rel.split("/"));
    if (existsSync(abs)) {
      out.push(rel);
    }
  }
  return out;
}

function buildResolvedFromRelativePaths(
  mediaFolderId: string,
  relativePaths: string[],
  urlMode: "filesystem" | "r2",
): ResolvedProjectFolderMedia {
  const toUrl =
    urlMode === "filesystem"
      ? (rel: string) => toFilesystemPublicUrl(mediaFolderId, rel)
      : (rel: string) => toR2PublicUrlForRelative(mediaFolderId, rel);

  const heroRel = findNumberedFileInRelList(relativePaths, "Exterior", "1");
  const aboutLargeRel = findNumberedFileInRelList(relativePaths, "Exterior", "2");
  const aboutSmallRel = findNumberedFileInRelList(relativePaths, "Interior", "1");
  const infraLeftRel = findNumberedFileInRelList(relativePaths, "Exterior", "2");
  const infraRightRel = findNumberedFileInRelList(relativePaths, "Exterior", "3");
  const logoRel = findLogoRelative(relativePaths);

  const galleryUrls: string[] = [];
  for (const sub of GALLERY_SUBDIRS) {
    for (const rel of listImageRelsInSubdir(relativePaths, sub)) {
      galleryUrls.push(toUrl(rel));
    }
  }

  return {
    heroUrl: heroRel ? toUrl(heroRel) : null,
    aboutLargeUrl: aboutLargeRel ? toUrl(aboutLargeRel) : null,
    aboutSmallUrl: aboutSmallRel ? toUrl(aboutSmallRel) : null,
    logoUrl: logoRel ? toUrl(logoRel) : null,
    galleryUrls,
    infrastructureLeftUrl: infraLeftRel ? toUrl(infraLeftRel) : null,
    infrastructureRightUrl: infraRightRel ? toUrl(infraRightRel) : null,
  };
}

function r2KeysToRelativePaths(mediaFolderId: string, keys: string[]): string[] {
  const prefix = `projects/${mediaFolderId}/`;
  return keys
    .filter((k) => k.startsWith(prefix))
    .map((k) => k.slice(prefix.length))
    .filter((r) => r.length > 0);
}

function resolveFromFilesystem(mediaFolderId: string): ResolvedProjectFolderMedia {
  const base = projectRootAbs(mediaFolderId);
  const relativePaths = [...new Set(collectFilesystemRelativePaths(mediaFolderId, base))];
  return buildResolvedFromRelativePaths(mediaFolderId, relativePaths, "filesystem");
}

/**
 * Server-only. R2 `projects/{id}/` կամ `public/project/{id}/` fallback։
 */
export async function resolveProjectFolderMedia(
  mediaFolderId: string | null | undefined,
): Promise<ResolvedProjectFolderMedia> {
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

  if (isR2Configured()) {
    const keys = await listR2ObjectKeysUnderPrefix(`projects/${id}/`);
    if (keys.length > 0) {
      const rels = r2KeysToRelativePaths(id, keys);
      return buildResolvedFromRelativePaths(id, rels, "r2");
    }
  }

  return resolveFromFilesystem(id);
}
