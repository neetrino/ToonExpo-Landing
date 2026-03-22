import type { ResolvedProjectFolderMedia } from "@/features/landing/lib/projectFolderMedia.types";

/**
 * Պատկերների ցուցակ՝ folder-ից կամ expo-ի մեդիա URL-ներից (առանց լուսանկար-զանգվածների)։
 */
export function resolveGalleryImageUrls(
  media: readonly string[],
  folderMedia: ResolvedProjectFolderMedia | null,
): string[] {
  if (folderMedia && folderMedia.galleryUrls.length > 0) {
    return folderMedia.galleryUrls;
  }

  return Array.from(new Set(media.filter(Boolean)));
}
