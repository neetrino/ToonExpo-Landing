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
  const id = sanitizeMediaFolderId(mediaFolderId);
  const safe = safeUploadFileName(fileName);
  if (!id || !safe) {
    return null;
  }
  return `${normalizeProjectsPrefix(id)}${subfolder}/${safe}`;
}
