import type { LandingBlockId } from "@/features/landing/lib/blockVisibility";
import { HY_UI } from "@/shared/i18n/hyUi.constants";

export const participantNav: Array<{
  id: string;
  label: string;
  block: LandingBlockId;
}> = [
  { id: "about", label: HY_UI.NAV_ABOUT, block: "about" },
  { id: "investment", label: HY_UI.NAV_INVESTMENT, block: "investment" },
  { id: "gallery", label: HY_UI.NAV_GALLERY, block: "gallery" },
  { id: "payment", label: HY_UI.NAV_PAYMENT, block: "payment" },
  { id: "infrastructure", label: HY_UI.NAV_INFRASTRUCTURE, block: "infrastructure" },
  { id: "construction", label: HY_UI.NAV_CONSTRUCTION, block: "construction" },
  { id: "parking", label: HY_UI.NAV_PARKING, block: "parking" },
  { id: "tours", label: HY_UI.NAV_TOURS, block: "tours" },
  { id: "location", label: HY_UI.NAV_LOCATION, block: "location" },
  { id: "contacts", label: HY_UI.NAV_CONTACTS, block: "footer" },
];

/** Նախագծի էջի սեկցիաների հորիզոնական inset (Investment-ի հետ նույնը) */
export const PARTICIPANT_SECTION_INSET =
  "px-5 sm:px-8 lg:pl-12 lg:pr-10 xl:pl-14" as const;

/** Toon Expo — գլխավոր էջի հեդերի հետ նույն ակտիվը (լենդինգի sticky header) */
export const SITE_HEADER_LOGO_SRC = "/figma/home/footerLogo.svg" as const;

/**
 * Hero-ում նախագծի լոգո՝ ֆիքսված տուփի չափ (տարբեր լոգոներ նույն ուղղահայաց դիրքում)։
 * Դեսքտոպում՝ նույն տողում `h1`-ի հետ (`items-start`)։
 */
export const HERO_PROJECT_LOGO_BOX_CLASS =
  "flex h-[92px] w-[100px] shrink-0 items-center justify-start lg:h-[118px] lg:w-[152px]" as const;

export const HERO_PROJECT_LOGO_IMG_CLASS =
  "max-h-full max-w-full object-contain object-left" as const;

export const MOBILE_HERO_PROJECT_LOGO_BOX_CLASS =
  "flex h-[100px] w-[133px] shrink-0 items-center justify-center" as const;

export const MOBILE_HERO_PROJECT_LOGO_IMG_CLASS =
  "max-h-full max-w-full object-contain" as const;

export const participantFigmaAssets = {
  heroBackground: "/figma/participant/heroBackground.jpg",
  aboutPrimary: "/figma/participant/aboutPrimary.jpg",
  aboutSecondary: "/figma/participant/aboutSecondary.jpg",
  galleryMain: "/figma/participant/galleryMain.jpg",
  galleryUpper: "/figma/participant/galleryUpper.jpg",
  galleryUpdates: "/figma/participant/galleryUpdates.jpg",
  infrastructureLeft: "/figma/participant/infrastructureLeft.jpg",
  infrastructureRight: "/figma/participant/infrastructureRight.jpg",
  locationFallback: "/figma/participant/locationFallback.jpg",
  investmentIcon: "/figma/participant/investmentIcon.svg",
  paymentInstallmentIcon: "/figma/participant/paymentInstallmentIcon.svg",
  paymentMortgageIcon: "/figma/participant/paymentMortgageIcon.svg",
  paymentTaxIcon: "/figma/participant/paymentTaxIcon.svg",
  constructionStructureIcon: "/figma/participant/constructionStructureIcon.svg",
  constructionMaterialsIcon: "/figma/participant/constructionMaterialsIcon.svg",
  constructionInsulationIcon: "/figma/participant/constructionInsulationIcon.svg",
  constructionCompletionIcon: "/figma/participant/constructionCompletionIcon.svg",
  constructionCeilingIcon: "/figma/participant/constructionCeilingIcon.svg",
  constructionFloorsIcon: "/figma/participant/constructionFloorsIcon.svg",
  parkingOpenIcon: "/figma/participant/parkingOpenIcon.svg",
  parkingClosedIcon: "/figma/participant/parkingClosedIcon.svg",
  parkingPriceIcon: "/figma/participant/parkingPriceIcon.svg",
  parkingStandardIcon: "/figma/participant/parkingStandardIcon.svg",
  parkingCommercialIcon: "/figma/participant/parkingCommercialIcon.svg",
  galleryArrowLeft: "/figma/participant/galleryArrowLeft.svg",
  galleryArrowRight: "/figma/participant/galleryArrowRight.svg",
} as const;

export const constructionCards = [
  { key: "expo_field_20", label: HY_UI.CONSTRUCTION_STRUCTURE, icon: participantFigmaAssets.constructionStructureIcon },
  { key: "expo_field_21", label: HY_UI.CONSTRUCTION_MATERIALS, icon: participantFigmaAssets.constructionMaterialsIcon },
  { key: "expo_field_22", label: HY_UI.CONSTRUCTION_INSULATION, icon: participantFigmaAssets.constructionInsulationIcon },
  { key: "expo_field_31", label: HY_UI.CONSTRUCTION_COMPLETION, icon: participantFigmaAssets.constructionCompletionIcon },
  { key: "expo_field_29", label: HY_UI.CONSTRUCTION_CEILING, icon: participantFigmaAssets.constructionCeilingIcon },
  { key: "expo_field_25", label: HY_UI.CONSTRUCTION_FLOORS, icon: participantFigmaAssets.constructionFloorsIcon },
] as const;

export const parkingCards = [
  { key: "expo_field_37", label: HY_UI.PARKING_OPEN, icon: participantFigmaAssets.parkingOpenIcon },
  { key: "expo_field_38", label: HY_UI.PARKING_CLOSED, icon: participantFigmaAssets.parkingClosedIcon },
  { key: "expo_field_40", label: HY_UI.PARKING_PRICE, icon: participantFigmaAssets.parkingPriceIcon },
  { key: "expo_field_39", label: HY_UI.PARKING_STANDARD, icon: participantFigmaAssets.parkingStandardIcon },
  { key: "expo_field_41", label: HY_UI.PARKING_COMMERCIAL, icon: participantFigmaAssets.parkingCommercialIcon },
] as const;
