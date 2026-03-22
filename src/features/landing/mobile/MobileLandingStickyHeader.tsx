"use client";

import Link from "next/link";
import { SITE_HEADER_LOGO_SRC } from "@/features/landing/landingPage.constants";
import {
  MOBILE_SECTION_INSET,
  participantFigmaAssets,
} from "@/features/landing/mobile/landingPage.constants";
import { useScrolledPastThreshold } from "@/shared/hooks/useScrolledPastThreshold";
import { HY_UI } from "@/shared/i18n/hyUi.constants";

type Props = {
  onMenuClick: () => void;
  /** Եթե տրված է — այլընտրանքային լոգո (լռելյայն՝ կայքի `SITE_HEADER_LOGO_SRC`)։ */
  brandLogoSrc?: string;
};

/**
 * Ստիկի հեդեր `/p/.../mobile` — վերևում թափանցիկ, սքրոլից հետո՝ կիսաթափանցիկ։
 */
export function MobileLandingStickyHeader({ onMenuClick, brandLogoSrc }: Props) {
  const scrolled = useScrolledPastThreshold(20);

  const bar = scrolled
    ? "border-b border-white/15 bg-black/72 backdrop-blur"
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
      <button
        type="button"
        aria-label={HY_UI.ARIA_OPEN_MENU}
        onClick={onMenuClick}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5"
      >
        <img src={participantFigmaAssets.menuIcon} alt="" className="h-6 w-6" />
      </button>
    </header>
  );
}
