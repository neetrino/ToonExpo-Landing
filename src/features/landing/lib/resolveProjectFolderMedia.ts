import "server-only";

import { cache } from "react";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import type { ResolvedProjectFolderMedia } from "@/features/landing/lib/projectFolderMedia.types";
import { sanitizeMediaFolderId } from "@/shared/lib/mediaFolderId";
import { isR2Configured, listR2ObjectKeysUnderPrefix } from "@/shared/lib/r2";

export type { ResolvedProjectFolderMedia } from "@/features/landing/lib/projectFolderMedia.types";

const PUBLIC_PROJECT_REL = join("public", "project");
const IMAGE_EXT_RE = /\.(jpe?g|png|webp|gif)$/i;

const GALLERY_SUBDIRS = ["Exterior", "Interior", "3DFloorplan", "2Dfloorplan"] as const;

/** S3 ListObjects prefix-ը case-sensitive է — փորձում ենք տարբեր գրելաձևեր։ */
const R2_PROJECT_ROOT_PREFIXES = ["projects", "Projects", "PROJECTS"] as const;

/** Հերթականություն՝ առաջին գտնվածը օգտագործվում է (Linux-ում case-sensitive է)։ */
const LOGO_RELATIVE_CANDIDATES = [
  "Logo/Logo.png",
  "Logo/Logo.webp",
  "Logo/Logo.jpg",
  "Logo/Logo.jpeg",
  "Logo/logo.png",
] as const;

/** Լոգոյի fallback — R2-ում ֆայլի անունը հաճախ այլ է, քան ցանկը։ */
const LOGO_FILE_EXT_RE = /\.(jpe?g|png|webp|gif|svg)$/i;

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

function relInSubdir(rel: string, subdir: string): boolean {
  const prefix = `${subdir}/`;
  return (
    rel.length > prefix.length &&
    rel.slice(0, prefix.length).toLowerCase() === prefix.toLowerCase()
  );
}

function findLogoRelative(relativePaths: string[]): string | null {
  const byLower = new Map(relativePaths.map((r) => [r.toLowerCase(), r]));
  for (const rel of LOGO_RELATIVE_CANDIDATES) {
    const hit = byLower.get(rel.toLowerCase());
    if (hit) {
      return hit;
    }
  }
  const inLogoFolder = relativePaths.filter((r) => {
    const parts = r.split("/").filter(Boolean);
    if (parts.length < 2) {
      return false;
    }
    if (parts[0].toLowerCase() !== "logo") {
      return false;
    }
    return LOGO_FILE_EXT_RE.test(parts[parts.length - 1] ?? "");
  });
  inLogoFolder.sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }),
  );
  return inLogoFolder[0] ?? null;
}

function listImageRelsInSubdir(relativePaths: string[], subdir: string): string[] {
  return relativePaths
    .filter((r) => relInSubdir(r, subdir) && IMAGE_EXT_RE.test(r))
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

/**
 * R2 object key → հարաբերական ուղի (ինչպես `public/project/`-ում)։
 * Key-ի `projects/{id}/` նախածանցը համեմատում ենք անզգայուն ռեգիստրի։
 */
function stripProjectsPrefixFromKey(key: string, mediaFolderId: string): string | null {
  const re = new RegExp(`^projects/${escapeRegExp(mediaFolderId)}/`, "i");
  const m = re.exec(key);
  if (!m) {
    return null;
  }
  const rest = key.slice(m[0].length);
  return rest.length > 0 ? rest : null;
}

function r2KeysToRelativePaths(mediaFolderId: string, keys: string[]): string[] {
  const out: string[] = [];
  for (const k of keys) {
    const rel = stripProjectsPrefixFromKey(k, mediaFolderId);
    if (rel) {
      out.push(rel);
    }
  }
  return out;
}

async function listR2KeysForProject(mediaFolderId: string): Promise<string[]> {
  for (const root of R2_PROJECT_ROOT_PREFIXES) {
    const keys = await listR2ObjectKeysUnderPrefix(`${root}/${mediaFolderId}/`);
    if (keys.length > 0) {
      return keys;
    }
  }
  return [];
}

function resolveFromFilesystem(mediaFolderId: string): ResolvedProjectFolderMedia {
  const base = projectRootAbs(mediaFolderId);
  const relativePaths = [...new Set(collectFilesystemRelativePaths(mediaFolderId, base))];
  return buildResolvedFromRelativePaths(mediaFolderId, relativePaths, "filesystem");
}

/**
 * Server-only. R2 `projects/{id}/` կամ `public/project/{id}/` fallback։
 * `cache` — նույն `mediaFolderId`-ի կրկնակի հարցումները մեկ ռենդերի մեջ միացվում են։
 */
async function resolveProjectFolderMediaImpl(
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
    const keys = await listR2KeysForProject(id);
    if (keys.length > 0) {
      const rels = r2KeysToRelativePaths(id, keys);
      return buildResolvedFromRelativePaths(id, rels, "r2");
    }
  }

  return resolveFromFilesystem(id);
}

export const resolveProjectFolderMedia = cache(resolveProjectFolderMediaImpl);
