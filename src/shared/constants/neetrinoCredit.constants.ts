/** Neetrino — կրեդիտ ֆուտերում (լոգո, Instagram, կայք)։ */
export const NEETRINO_LOGO_SRC =
  "https://pub-edcf2224b14f4fc392279702bfac041c.r2.dev/static/logo/neetrinologo.svg" as const;

export const NEETRINO_INSTAGRAM_URL =
  "https://www.instagram.com/neetrino_it_company/" as const;

export const NEETRINO_WEBSITE_URL = "https://neetrino.com" as const;

/** Popover menu labels (English) */
export const NEETRINO_MENU_LABEL_INSTAGRAM = "Instagram" as const;
export const NEETRINO_MENU_LABEL_WEBSITE = "Website" as const;

/**
 * Tailwind arbitrary class — նկար-լոգոն ~ֆուտերի primary teal (#2ba8b0), նման է կոճակի գույնին։
 * Բարդ բազմագույն SVG-ում fine-tune կարող է պետք լինել։
 */
export const NEETRINO_LOGO_FOOTER_TEAL_FILTER_CLASSNAME =
  "[filter:brightness(0)_saturate(100%)_invert(58%)_sepia(47%)_saturate(720%)_hue-rotate(144deg)_brightness(0.95)_contrast(0.92)]" as const;

/** Ֆուտերի մուգ ֆոնի վրա սպիտակ լոգո (գունավոր SVG → monochrome սպիտակ)։ */
export const NEETRINO_LOGO_FOOTER_WHITE_FILTER_CLASSNAME =
  "[filter:brightness(0)_invert(1)]" as const;
