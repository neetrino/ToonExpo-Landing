import type { ConstructionDetailIconVariant } from "@/features/landing/components/ConstructionDetailIcon";
import type { LandingBlockId } from "@/features/landing/lib/blockVisibility";
import { PROJECT_FIELD, type ProjectFieldKey } from "@/shared/constants/expoFieldKeys";
import { HY_UI } from "@/shared/i18n/hyUi.constants";
import { publicAssetUrl } from "@/shared/lib/publicAssetUrl";

const F = PROJECT_FIELD;

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
  galleryArrowLeft: publicAssetUrl("/figma/participant/galleryArrowLeft.svg"),
  galleryArrowRight: publicAssetUrl("/figma/participant/galleryArrowRight.svg"),
} as const;

/**
 * Excel սյուներ N → T → Q → R → P → O (`docs/data/CorrectedToonExpoData2026.xlsx` / նույն CSV)։
 * Վերնագիր = `PROJECT_FIELD` բանալու տեքստը (սյունակի անվանումը), արժեքը՝ `fields[card.key]`։
 */
export const constructionCards: readonly {
  key: ProjectFieldKey;
  iconVariant: ConstructionDetailIconVariant;
}[] = [
  { key: F.structure, iconVariant: "structure" },
  { key: F.parkingClosed, iconVariant: "parkingClosed" },
  { key: F.elevators, iconVariant: "elevators" },
  { key: F.handover, iconVariant: "handover" },
  { key: F.ceiling, iconVariant: "ceiling" },
  { key: F.floors, iconVariant: "floors" },
] as const;
