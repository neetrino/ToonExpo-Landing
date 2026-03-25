/* eslint-disable @next/next/no-img-element */
"use client";

import { ExternalLink, Globe } from "lucide-react";
import {
  type RefObject,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import {
  NEETRINO_INSTAGRAM_URL,
  NEETRINO_LOGO_SRC,
  NEETRINO_MENU_LABEL_INSTAGRAM,
  NEETRINO_MENU_LABEL_WEBSITE,
  NEETRINO_WEBSITE_URL,
} from "@/shared/constants/neetrinoCredit.constants";
import { HY_UI } from "@/shared/i18n/hyUi.constants";

const MENU_ICON_CLASS = "h-4 w-4 shrink-0";
const MENU_EXTERNAL_TAB_ICON_CLASS = "h-3 w-3 shrink-0 opacity-50";
const MENU_GAP_PX = 8;
const MENU_Z_INDEX = 80;

/** Instagram glyph — lucide-react 1.6-ում Instagram export չկա */
function InstagramOutlineIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );
}

type NeetrinoCreditPopoverProps = {
  logoClassName: string;
  variant: "dark" | "light";
  menuAlign: "start" | "center";
};

function useCloseOnOutsideAndEscape(
  open: boolean,
  setOpen: (value: boolean) => void,
  rootRef: RefObject<HTMLElement | null>,
  menuRef: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    if (!open) {
      return;
    }
    const onPointerDown = (event: PointerEvent) => {
      const t = event.target as Node;
      if (rootRef.current?.contains(t) || menuRef.current?.contains(t)) {
        return;
      }
      setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, rootRef, menuRef, setOpen]);
}

/**
 * Neetrino լոգո — սեղմելիս Instagram / կայք։
 * Մենյուն document.body-ում է (portal) — overflow:hidden նախնիներ չեն կտրում։
 */
export function NeetrinoCreditPopover({
  logoClassName,
  variant,
  menuAlign,
}: NeetrinoCreditPopoverProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (!open) {
      setAnchorRect(null);
      return;
    }
    const el = buttonRef.current;
    if (!el) {
      return;
    }
    const update = () => {
      if (buttonRef.current) {
        setAnchorRect(buttonRef.current.getBoundingClientRect());
      }
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [open]);

  useCloseOnOutsideAndEscape(open, setOpen, rootRef, menuRef);

  const handleToggle = () => {
    if (open) {
      setOpen(false);
      return;
    }
    const el = buttonRef.current;
    if (el) {
      setAnchorRect(el.getBoundingClientRect());
    }
    setOpen(true);
  };

  const panelClass =
    variant === "dark"
      ? "border border-white/15 bg-[#141a22]"
      : "border border-black/12 bg-white";

  const linkClass =
    variant === "dark"
      ? "text-white/92 hover:bg-white/10 focus-visible:bg-white/10"
      : "text-[#111827] hover:bg-black/[0.06] focus-visible:bg-black/[0.06]";

  const bottomPx =
    typeof window !== "undefined" && anchorRect
      ? window.innerHeight - anchorRect.top + MENU_GAP_PX
      : 0;
  const leftPx = anchorRect
    ? menuAlign === "center"
      ? anchorRect.left + anchorRect.width / 2
      : anchorRect.left
    : 0;

  const menuNode =
    open && mounted && anchorRect ? (
      <div
        ref={menuRef}
        id={menuId}
        role="menu"
        aria-orientation="vertical"
        style={{
          position: "fixed",
          left: leftPx,
          bottom: bottomPx,
          transform: menuAlign === "center" ? "translateX(-50%)" : undefined,
          zIndex: MENU_Z_INDEX,
        }}
        className={`flex min-w-[11rem] flex-col gap-0.5 rounded-lg p-1.5 ${panelClass}`}
      >
        <a
          role="menuitem"
          href={NEETRINO_INSTAGRAM_URL}
          target="_blank"
          rel="noreferrer"
          title="Opens in a new tab"
          className={`flex w-full min-w-0 items-center gap-2 rounded-md px-2.5 py-2 text-left text-[0.7rem] font-medium tracking-wide outline-none transition focus-visible:ring-2 focus-visible:ring-[#2ba8b0]/70 ${linkClass}`}
          onClick={() => setOpen(false)}
        >
          <InstagramOutlineIcon className={MENU_ICON_CLASS} />
          <span className="min-w-0 flex-1">{NEETRINO_MENU_LABEL_INSTAGRAM}</span>
          <ExternalLink
            aria-hidden
            className={MENU_EXTERNAL_TAB_ICON_CLASS}
            strokeWidth={2.25}
          />
        </a>
        <a
          role="menuitem"
          href={NEETRINO_WEBSITE_URL}
          target="_blank"
          rel="noreferrer"
          title="Opens in a new tab"
          className={`flex w-full min-w-0 items-center gap-2 rounded-md px-2.5 py-2 text-left text-[0.7rem] font-medium tracking-wide outline-none transition focus-visible:ring-2 focus-visible:ring-[#2ba8b0]/70 ${linkClass}`}
          onClick={() => setOpen(false)}
        >
          <Globe aria-hidden className={MENU_ICON_CLASS} strokeWidth={2} />
          <span className="min-w-0 flex-1">{NEETRINO_MENU_LABEL_WEBSITE}</span>
          <ExternalLink
            aria-hidden
            className={MENU_EXTERNAL_TAB_ICON_CLASS}
            strokeWidth={2.25}
          />
        </a>
      </div>
    ) : null;

  return (
    <div ref={rootRef} className="relative inline-flex shrink-0">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        aria-haspopup="menu"
        aria-label={HY_UI.FOOTER_NEETRINO_LOGO_ARIA}
        onClick={handleToggle}
        className={`group inline-flex shrink-0 rounded-md outline-none transition focus-visible:ring-2 focus-visible:ring-[#2ba8b0]/80 focus-visible:ring-offset-2 ${
          variant === "dark" ? "focus-visible:ring-offset-black" : "focus-visible:ring-offset-white"
        }`}
      >
        <img src={NEETRINO_LOGO_SRC} alt="" className={logoClassName} />
      </button>
      {mounted && menuNode ? createPortal(menuNode, document.body) : null}
    </div>
  );
}
