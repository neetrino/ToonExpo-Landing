"use client";

import { FooterEvolverLogoLink } from "@/features/home/components/FooterEvolverLogoLink";
import { FOOTER_OUTLINE_BORDER_CLASSNAME } from "@/shared/constants/footerBrand.constants";

type FooterEvolverCreditCardProps = {
  logoClassName: string;
  className?: string;
};

/** Նույն պիլուլայի ոճը, ինչ Neetrino քարտը, առանց «Powered by» պիտակի։ */
export function FooterEvolverCreditCard({
  logoClassName,
  className = "",
}: FooterEvolverCreditCardProps) {
  return (
    <div
      className={`relative inline-flex h-full min-h-0 w-fit max-w-full items-center justify-center overflow-visible rounded-lg ${FOOTER_OUTLINE_BORDER_CLASSNAME} bg-black px-2.5 py-2 sm:px-3 sm:py-2.5 ${className}`.trim()}
    >
      <div className="flex justify-center">
        <FooterEvolverLogoLink variant="dark" logoClassName={logoClassName} />
      </div>
    </div>
  );
}
