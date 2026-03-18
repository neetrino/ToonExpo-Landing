"use client";

import { Fragment } from "react";
import Link from "next/link";

const VIEW_APARTMENTS_SIDE_ICON_CLASS = "h-10 w-10 shrink-0 object-contain sm:h-11 sm:w-11";
const FOOTER_SOCIAL_FB_IMG_CLASS = "h-[22px] w-[10px] shrink-0 object-contain object-left";
const FOOTER_SOCIAL_IG_IMG_CLASS = "h-[22px] w-[22px] shrink-0 object-contain";
const FOOTER_NAV_LINK_CLASS =
  "whitespace-nowrap text-white/90 transition hover:text-white text-[clamp(0.5625rem,1.65vw,0.8125rem)] tracking-[0.1em] sm:tracking-[0.14em]";
const FOOTER_NAV_PIPE_CLASS = "shrink-0 px-1 text-white/45 select-none sm:px-1.5";

const BLOCK_FIGMA = {
  footerBadge: "/figma/home/footerBadge.svg",
  footerBadgeMark: "/figma/home/footerBadgeMark.svg",
  visitSiteIconLeft: "/figma/home/visitSiteIconLeft.svg",
  visitSiteIconRight: "/figma/home/visitSiteIconRight.svg",
  reachOutCircle: "/figma/home/reachOutCircle.svg",
  reachOutTarget: "/figma/home/reachOutTarget.svg",
} as const;

const FOOTER_NAV_ITEMS = [
  { href: "/#top", label: "About" },
  { href: "/#events", label: "Events" },
  { href: "/#participants", label: "Participants" },
  { href: "/#projects", label: "Projects" },
  { href: "/#contacts", label: "Contacts" },
] as const;

export { VIEW_APARTMENTS_SIDE_ICON_CLASS };

export function FooterBottomNav({
  facebookUrl,
  instagramUrl,
  alignWithIllustration = false,
}: {
  facebookUrl: string;
  instagramUrl: string;
  alignWithIllustration?: boolean;
}) {
  const fbIcon = (
    <img
      src={BLOCK_FIGMA.footerBadgeMark}
      alt=""
      className={FOOTER_SOCIAL_FB_IMG_CLASS}
      width={10}
      height={22}
    />
  );
  const igIcon = (
    <img
      src={BLOCK_FIGMA.footerBadge}
      alt=""
      className={FOOTER_SOCIAL_IG_IMG_CLASS}
      width={22}
      height={22}
    />
  );
  const rowAlign = alignWithIllustration ? "justify-start" : "justify-center";
  const navLinksOffsetClass = alignWithIllustration ? "pl-14 sm:pl-20 lg:pl-32" : "";

  return (
    <nav
      aria-label="Footer"
      className={`flex w-full min-w-0 flex-nowrap items-center gap-x-1 overflow-x-auto overscroll-x-contain font-medium uppercase text-white sm:[scrollbar-width:thin] ${rowAlign}`}
    >
      <div className={`flex min-w-0 shrink-0 flex-nowrap items-center ${rowAlign} ${navLinksOffsetClass}`}>
        {FOOTER_NAV_ITEMS.map((item, index) => (
          <Fragment key={item.href}>
            {index > 0 ? (
              <span className={FOOTER_NAV_PIPE_CLASS} aria-hidden>
                |
              </span>
            ) : null}
            <a href={item.href} className={FOOTER_NAV_LINK_CLASS}>
              {item.label}
            </a>
          </Fragment>
        ))}
      </div>
      <div
        className={`flex shrink-0 items-center gap-4 pl-4 sm:pl-8 ${alignWithIllustration ? "lg:pl-6" : "lg:pl-10"}`}
      >
        {facebookUrl ? (
          <a
            href={facebookUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="Facebook"
            className="transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#277691]/80"
          >
            {fbIcon}
          </a>
        ) : (
          <span className="inline-flex opacity-45" aria-hidden>
            {fbIcon}
          </span>
        )}
        {instagramUrl ? (
          <a
            href={instagramUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#277691]/80"
          >
            {igIcon}
          </a>
        ) : (
          <span className="inline-flex opacity-45" aria-hidden>
            {igIcon}
          </span>
        )}
      </div>
    </nav>
  );
}

export function ReachOutCta({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/#contacts"
      className={`inline-flex items-center justify-center gap-1.5 rounded-full bg-[#fbcd06] px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-black transition hover:brightness-105 ${className}`.trim()}
    >
      Reach Out
      <span className="relative inline-flex h-7 w-7 shrink-0 items-center justify-center">
        <img src={BLOCK_FIGMA.reachOutCircle} alt="" className="absolute inset-0 h-full w-full" />
        <img src={BLOCK_FIGMA.reachOutTarget} alt="" className="relative h-4 w-4" />
      </span>
    </Link>
  );
}

export function SocialTilesRow({
  facebookUrl,
  instagramUrl,
  iconClassName,
  className = "flex items-center gap-2",
}: {
  facebookUrl: string;
  instagramUrl: string;
  iconClassName: string;
  className?: string;
}) {
  return (
    <div className={className}>
      {facebookUrl ? (
        <a
          href={facebookUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="Facebook"
          className="transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
        >
          <img src={BLOCK_FIGMA.visitSiteIconLeft} alt="" className={iconClassName} />
        </a>
      ) : (
        <span className="inline-flex" aria-hidden>
          <img src={BLOCK_FIGMA.visitSiteIconLeft} alt="" className={iconClassName} />
        </span>
      )}
      {instagramUrl ? (
        <a
          href={instagramUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="Instagram"
          className="transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
        >
          <img src={BLOCK_FIGMA.visitSiteIconRight} alt="" className={iconClassName} />
        </a>
      ) : (
        <span className="inline-flex" aria-hidden>
          <img src={BLOCK_FIGMA.visitSiteIconRight} alt="" className={iconClassName} />
        </span>
      )}
    </div>
  );
}
