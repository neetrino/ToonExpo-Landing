import type { ResolvedProjectFolderMedia } from "@/features/landing/lib/projectFolderMedia.types";

export type GalleryResolvedItem = {
  fullUrl: string;
  thumbUrl: string;
};

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

/**
 * Լիարժեք և նախադիտման URL-ներ — ցանցի համար `thumbUrl`, լայթբոքսի համար `fullUrl`։
 */
export function resolveGalleryItems(
  media: readonly string[],
  folderMedia: ResolvedProjectFolderMedia | null,
): GalleryResolvedItem[] {
  const fullUrls = resolveGalleryImageUrls(media, folderMedia);
  const thumbUrls = folderMedia?.galleryThumbUrls;
  return fullUrls.map((fullUrl, index) => ({
    fullUrl,
    thumbUrl: thumbUrls?.[index] ?? fullUrl,
  }));
}
