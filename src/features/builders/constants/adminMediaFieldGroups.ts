import { PROJECT_FIELD } from "@/shared/constants/expoFieldKeys";

/**
 * Ադմինի «Մեդիա» բաժին — R2 որպես աղբյուր պատկերների համար։
 * Տեսանյութ և վիրտուալ տուր՝ միայն URL (embed)։
 */

/** Արտաքին embed — միայն տեքստ, առանց ֆայլի վերբեռնման */
export const MEDIA_EMBED_EXTERNAL_URL_FIELD_KEYS = [
  PROJECT_FIELD.video,
  PROJECT_FIELD.virtualTour,
] as const;

export type MediaEmbedFieldKey = (typeof MEDIA_EMBED_EXTERNAL_URL_FIELD_KEYS)[number];
