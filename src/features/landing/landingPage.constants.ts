import type { LandingBlockId } from "@/features/landing/lib/blockVisibility";
import { HY_UI } from "@/shared/i18n/hyUi.constants";
import { publicAssetUrl } from "@/shared/lib/publicAssetUrl";

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
export const SITE_HEADER_LOGO_SRC = publicAssetUrl("/figma/home/footerLogo.svg");

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

/** Միայն SVG/քիչ ակտիվներ — լուսանկար-զանգվածներ հանված են (դատարկ slot → սև ֆոն UI-ում)։ */
export const participantFigmaAssets = {
  investmentIcon: publicAssetUrl("/figma/participant/investmentIcon.svg"),
  paymentInstallmentIcon: publicAssetUrl("/figma/participant/paymentInstallmentIcon.svg"),
  paymentMortgageIcon: publicAssetUrl("/figma/participant/paymentMortgageIcon.svg"),
  paymentTaxIcon: publicAssetUrl("/figma/participant/paymentTaxIcon.svg"),
  constructionStructureIcon: publicAssetUrl("/figma/participant/constructionStructureIcon.svg"),
  constructionMaterialsIcon: publicAssetUrl("/figma/participant/constructionMaterialsIcon.svg"),
  constructionInsulationIcon: publicAssetUrl("/figma/participant/constructionInsulationIcon.svg"),
  constructionCompletionIcon: publicAssetUrl("/figma/participant/constructionCompletionIcon.svg"),
  constructionCeilingIcon: publicAssetUrl("/figma/participant/constructionCeilingIcon.svg"),
  constructionFloorsIcon: publicAssetUrl("/figma/participant/constructionFloorsIcon.svg"),
  parkingOpenIcon: publicAssetUrl("/figma/participant/parkingOpenIcon.svg"),
  parkingClosedIcon: publicAssetUrl("/figma/participant/parkingClosedIcon.svg"),
  parkingPriceIcon: publicAssetUrl("/figma/participant/parkingPriceIcon.svg"),
  parkingStandardIcon: publicAssetUrl("/figma/participant/parkingStandardIcon.svg"),
  parkingCommercialIcon: publicAssetUrl("/figma/participant/parkingCommercialIcon.svg"),
  galleryArrowLeft: publicAssetUrl("/figma/participant/galleryArrowLeft.svg"),
  galleryArrowRight: publicAssetUrl("/figma/participant/galleryArrowRight.svg"),
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
