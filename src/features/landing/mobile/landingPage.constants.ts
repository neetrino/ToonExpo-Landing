import { publicAssetUrl } from "@/shared/lib/publicAssetUrl";

export const participantFigmaAssets = {
  headerLogo: publicAssetUrl("/figma/project-mobile/toon-logo.svg"),
  menuIcon: publicAssetUrl("/figma/project-mobile/menu.svg"),
  readMoreIcon: publicAssetUrl("/figma/project-mobile/read-more.svg"),
  sizeNoteIcon: publicAssetUrl("/figma/project-mobile/size-note.svg"),
  paymentArrowLight: publicAssetUrl("/figma/project-mobile/accordion-arrow-light.svg"),
  paymentArrowDark: publicAssetUrl("/figma/project-mobile/accordion-arrow-dark.svg"),
} as const;

export const MOBILE_SECTION_INSET = "px-4" as const;

/**
 * Սքրոլված sticky header-ի հետ նույն կիսաթափանցիկը (`bg-black/72` + `backdrop-blur`)։
 */
export const MOBILE_GLASS_FILL_CLASS = "bg-black/72 backdrop-blur" as const;
export const MOBILE_CONTACT_EMAIL = "info@toonexpo2026.com";

/** Hero-ում լրիվ տեքստը մոդալում բացելու կոճակ (միայն հայերեն) */
export const MOBILE_HERO_READ_FULL_LABEL_HY = "Կարդալ ամբողջը" as const;

/**
 * Hero-ի վերին padding՝ ֆիքսված `MobileLandingStickyHeader`-ից ներքև (նույն բարձրությունը՝
 * վերին pt + 52px լոգո + pb-3), որպեսզի նախագծի լոգոն չկտրվի `overflow-hidden` + `justify-center`-ով։
 */
export const MOBILE_PARTICIPANT_HERO_INSET_TOP_CLASS =
  "pt-[calc(0.75rem+52px+max(1.25rem,env(safe-area-inset-top)))]" as const;

