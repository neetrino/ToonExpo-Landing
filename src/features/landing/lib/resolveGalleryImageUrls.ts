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

function thumbForFullUrlInMainGallery(
  fullUrl: string,
  mainGalleryUrls: readonly string[],
  thumbUrls: readonly string[] | undefined,
): string {
  if (!thumbUrls || thumbUrls.length !== mainGalleryUrls.length) {
    return fullUrl;
  }
  const idx = mainGalleryUrls.indexOf(fullUrl);
  return idx >= 0 ? thumbUrls[idx]! : fullUrl;
}

/**
 * Երկրորդ գալերիա՝ միայն Interior, հետո Exterior (folder-ից)։ Expo fallback-ում դատարկ է։
 */
export function resolveSecondaryGalleryItems(
  folderMedia: ResolvedProjectFolderMedia | null,
): GalleryResolvedItem[] {
  const ordered = folderMedia?.galleryInteriorThenExteriorUrls ?? [];
  if (ordered.length === 0) {
    return [];
  }
  const mainGalleryUrls = folderMedia?.galleryUrls ?? [];
  const thumbUrls = folderMedia?.galleryThumbUrls;
  return ordered.map((fullUrl) => ({
    fullUrl,
    thumbUrl: thumbForFullUrlInMainGallery(fullUrl, mainGalleryUrls, thumbUrls),
  }));
}
