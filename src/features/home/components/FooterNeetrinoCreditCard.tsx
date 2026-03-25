"use client";

import { NeetrinoCreditPopover } from "@/features/home/components/NeetrinoCreditPopover";
import { HY_UI } from "@/shared/i18n/hyUi.constants";

type FooterNeetrinoCreditCardProps = {
  logoClassName: string;
  menuAlign: "start" | "center";
  className?: string;
};

/**
 * Միայն Neetrino լոգո — բարակ շրջանակ, վերևի աջում «Powered by» (գծի ընդհատում)։
 * «Ստեղծված է» — ֆուտերի ծնողում, ոչ թե այստեղ։
 */
export function FooterNeetrinoCreditCard({
  logoClassName,
  menuAlign,
  className = "",
}: FooterNeetrinoCreditCardProps) {
  return (
    <div
      className={`relative inline-flex w-fit max-w-full items-center justify-center rounded-2xl border border-[#2ba8b0]/35 bg-black px-2 py-1.5 sm:px-2.5 sm:py-2 ${className}`.trim()}
    >
      <span
        className="pointer-events-none absolute right-2 top-0 z-10 max-w-[min(140px,42vw)] -translate-y-1/2 bg-black px-1 text-center text-[0.45rem] font-semibold uppercase leading-tight tracking-[0.08em] text-[#2ba8b0] sm:right-2.5 sm:max-w-none sm:px-1.5 sm:text-[0.5rem] sm:tracking-[0.1em]"
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
