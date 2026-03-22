/**
 * Ադմինի «Մեդիա» բաժնի դաշտերի խմբավորում՝ R2 որպես աղբյուր, բացառությամբ embed URL-ների։
 */

/** Գալերիա — բազմակի URL / վերբեռնում R2 */
export const MEDIA_GALLERY_FIELD_KEYS = ["expo_field_43", "expo_field_44"] as const;

/** Արտաքին embed (տուր, տեսանյութ) — միայն տեքստ, առանց ֆայլի վերբեռնման կոճակի */
export const MEDIA_EMBED_EXTERNAL_URL_FIELD_KEYS = [
  "expo_field_45",
  "expo_field_46",
] as const;

/**
 * Թաքնված դաշտեր (լենդինգում չեն ցուցադրվում կամ secondary) — ձևում պահելու համար hidden input
 */
export const MEDIA_HIDDEN_PRESERVE_FIELD_KEYS = [
  "expo_field_47",
  "expo_field_48",
  "expo_field_49",
  "expo_field_50",
] as const;

export type MediaGalleryFieldKey = (typeof MEDIA_GALLERY_FIELD_KEYS)[number];
export type MediaEmbedFieldKey = (typeof MEDIA_EMBED_EXTERNAL_URL_FIELD_KEYS)[number];
export type MediaHiddenPreserveFieldKey = (typeof MEDIA_HIDDEN_PRESERVE_FIELD_KEYS)[number];
