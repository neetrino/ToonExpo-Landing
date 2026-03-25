import {
  FOOTER_PARTNER_LOGO_IMG_BOX_DARK,
  FOOTER_PARTNER_LOGO_IMG_BOX_LIGHT_DIMS,
  FOOTER_PARTNER_LOGO_IMG_BOX_LIGHT_HOVER,
} from "@/shared/constants/footerPartnerLogo.constants";

/** Evolver — լոգո և կայք ֆուտերում (հարակից Neetrino-ին)։ */
export const EVOLVER_LOGO_SRC =
  "https://pub-edcf2224b14f4fc392279702bfac041c.r2.dev/static/logo/evolver-logo-vector.png" as const;

export const EVOLVER_WEBSITE_URL = "https://evolver.am" as const;

/**
 * Evolver vector PNG-ում մեծ դատարկ եզրեր են — նույն CSS տուփում գրաֆիկը փոքր է երևում։
 * `scale` — տեսանելի չափը մոտեցնում է Neetrino SVG-ին (դեսքտոփ + մոբայլ)։
 * Արժեքը կարգավորվում է աչքով՝ համեմատելով երկու լոգոները նույն շրջանակում։
 */
const EVOLVER_FOOTER_LOGO_VISUAL_SCALE_CLASSNAME = "origin-center scale-[1.58]" as const;

/** Նույն ~2% սեղմում active-ում, ինչ Neetrino-ի `scale(0.98)`-ը, բայց հաշվարկված մեծացված բազայից։ */
const EVOLVER_FOOTER_LOGO_ACTIVE_SCALE_CLASSNAME = "group-active:scale-[1.55]" as const;

const EVOLVER_FOOTER_LOGO_TRANSITION_DARK =
  "transition-[filter,opacity,transform] duration-200 ease-out group-hover:opacity-100" as const;

/** Մուգ ֆուտեր — նույն տուփը, ինչ Neetrino, տեսանելի մասշտաբը մեծացված։ */
export const EVOLVER_LOGO_FOOTER_CLASSNAME_DARK = [
  FOOTER_PARTNER_LOGO_IMG_BOX_DARK,
  EVOLVER_FOOTER_LOGO_VISUAL_SCALE_CLASSNAME,
  EVOLVER_FOOTER_LOGO_TRANSITION_DARK,
  EVOLVER_FOOTER_LOGO_ACTIVE_SCALE_CLASSNAME,
].join(" ");

/** Մոբայլ — նույն տուփ + մասշտաբ + hover, active scale՝ Evolver-ի համար։ */
export const EVOLVER_LOGO_FOOTER_CLASSNAME_LIGHT = [
  FOOTER_PARTNER_LOGO_IMG_BOX_LIGHT_DIMS,
  EVOLVER_FOOTER_LOGO_VISUAL_SCALE_CLASSNAME,
  FOOTER_PARTNER_LOGO_IMG_BOX_LIGHT_HOVER,
  EVOLVER_FOOTER_LOGO_ACTIVE_SCALE_CLASSNAME,
].join(" ");
