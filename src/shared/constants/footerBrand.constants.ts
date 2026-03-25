/**
 * Մեկ բրենդային teal — ֆուտեր, սոցիալ պատկերակներ, նիհար գծեր, ներքևի մենյու։
 * (#2ba8b0 — նույնը, ինչ CTA/կոճակների հիմնական accent-ը)
 */
export const FOOTER_BRAND_TEAL_HEX = "#2ba8b0" as const;

export const FOOTER_BRAND_TEAL_RGB = "43,168,176" as const;

/** Neetrino քարտ + ներքևի մենյու «պիլուլա» — շրջանակի գույն */
export const FOOTER_OUTLINE_BRAND_HEX = "#077388" as const;

/** Խծային շրջանակ — 1.5px, #077388 */
export const FOOTER_OUTLINE_BORDER_CLASSNAME = "border-[1px] border-[#077388]" as const;

/** «Powered by» պիտակի տեքստ — նույն accent-ը */
export const FOOTER_OUTLINE_LABEL_TEXT_CLASSNAME = "text-[#077388]" as const;

/** Սոցիալ SVG-ի գույնը մոտեցնել brand teal-ին (նախորդ #246976 տարբերությունից) */
export const FOOTER_SOCIAL_ICON_UNIFY_FILTER_CLASSNAME =
  "[filter:saturate(1.14)_hue-rotate(-5deg)_brightness(1.08)_contrast(1.02)]" as const;

/** Քաղաքի նկարազարդման գոտին համապատասխանեցնել accent teal-ին */
export const FOOTER_ILLUSTRATION_UNIFY_FILTER_CLASSNAME =
  "[filter:saturate(1.12)_hue-rotate(-6deg)_brightness(1.06)]" as const;
