import { participantFigmaAssets } from "@/features/landing/landingPage.constants";
import type { ResolvedProjectFolderMedia } from "@/features/landing/lib/projectFolderMedia.types";

/**
 * Նույն լոգիկան, ինչ դեսքտոպի լենդինգում՝ պատկերների ցուցակ folder-ից կամ legacy մեդիա+placeholder-ներից։
 */
export function resolveGalleryImageUrls(
  media: readonly string[],
  folderMedia: ResolvedProjectFolderMedia | null,
): string[] {
  const legacyGalleryPool = Array.from(
    new Set([
      ...media,
      participantFigmaAssets.galleryMain,
      participantFigmaAssets.galleryUpper,
      participantFigmaAssets.galleryUpdates,
    ]),
  );

  if (folderMedia && folderMedia.galleryUrls.length > 0) {
    return folderMedia.galleryUrls;
  }

  return legacyGalleryPool;
}
