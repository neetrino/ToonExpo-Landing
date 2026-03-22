import { sanitizeMediaFolderId } from "@/shared/lib/mediaFolderId";

/** Լենդինգի գալերիայի ենթապանակներ + լոգո */
export const PROJECT_MEDIA_SUBFOLDERS = [
  "Exterior",
  "Interior",
  "3DFloorplan",
  "2Dfloorplan",
  "Logo",
] as const;

export type ProjectMediaSubfolder = (typeof PROJECT_MEDIA_SUBFOLDERS)[number];

const SUBFOLDER_SET = new Set<string>(PROJECT_MEDIA_SUBFOLDERS);

function normalizeProjectsPrefix(mediaFolderId: string): string {
  return `projects/${mediaFolderId}/`;
}

/**
 * Ստուգում է, որ S3 key-ը պատկանի տվյալ նախագծին և թույլատրելի ենթապանակում լինի։
 */
export function validateProjectMediaObjectKey(
  mediaFolderId: string,
  objectKey: string,
): { ok: true } | { ok: false; reason: string } {
  const id = sanitizeMediaFolderId(mediaFolderId);
  if (!id) {
    return { ok: false, reason: "invalid_media_folder_id" };
  }
  const expectedPrefix = normalizeProjectsPrefix(id);
  if (!objectKey.startsWith(expectedPrefix)) {
    return { ok: false, reason: "key_prefix_mismatch" };
  }
  const rest = objectKey.slice(expectedPrefix.length);
  if (!rest || rest.includes("..") || rest.startsWith("/")) {
    return { ok: false, reason: "invalid_relative_path" };
  }
  const first = rest.split("/").filter(Boolean)[0] ?? "";
  if (!SUBFOLDER_SET.has(first)) {
    return { ok: false, reason: "subfolder_not_allowed" };
  }
  return { ok: true };
}

/**
 * Վերբեռնման համար — subfolder-ը allowlist-ից է։
 */
export function isProjectMediaSubfolder(
  value: string,
): value is ProjectMediaSubfolder {
  return SUBFOLDER_SET.has(value);
}

const SAFE_NAME_RE = /^[a-zA-Z0-9._\- ]+$/;

/**
 * Ֆայլի անուն միայն թույլատրելի նիշերով, առանց path traversal։
 */
export function safeUploadFileName(originalName: string): string | null {
  const t = originalName.trim();
  if (!t || t.includes("..") || t.includes("/") || t.includes("\\")) {
    return null;
  }
  if (t.length > 200) {
    return null;
  }
  if (!SAFE_NAME_RE.test(t)) {
    return null;
  }
  if (t === "." || t === "..") {
    return null;
  }
  return t;
}

export function buildProjectMediaObjectKey(
  mediaFolderId: string,
  subfolder: ProjectMediaSubfolder,
  fileName: string,
): string | null {
  return buildProjectMediaObjectKeyFromRelativePath(mediaFolderId, subfolder, fileName);
}

const REL_PATH_SEGMENT_RE = /^[a-zA-Z0-9._\- ]+$/;

/**
 * `relativePath` — `""` | `Exterior` | `Exterior/nested` — առաջին հատվածը allowlist-ից։
 */
export function buildProjectPrefixFromRelativePath(
  mediaFolderId: string,
  relativePath: string,
): string | null {
  const id = sanitizeMediaFolderId(mediaFolderId);
  if (!id) {
    return null;
  }
  const root = normalizeProjectsPrefix(id);
  const t = relativePath.trim();
  if (!t) {
    return root;
  }
  const segments = t.split("/").filter(Boolean);
  if (segments.length === 0) {
    return root;
  }
  if (!SUBFOLDER_SET.has(segments[0])) {
    return null;
  }
  for (const seg of segments) {
    if (!REL_PATH_SEGMENT_RE.test(seg) || seg.length > 120) {
      return null;
    }
  }
  return `${root}${segments.join("/")}/`;
}

/**
 * Վերբեռնման key՝ `relativePath`-ով (նույն կանոններով, ինչ `buildProjectPrefixFromRelativePath`)։
 */
export function buildProjectMediaObjectKeyFromRelativePath(
  mediaFolderId: string,
  relativePath: string,
  fileName: string,
): string | null {
  const prefix = buildProjectPrefixFromRelativePath(mediaFolderId, relativePath);
  const safe = safeUploadFileName(fileName);
  if (!prefix || !safe) {
    return null;
  }
  const base = prefix.endsWith("/") ? prefix.slice(0, -1) : prefix;
  return `${base}/${safe}`;
}

/**
 * `projects/37/Exterior/` → `Exterior`
 */
export function relativePathFromAbsolutePrefix(
  mediaFolderId: string,
  absolutePrefix: string,
): string | null {
  const id = sanitizeMediaFolderId(mediaFolderId);
  if (!id) {
    return null;
  }
  const root = normalizeProjectsPrefix(id);
  if (!absolutePrefix.startsWith(root)) {
    return null;
  }
  return absolutePrefix.slice(root.length).replace(/\/$/, "");
}
