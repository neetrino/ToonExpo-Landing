import type { LandingBlockId } from "@/features/landing/lib/blockVisibility";

export const participantNav: Array<{
  id: string;
  label: string;
  block: LandingBlockId;
}> = [
  { id: "about", label: "About", block: "about" },
  { id: "investment", label: "Investment", block: "investment" },
  { id: "gallery", label: "Gallery", block: "gallery" },
  { id: "payment", label: "Payment", block: "payment" },
  { id: "infrastructure", label: "Infrastructure", block: "infrastructure" },
  { id: "construction", label: "Construction", block: "construction" },
  { id: "parking", label: "Parking", block: "parking" },
  { id: "tours", label: "Tours & media", block: "tours" },
  { id: "location", label: "Location", block: "location" },
  { id: "contacts", label: "Contacts", block: "footer" },
];

/** Նախագծի էջի սեկցիաների հորիզոնական inset (Investment-ի հետ նույնը) */
export const PARTICIPANT_SECTION_INSET =
  "px-5 sm:px-8 lg:pl-12 lg:pr-10 xl:pl-14" as const;

export const participantFigmaAssets = {
  heroBackground: "/figma/participant/heroBackground.jpg",
  fallbackLogo: "/figma/participant/fallbackLogo.svg",
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
  { key: "expo_field_20", label: "Structure", icon: participantFigmaAssets.constructionStructureIcon },
  { key: "expo_field_21", label: "Materials", icon: participantFigmaAssets.constructionMaterialsIcon },
  { key: "expo_field_22", label: "Insulation", icon: participantFigmaAssets.constructionInsulationIcon },
  { key: "expo_field_31", label: "Completion", icon: participantFigmaAssets.constructionCompletionIcon },
  { key: "expo_field_29", label: "Ceiling height", icon: participantFigmaAssets.constructionCeilingIcon },
  { key: "expo_field_25", label: "Floors", icon: participantFigmaAssets.constructionFloorsIcon },
] as const;

export const parkingCards = [
  { key: "expo_field_37", label: "Open", icon: participantFigmaAssets.parkingOpenIcon },
  { key: "expo_field_38", label: "Closed", icon: participantFigmaAssets.parkingClosedIcon },
  { key: "expo_field_40", label: "Price", icon: participantFigmaAssets.parkingPriceIcon },
  { key: "expo_field_39", label: "Standard space", icon: participantFigmaAssets.parkingStandardIcon },
  { key: "expo_field_41", label: "Commercial spaces", icon: participantFigmaAssets.parkingCommercialIcon },
] as const;
