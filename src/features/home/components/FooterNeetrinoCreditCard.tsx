"use client";

import { NeetrinoCreditPopover } from "@/features/home/components/NeetrinoCreditPopover";
import {
  FOOTER_OUTLINE_BORDER_CLASSNAME,
  FOOTER_OUTLINE_LABEL_TEXT_CLASSNAME,
} from "@/shared/constants/footerBrand.constants";
import { HY_UI } from "@/shared/i18n/hyUi.constants";

type FooterNeetrinoCreditCardProps = {
  logoClassName: string;
  menuAlign: "start" | "center";
  className?: string;
};

/** Միայն Neetrino լոգո — բարակ շրջանակ, վերևի աջում «Powered by» (գծի ընդհատում)։ */
export function FooterNeetrinoCreditCard({
  logoClassName,
  menuAlign,
  className = "",
}: FooterNeetrinoCreditCardProps) {
  return (
    <div
      className={`relative inline-flex w-fit max-w-full items-center justify-center rounded-lg ${FOOTER_OUTLINE_BORDER_CLASSNAME} bg-black px-2.5 py-2 sm:px-3 sm:py-2.5 ${className}`.trim()}
    >
      <span
        className={`pointer-events-none absolute right-2.5 top-0 z-10 max-w-[min(140px,42vw)] -translate-y-1/2 bg-black px-1 text-center text-[0.45rem] font-semibold uppercase leading-tight tracking-[0.08em] ${FOOTER_OUTLINE_LABEL_TEXT_CLASSNAME} sm:right-3 sm:max-w-none sm:px-1.5 sm:text-[0.5rem] sm:tracking-[0.1em]`}
        aria-hidden
      >
        {HY_UI.FOOTER_POWERED_BY}
      </span>
      <div className="flex justify-center">
        <NeetrinoCreditPopover
          variant="dark"
          menuAlign={menuAlign}
          logoClassName={logoClassName}
        />
      </div>
    </div>
  );
}
