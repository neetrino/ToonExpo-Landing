export type ResolvedProjectFolderMedia = {
  heroUrl: string | null;
  aboutLargeUrl: string | null;
  aboutSmallUrl: string | null;
  /** `public/project/{id}/Logo/Logo.png` (կամ նշված այլ անուններ) */
  logoUrl: string | null;
  galleryUrls: string[];
  infrastructureLeftUrl: string | null;
  infrastructureRightUrl: string | null;
};
