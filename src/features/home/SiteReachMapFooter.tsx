"use client";

import { useMemo } from "react";
import Link from "next/link";
import { HomeMapPreviewDynamic } from "@/features/map/components/HomeMapPreviewDynamic";
import { LazyWhenVisible } from "@/features/map/components/LazyWhenVisible";
import { buildMapMarkersFromProjects } from "@/features/home/buildMapMarkers";
import type { HomeProject } from "@/features/home/homeProject.types";
import { FooterBottomNav, ReachOutCta, SocialTilesRow } from "@/features/home/siteReachFooterBlocks";
import { HY_UI } from "@/shared/i18n/hyUi.constants";
import { publicAssetUrl } from "@/shared/lib/publicAssetUrl";

const FOOTER_LEGAL_TEXT_CLASS =
  "whitespace-nowrap text-xs uppercase leading-snug tracking-[0.14em] text-white/55 sm:text-sm sm:tracking-[0.16em]";
const FOOTER_PRIVACY_LINK_CLASS = `${FOOTER_LEGAL_TEXT_CLASS} shrink-0 transition hover:text-white/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#277691]/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black`;

const FIGMA_ASSETS = {
  footerLogo: publicAssetUrl("/figma/home/footerLogo.svg"),
  footerIllustration: publicAssetUrl("/figma/home/footerIllustration.svg"),
  locationDivider: publicAssetUrl("/figma/home/locationDivider.svg"),
  visitSiteButton: publicAssetUrl("/figma/home/visitSiteButton.svg"),
} as const;

/** Home և /p — նույն չափեր (Visit Site, FB/IG teal գոտում) */
const TEAL_BAR_VISIT_SITE_CLASS =
  "relative inline-flex h-10 w-52 max-w-full shrink-0 items-center justify-center text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-[#2ba8b0] transition hover:brightness-110";

const TEAL_BAR_SOCIAL_ICON_CLASS = "h-8 w-8 shrink-0 object-contain";

export type SiteReachMapFooterVariant = "home" | "participant";

