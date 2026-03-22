"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { SITE_HEADER_LOGO_SRC } from "@/features/landing/landingPage.constants";
import { MOBILE_GLASS_FILL_CLASS } from "@/features/landing/mobile/landingPage.constants";
import { HY_UI } from "@/shared/i18n/hyUi.constants";

export type MobileNavMenuItem = {
  id: string;
  label: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  items: MobileNavMenuItem[];
};

const SHEET_HORIZONTAL_INSET = "px-4 sm:px-5";

function MobileNavMenuHeader({ onClose }: { onClose: () => void }) {
  return (
    <div
      className={`flex shrink-0 items-center justify-between gap-4 border-b border-white/15 py-4 ${SHEET_HORIZONTAL_INSET}`}
    >
      <Link
        href="/"
        aria-label={HY_UI.GO_HOME}
        className="group inline-flex items-center rounded-2xl py-0.5 pl-0.5 transition active:scale-[0.99]"
        onClick={onClose}
      >
        <span className="flex h-[52px] w-[52px] items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/15 transition group-hover:bg-white/10">
          <img src={SITE_HEADER_LOGO_SRC} alt="" className="h-11 w-11 object-contain" />
        </span>
      </Link>
      <button
        type="button"
        aria-label={HY_UI.ARIA_CLOSE_MENU}
        onClick={onClose}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-[22px] font-light leading-none text-white transition hover:bg-white/10 active:scale-[0.96]"
      >
        ×
      </button>
    </div>
  );
}

function MobileNavMenuLinks({ items, onClose }: { items: MobileNavMenuItem[]; onClose: () => void }) {
  return (
    <nav className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-2 pt-1" aria-label={HY_UI.MENU_TITLE}>
      <p
        className={`mb-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#2ba8b0] ${SHEET_HORIZONTAL_INSET}`}
      >
        {HY_UI.MENU_TITLE}
      </p>
      <ul className="flex flex-col">
        {items.map((item, index) => (
          <li key={item.id} className={index > 0 ? "border-t border-white/15" : ""}>
            <a
              href={`#${item.id}`}
              onClick={onClose}
              className={`flex items-center gap-3 ${SHEET_HORIZONTAL_INSET} py-3.5 text-[15px] font-semibold uppercase tracking-[0.06em] text-white/95 transition-colors hover:bg-white/5 active:bg-white/10`}
            >
              <span
                className="h-1 w-1 shrink-0 rounded-full bg-[#2ba8b0]/90 opacity-70 shadow-[0_0_12px_rgba(43,168,176,0.45)]"
                aria-hidden
              />
              <span className="min-w-0 flex-1 leading-snug">{item.label}</span>
              <span className="text-white/35" aria-hidden>
                →
              </span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function MobileNavMenuSheet({ onClose, items }: { onClose: () => void; items: MobileNavMenuItem[] }) {
  return (
    <div className="pointer-events-none relative z-10 flex max-h-[50dvh] min-h-0 w-full pt-[env(safe-area-inset-top)]">
      <div
        className={`mobile-landing-nav-panel-motion pointer-events-auto flex max-h-[50dvh] w-full min-h-0 flex-col overflow-hidden rounded-b-[1.5rem] border-b border-white/15 ${MOBILE_GLASS_FILL_CLASS} shadow-[0_16px_48px_rgba(0,0,0,0.28)] sm:rounded-b-[1.75rem]`}
      >
        <MobileNavMenuHeader onClose={onClose} />
        <MobileNavMenuLinks items={items} onClose={onClose} />
      </div>
    </div>
  );
}

/**
 * Լենդինգի մոբայլ նավիգացիա — լայնքով գրեթե ամբողջ էկրան, վերևից սահող, կիսաթափանցիկ։
 */
export function MobileLandingNavMenu({ open, onClose, items }: Props) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-[10002] flex flex-col" role="dialog" aria-modal="true" aria-label={HY_UI.MENU_TITLE}>
      <button
        type="button"
        aria-label={HY_UI.ARIA_CLOSE}
        onClick={onClose}
        className="mobile-landing-nav-backdrop-in absolute inset-0 z-0 bg-black/35 backdrop-blur"
      />
      <MobileNavMenuSheet onClose={onClose} items={items} />
    </div>,
    document.body,
  );
}
