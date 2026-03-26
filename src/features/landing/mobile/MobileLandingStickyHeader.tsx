"use client";

import Link from "next/link";
import { SITE_HEADER_LOGO_SRC } from "@/features/landing/landingPage.constants";
import {
  MOBILE_GLASS_FILL_CLASS,
  MOBILE_SECTION_INSET,
  participantFigmaAssets,
} from "@/features/landing/mobile/landingPage.constants";
import { useScrolledPastThreshold } from "@/shared/hooks/useScrolledPastThreshold";
import { HY_UI } from "@/shared/i18n/hyUi.constants";

type Props = {
  onMenuClick: () => void;
  /** Եթե տրված է — այլընտրանքային լոգո (լռելյայն՝ կայքի `SITE_HEADER_LOGO_SRC`)։ */
  brandLogoSrc?: string;
  /** Հեռ. tel: href-ի համար (արդեն մաքրված, առանց բացատների)։ */
  phone?: string;
};

/**
 * Ստիկի հեդեր `/p/.../mobile` — վերևում թափանցիկ, սքրոլից հետո՝ կիսաթափանցիկ։
 */
export function MobileLandingStickyHeader({ onMenuClick, brandLogoSrc, phone }: Props) {
  const scrolled = useScrolledPastThreshold(20);

  const bar = scrolled
    ? `border-b border-white/15 ${MOBILE_GLASS_FILL_CLASS}`
    : "border-b border-transparent bg-transparent";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[60] flex items-center justify-between ${MOBILE_SECTION_INSET} pb-3 pt-[max(1.25rem,env(safe-area-inset-top))] text-white transition-[background-color,backdrop-filter,border-color] duration-200 ${bar}`}
    >
      <Link href="/" aria-label={HY_UI.GO_HOME} className="inline-flex">
        <img
          src={brandLogoSrc ?? SITE_HEADER_LOGO_SRC}
          alt=""
          className="h-[52px] w-[52px] object-contain"
        />
      </Link>
      <div className="flex items-center gap-2">
        {phone ? (
          <a
            href={`tel:${phone}`}
            aria-label={HY_UI.CTA_CALL_US}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e8192c] shadow-[0_4px_14px_rgba(232,25,44,0.45)] transition active:scale-95"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-white">
              <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.36 11.36 0 003.56.57 1 1 0 011 1V21a1 1 0 01-1 1A17 17 0 013 5a1 1 0 011-1h3.5a1 1 0 011 1 11.36 11.36 0 00.57 3.56 1 1 0 01-.25 1.01l-2.2 2.22z"/>
            </svg>
          </a>
        ) : null}
        <button
          type="button"
          aria-label={HY_UI.ARIA_OPEN_MENU}
          onClick={onMenuClick}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5"
        >
          <img src={participantFigmaAssets.menuIcon} alt="" className="h-6 w-6" />
        </button>
      </div>
    </header>
  );
}
