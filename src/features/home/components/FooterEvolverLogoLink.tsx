/* eslint-disable @next/next/no-img-element */
"use client";

import {
  EVOLVER_LOGO_SRC,
  EVOLVER_WEBSITE_URL,
} from "@/shared/constants/evolverCredit.constants";
import { HY_UI } from "@/shared/i18n/hyUi.constants";

type FooterEvolverLogoLinkProps = {
  variant: "dark" | "light";
  logoClassName: string;
};

/** Evolver լոգո — ուղիղ հղում evolver.am (նոր ներդիրում)։ */
export function FooterEvolverLogoLink({ variant, logoClassName }: FooterEvolverLogoLinkProps) {
  return (
    <a
      href={EVOLVER_WEBSITE_URL}
      target="_blank"
      rel="noreferrer"
      className={`group inline-flex shrink-0 rounded-md outline-none transition focus-visible:ring-2 focus-visible:ring-[#2ba8b0]/80 focus-visible:ring-offset-2 ${
        variant === "dark" ? "focus-visible:ring-offset-black" : "focus-visible:ring-offset-white"
      }`}
      aria-label={HY_UI.FOOTER_EVOLVER_LOGO_ARIA}
    >
      <img src={EVOLVER_LOGO_SRC} alt="" className={logoClassName} />
    </a>
  );
}
