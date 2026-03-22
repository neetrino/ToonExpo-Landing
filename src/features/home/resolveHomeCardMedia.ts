import "server-only";

import { resolveProjectFolderMedia } from "@/features/landing/lib/resolveProjectFolderMedia";
import {
  firstNonEmpty,
  getLogoUrl,
  getProjectMedia,
} from "@/features/landing/landingPage.helpers";
import type { ExpoMap } from "@/features/landing/lib/blockVisibility";

/**
 * Նույն աղբյուրները, ինչ լենդինգի hero / լոգոն (`LandingPage`)։
 */
export function resolveHomeCardMedia(
  mediaFolderId: string | null,
  expoFields: Record<string, string>,
): { cardHeroUrl: string | null; cardLogoUrl: string | null } {
  const fields = expoFields as ExpoMap;
  const folderMedia = resolveProjectFolderMedia(mediaFolderId);
  const media = getProjectMedia(fields);
  const hero = firstNonEmpty(folderMedia.heroUrl, media[0]);
  const logo = firstNonEmpty(folderMedia.logoUrl, getLogoUrl(fields));
  return {
    cardHeroUrl: hero || null,
    cardLogoUrl: logo || null,
  };
}
