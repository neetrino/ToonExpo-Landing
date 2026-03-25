"use client";

import { Fragment } from "react";
import Link from "next/link";
import {
  FOOTER_PUBLIC_FACEBOOK_HREF,
  FOOTER_PUBLIC_INSTAGRAM_HREF,
} from "@/features/home/footerPublicLinks.constants";
import { HY_UI } from "@/shared/i18n/hyUi.constants";
import { publicAssetUrl } from "@/shared/lib/publicAssetUrl";

const FOOTER_SOCIAL_FB_IMG_CLASS = "h-[40px] w-[18px] shrink-0 object-contain object-left";
const FOOTER_SOCIAL_IG_IMG_CLASS = "h-[40px] w-[40px] shrink-0 object-contain";
const FOOTER_NAV_LINK_CLASS =
  "whitespace-nowrap text-white/90 transition hover:text-white text-[clamp(1.0125rem,2.97vw,1.4625rem)] tracking-[0.1em] sm:tracking-[0.14em]";
const FOOTER_NAV_PIPE_CLASS = "shrink-0 px-1.5 text-white/45 select-none sm:px-2.5";

const BLOCK_FIGMA = {
  footerBadge: publicAssetUrl("/figma/home/footerBadge.svg"),
  footerBadgeMark: publicAssetUrl("/figma/home/footerBadgeMark.svg"),
  visitSiteIconLeft: publicAssetUrl("/figma/home/visitSiteIconLeft.svg"),
  visitSiteIconRight: publicAssetUrl("/figma/home/visitSiteIconRight.svg"),
  reachOutCircle: publicAssetUrl("/figma/home/reachOutCircle.svg"),
  reachOutTargetArrow: publicAssetUrl("/figma/home/reachOutTargetArrow.svg"),
  reachOutTarget: publicAssetUrl("/figma/home/reachOutTarget.svg"),
} as const;

const FOOTER_NAV_ITEMS = [
  { href: "/#top", label: HY_UI.FOOTER_NAV_ABOUT },
  { href: "/#projects", label: HY_UI.FOOTER_NAV_PROJECTS },
  { href: "/#contacts", label: HY_UI.FOOTER_NAV_CONTACTS },
] as const;

export function FooterBottomNav({
  alignWithIllustration = false,
  socialIconImgClassName = "",
}: {
  alignWithIllustration?: boolean;
  socialIconImgClassName?: string;
}) {
  const fbIcon = (
    <img
      src={BLOCK_FIGMA.footerBadgeMark}
      alt=""
      className={`${FOOTER_SOCIAL_FB_IMG_CLASS} ${socialIconImgClassName}`.trim()}
      width={18}
      height={40}
    />
  );
  const igIcon = (
    <img
      src={BLOCK_FIGMA.footerBadge}
      alt=""
      className={`${FOOTER_SOCIAL_IG_IMG_CLASS} ${socialIconImgClassName}`.trim()}
      width={40}
      height={40}
    />
  );
  const rowAlign = alignWithIllustration ? "justify-start" : "justify-end";
  const navLinksOffsetClass = alignWithIllustration ? "pl-14 sm:pl-20 lg:pl-32" : "";

  return (
    <nav
      aria-label="Footer"
      className={`flex w-full min-w-0 flex-wrap items-center justify-end gap-x-1 gap-y-2 font-medium uppercase text-white sm:flex-nowrap ${rowAlign}`}
    >
      <div className={`flex min-w-0 shrink-0 flex-wrap items-center justify-end gap-x-1 gap-y-2 sm:flex-nowrap ${rowAlign} ${navLinksOffsetClass}`}>
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
        className={`flex shrink-0 flex-nowrap items-center gap-5 pl-3 sm:pl-6 ${alignWithIllustration ? "lg:pl-4" : "lg:pl-8"}`}
      >
        <a
          href={FOOTER_PUBLIC_FACEBOOK_HREF}
          target="_blank"
          rel="noreferrer"
          aria-label="Facebook"
          className="transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2ba8b0]/75"
        >
          {fbIcon}
        </a>
        <a
          href={FOOTER_PUBLIC_INSTAGRAM_HREF}
          target="_blank"
          rel="noreferrer"
          aria-label="Instagram"
          className="transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2ba8b0]/75"
        >
          {igIcon}
        </a>
      </div>
    </nav>
  );
}

export function ReachOutCta({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/#contacts"
      className={`inline-flex items-center justify-center gap-1.5 rounded-full bg-[#fbcd06] px-3 py-1 text-[0.65rem] font-extrabold uppercase tracking-[0.14em] text-black transition hover:brightness-105 ${className}`.trim()}
    >
      {HY_UI.CTA_REACH_OUT}
      <span className="relative inline-flex h-7 w-7 shrink-0 items-center justify-center">
        <img src={BLOCK_FIGMA.reachOutCircle} alt="" className="pointer-events-none select-none absolute inset-0 h-full w-full" draggable={false} />
        <span className="relative flex h-full w-full items-center justify-center" aria-hidden>
          <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <span className="inline-block translate-x-2.5 -translate-y-2">
              <img src={BLOCK_FIGMA.reachOutTargetArrow} alt="" className="h-4 w-4 object-contain" />
            </span>
          </span>
          <img
            src={BLOCK_FIGMA.reachOutTarget}
            alt=""
            className="pointer-events-none relative z-10 h-6 w-6 object-contain"
          />
        </span>
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
