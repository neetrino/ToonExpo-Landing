/**
 * Neetrino և Evolver — նույն տուփի չափեր ֆուտերում (բարձրություն + լայնություն)։
 * `object-contain` — տարբեր aspect ratio-ներ նույն ուրվագծում։
 */
export const FOOTER_PARTNER_LOGO_IMG_BOX_DARK = [
  "block h-[0.7875rem] w-[min(70px,25vw)] shrink-0 sm:h-[1.05rem] sm:w-[81px] lg:h-[1.225rem] lg:w-[95px]",
  "object-contain object-center opacity-90",
].join(" ");

export const FOOTER_PARTNER_LOGO_IMG_TRANSITION_DARK =
  "transition-[filter,opacity,transform] duration-200 ease-out group-hover:opacity-100 group-active:scale-[0.98]" as const;

/** Մոբայլ ֆուտեր — չափեր (Neetrino + Evolver տուփը)։ */
export const FOOTER_PARTNER_LOGO_IMG_BOX_LIGHT_DIMS =
  "block h-[0.91rem] w-[51px] shrink-0 object-contain object-center" as const;

/** Մոբայլ — opacity + hover (առանց `group-active` scale-ի)։ */
export const FOOTER_PARTNER_LOGO_IMG_BOX_LIGHT_HOVER = [
  "opacity-50 transition-[filter,opacity,transform,box-shadow] duration-200 ease-out",
  "group-hover:opacity-100 group-hover:brightness-120 group-hover:drop-shadow-[0_0_12px_rgba(43,168,176,0.75)] group-hover:ring-1 group-hover:ring-[#2ba8b0]/45",
].join(" ");

/** Մոբայլ — Neetrino `group-active` scale։ */
export const FOOTER_PARTNER_LOGO_IMG_BOX_LIGHT_ACTIVE_NEETRINO = "group-active:scale-[0.98]" as const;

/** Մոբայլ ֆուտեր — նույն տուփ Neetrino լոգոյին։ */
export const FOOTER_PARTNER_LOGO_IMG_BOX_LIGHT = [
  FOOTER_PARTNER_LOGO_IMG_BOX_LIGHT_DIMS,
  FOOTER_PARTNER_LOGO_IMG_BOX_LIGHT_HOVER,
  FOOTER_PARTNER_LOGO_IMG_BOX_LIGHT_ACTIVE_NEETRINO,
].join(" ");
