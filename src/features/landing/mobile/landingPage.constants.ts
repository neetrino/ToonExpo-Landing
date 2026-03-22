export const participantFigmaAssets = {
  heroBackground: "/figma/project-mobile/hero-background.jpg",
  headerLogo: "/figma/project-mobile/toon-logo.svg",
  menuIcon: "/figma/project-mobile/menu.svg",
  aboutPrimary: "/figma/project-mobile/about-photo-1.jpg",
  aboutSecondary: "/figma/project-mobile/about-photo-2.jpg",
  galleryMain: "/figma/project-mobile/gallery-main.jpg",
  galleryUpper: "/figma/project-mobile/gallery-card-1.jpg",
  galleryUpdates: "/figma/project-mobile/gallery-card-2.jpg",
  locationFallback: "/figma/project-mobile/location-map.jpg",
  investmentIcon: "/figma/project-mobile/investment-icon.svg",
  readMoreIcon: "/figma/project-mobile/read-more.svg",
  sizeNoteIcon: "/figma/project-mobile/size-note.svg",
  paymentInstallmentIcon: "/figma/project-mobile/payment-icon.svg",
  paymentMortgageIcon: "/figma/project-mobile/construction-icon.svg",
  paymentTaxIcon: "/figma/project-mobile/parking-icon.svg",
  paymentArrowLight: "/figma/project-mobile/accordion-arrow-light.svg",
  paymentArrowDark: "/figma/project-mobile/accordion-arrow-dark.svg",
} as const;

export const MOBILE_SECTION_INSET = "px-4" as const;
export const MOBILE_CONTACT_EMAIL = "info@toonexpo2026.com";

/** Hero-ում լրիվ տեքստը մոդալում բացելու կոճակ (միայն հայերեն) */
export const MOBILE_HERO_READ_FULL_LABEL_HY = "Կարդալ ամբողջը" as const;

/**
 * Hero-ի վերին padding՝ ֆիքսված `MobileLandingStickyHeader`-ից ներքև (նույն բարձրությունը՝
 * վերին pt + 52px լոգո + pb-3), որպեսզի նախագծի լոգոն չկտրվի `overflow-hidden` + `justify-center`-ով։
 */
export const MOBILE_PARTICIPANT_HERO_INSET_TOP_CLASS =
  "pt-[calc(0.75rem+52px+max(1.25rem,env(safe-area-inset-top)))]" as const;