export function SiteReachMapFooter({
  projects,
  variant = "home",
}: {
  projects: HomeProject[];
  variant?: SiteReachMapFooterVariant;
}) {
  const markers = useMemo(() => buildMapMarkersFromProjects(projects), [projects]);
  const anchor = projects[0] ?? null;
  const isParticipant = variant === "participant";
  const locationStripClass = isParticipant ? "bg-white" : "bg-[#246976]";
  const locationTitleClass = isParticipant
    ? "text-2xl font-semibold uppercase tracking-[0.12em] text-[#246976] lg:text-[2.5rem]"
    : "text-2xl font-semibold uppercase tracking-[0.12em] text-white lg:text-[2.5rem]";
  const mapFrameClass = isParticipant
    ? "toon-home-map relative z-0 overflow-hidden rounded-[20px] border border-[#246976]/25 shadow-[0_25px_60px_rgba(0,0,0,0.08)]"
    : "toon-home-map relative z-0 overflow-hidden rounded-[20px] border border-white/20 shadow-[0_25px_60px_rgba(0,0,0,0.2)]";
  const footerSite = isParticipant ? (anchor?.expoFields.expo_field_51 ?? "").trim() : "";
  const footerInstagram = anchor?.expoFields.expo_field_52?.trim() ?? "";
  const footerFacebook = anchor?.expoFields.expo_field_53?.trim() ?? "";

  return (
    <>
      <div className={`relative isolate ${locationStripClass}`}>
        <section
          id="contacts"
          className="relative z-20 mx-auto max-w-[1680px] scroll-mt-6 px-5 pb-10 pt-10 lg:px-10 lg:pb-14 lg:pt-12"
        >
          <div className="mb-6 flex items-center gap-4">
            <h2 className={locationTitleClass}>{HY_UI.HOME_LOCATION}</h2>
            {isParticipant ? (
              <div className="h-px min-w-0 flex-1 bg-[#246976]/30" aria-hidden />
            ) : (
              <img src={FIGMA_ASSETS.locationDivider} alt="" className="h-[2px] min-w-0 flex-1 opacity-70" />
            )}
          </div>
          <div className={mapFrameClass}>
            <LazyWhenVisible
              className="h-[240px] w-full md:h-[320px]"
              fallback={
                <div
                  className="h-full w-full rounded-[20px] bg-[#1d5662]/30 animate-pulse"
                  aria-hidden
                />
              }
            >
              <HomeMapPreviewDynamic markers={markers} className="h-full w-full" />
            </LazyWhenVisible>
          </div>
        </section>

        {isParticipant ? (
          <section className="relative z-10 -mt-12 border-t border-white/10 bg-[#2ba8b0] pt-12 lg:-mt-40 lg:pt-40">
            <div className="relative mx-auto max-w-[1680px] px-5 py-10 lg:min-h-[6rem] lg:px-10 lg:py-12">
              <div className="relative z-[2] flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex min-w-0 flex-1 flex-wrap items-center justify-center gap-2 sm:gap-3 lg:justify-start">
                  {footerSite ? (
                    <a
                      href={footerSite}
                      target="_blank"
                      rel="noreferrer"
                      className={TEAL_BAR_VISIT_SITE_CLASS}
                    >
                      <img src={FIGMA_ASSETS.visitSiteButton} alt="" className="absolute inset-0 h-full w-full" />
                      <span className="relative z-10">{HY_UI.CTA_VISIT_SITE}</span>
                    </a>
                  ) : null}
                  <SocialTilesRow
                    facebookUrl={footerFacebook}
                    instagramUrl={footerInstagram}
                    iconClassName={TEAL_BAR_SOCIAL_ICON_CLASS}
                    className="flex items-center gap-1.5"
                  />
                </div>
                <div className="flex w-full shrink-0 justify-end lg:w-auto">
                  <ReachOutCta className="shrink-0" />
                </div>
              </div>
            </div>
          </section>
        ) : null}
      </div>

      <footer className="relative flex min-h-[20rem] flex-col bg-black px-5 py-[5.2rem] lg:min-h-[24rem] lg:px-10 lg:py-[6.5rem]">
        <div className="relative mx-auto flex flex-1 min-h-0 w-full max-w-[1680px] flex-col">
          <div className="flex flex-1 flex-col">
            <div className="flex flex-col gap-6 text-white/70 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
              <img
                src={FIGMA_ASSETS.footerLogo}
                alt="Toon Expo"
                className="-mt-8 hidden h-32 w-32 shrink-0 sm:block sm:h-40 sm:w-40 lg:-mt-12"
              />
              <div className="-mt-8 flex min-w-0 flex-1 flex-col items-center lg:-mt-12 lg:items-end lg:justify-end">
                <FooterBottomNav alignWithIllustration={false} />
              </div>
            </div>
          </div>
        </div>
        <div
          className="absolute bottom-0 left-0 right-0 flex max-w-full flex-wrap items-baseline gap-x-7 gap-y-2 px-5 pb-5 pt-4 sm:gap-x-10 lg:px-10 lg:pb-6 lg:pt-5"
          role="group"
          aria-label="Legal"
        >
          <p className={`${FOOTER_LEGAL_TEXT_CLASS} shrink-0`}>
            © 2026 TOON EXPO. All rights reserved.
          </p>
          <Link href="/privacy" className={FOOTER_PRIVACY_LINK_CLASS}>
            {HY_UI.FOOTER_PRIVACY}
          </Link>
        </div>
        <div
          className="absolute right-0 bottom-0 h-40 w-[min(100%,1056px)] overflow-hidden opacity-90 lg:h-48 pr-5 lg:pr-10"
          aria-hidden
        >
          <img
            src={FIGMA_ASSETS.footerIllustration}
            alt=""
            className="absolute right-0 bottom-0 w-[220px] max-w-none origin-bottom-right scale-x-[4.8] scale-y-[1.333]"
          />
        </div>
      </footer>
    </>
  );
}
