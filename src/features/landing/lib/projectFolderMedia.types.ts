export type ResolvedProjectFolderMedia = {
  heroUrl: string | null;
  aboutLargeUrl: string | null;
  aboutSmallUrl: string | null;
  /** Լոգո՝ `/project/...` (FS) կամ ամբողջական R2 URL (`projects/{id}/Logo/...`) */
  logoUrl: string | null;
  galleryUrls: string[];
  infrastructureLeftUrl: string | null;
  infrastructureRightUrl: string | null;
};
