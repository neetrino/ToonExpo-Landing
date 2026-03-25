export type ResolvedProjectFolderMedia = {
  heroUrl: string | null;
  aboutLargeUrl: string | null;
  aboutSmallUrl: string | null;
  /** Լոգո՝ `/project/...` (FS) կամ ամբողջական R2 URL (`projects/{id}/Logo/...`) */
  logoUrl: string | null;
  galleryUrls: string[];
  /**
   * Երկրորդ գալերիա-գոտի՝ միայն լուսանկարներ՝ Interior, հետո Exterior (առանց 3D/2D հատակապատկերների)։
   */
  galleryInteriorThenExteriorUrls: string[];
  /**
   * Նույն հերթականությամբ նախադիտման URL-ներ (թեթև) — բացակայության դեպքում ցանցում օգտագործվում է galleryUrls։
   */
  galleryThumbUrls?: string[];
  infrastructureLeftUrl: string | null;
  infrastructureRightUrl: string | null;
};
