/* eslint-disable @next/next/no-img-element */
"use client";

import { useMemo } from "react";
import { HomeMapPreviewDynamic } from "@/features/map/components/HomeMapPreviewDynamic";
import { LazyWhenVisible } from "@/features/map/components/LazyWhenVisible";
import { buildMapMarkersFromProjects } from "@/features/home/buildMapMarkers";
import type { HomeProject } from "@/features/home/homeProject.types";
import { NeetrinoCreditPopover } from "@/features/home/components/NeetrinoCreditPopover";
import { FooterBottomNav, ReachOutCta, SocialTilesRow } from "@/features/home/siteReachFooterBlocks";
import { toExternalHref } from "@/features/landing/mobile/landingPage.helpers";
import { PROJECT_FIELD } from "@/shared/constants/expoFieldKeys";
import {
  FOOTER_ILLUSTRATION_UNIFY_FILTER_CLASSNAME,
  FOOTER_SOCIAL_ICON_UNIFY_FILTER_CLASSNAME,
} from "@/shared/constants/footerBrand.constants";
import { NEETRINO_LOGO_FOOTER_TEAL_FILTER_CLASSNAME } from "@/shared/constants/neetrinoCredit.constants";
import { HY_UI } from "@/shared/i18n/hyUi.constants";
import { publicAssetUrl } from "@/shared/lib/publicAssetUrl";

const FOOTER_LEGAL_TEXT_CLASS =
  "whitespace-nowrap text-xs uppercase leading-snug tracking-[0.14em] text-white/55 sm:text-sm sm:tracking-[0.16em]";

/** Neetrino լոգո — ներքևի գոտի (sm+), չափը ~կես նախորդից, teal ֆիլտր */
const NEETRINO_FOOTER_LOGO_CLASS = [
  "h-2.5 w-auto max-w-[36px] object-contain opacity-90",
  NEETRINO_LOGO_FOOTER_TEAL_FILTER_CLASSNAME,
  "transition-[filter,opacity,transform,box-shadow] duration-200 ease-out group-hover:opacity-100 group-hover:drop-shadow-[0_0_12px_rgba(43,168,176,0.75)] group-hover:ring-1 group-hover:ring-[#2ba8b0]/45 group-active:scale-[0.98] lg:h-3 lg:max-w-[44px]",
].join(" ");

/** Neetrino լոգո — մոբայլ xs, կիսաչափ, teal ֆիլտր */
const NEETRINO_FOOTER_LOGO_MOBILE_CLASS = [
  "h-5 w-auto max-w-[min(110px,39vw)] object-contain opacity-90",
  NEETRINO_LOGO_FOOTER_TEAL_FILTER_CLASSNAME,
  "transition-[filter,opacity,transform,box-shadow] duration-200 ease-out group-hover:opacity-100 group-hover:drop-shadow-[0_0_14px_rgba(43,168,176,0.7)] group-hover:ring-1 group-hover:ring-[#2ba8b0]/50 group-active:scale-[0.98]",
].join(" ");

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
    ? "toon-home-map relative z-0 overflow-visible rounded-[20px] border border-[#246976]/25 shadow-[0_25px_60px_rgba(0,0,0,0.08)] [--toon-map-corner-radius:20px]"
    : "toon-home-map relative z-0 overflow-visible rounded-[20px] border border-white/20 shadow-[0_25px_60px_rgba(0,0,0,0.2)] [--toon-map-corner-radius:20px]";
  const F = PROJECT_FIELD;
  const footerSite = isParticipant ? toExternalHref(anchor?.expoFields[F.website]) : "";
  const footerInstagram = anchor?.expoFields[F.instagram]?.trim() ?? "";
  const footerFacebook = anchor?.expoFields[F.facebook]?.trim() ?? "";

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
                      <img src={FIGMA_ASSETS.visitSiteButton} alt="" className="pointer-events-none select-none absolute inset-0 h-full w-full" draggable={false} />
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
              <div className="-mt-8 flex min-w-0 flex-1 flex-col items-stretch lg:-mt-12 lg:items-end lg:justify-end">
                <div className="flex w-full min-w-0 flex-row flex-wrap items-start justify-between gap-x-3 gap-y-4 sm:items-center sm:justify-end">
                  <div className="min-w-0 max-w-[min(100%,calc(100%-5.25rem))] flex-1 overflow-visible sm:hidden">
                    <div className="relative overflow-visible rounded-2xl border border-[#2ba8b0]/35 bg-gradient-to-b from-[#2ba8b0]/[0.14] via-black/45 to-black/95 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_18px_52px_-18px_rgba(43,168,176,0.38)]">
                      <div
                        className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl"
                        aria-hidden
                      >
                        <div className="absolute -left-8 -top-12 h-32 w-32 rounded-full bg-[#2ba8b0]/25 blur-3xl" />
                        <div className="absolute -bottom-10 -right-6 h-28 w-28 rounded-full bg-[#2ba8b0]/10 blur-2xl" />
                      </div>
                      <div className="relative z-[1] px-4 py-4">
                        <p className="text-center text-[0.68rem] font-semibold uppercase leading-snug tracking-[0.26em] text-[#2ba8b0] drop-shadow-[0_0_14px_rgba(43,168,176,0.35)]">
                          {HY_UI.FOOTER_CREATED_BY}
                        </p>
                        <div
                          className="mx-auto my-3.5 h-px w-[5.5rem] max-w-[90%] bg-gradient-to-r from-transparent via-[#2ba8b0] to-transparent opacity-90"
                          aria-hidden
                        />
                        <div className="flex justify-center">
                          <NeetrinoCreditPopover
                            variant="dark"
                            menuAlign="start"
                            logoClassName={NEETRINO_FOOTER_LOGO_MOBILE_CLASS}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex min-w-0 shrink-0 flex-1 justify-end self-start pt-0.5 sm:flex-initial sm:self-center sm:pt-0">
                    <div className="max-sm:rounded-2xl max-sm:border max-sm:border-[#2ba8b0]/35 max-sm:bg-black/40 max-sm:px-2.5 max-sm:py-2 max-sm:shadow-[0_10px_32px_-12px_rgba(43,168,176,0.42)] max-sm:backdrop-blur-sm sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none">
                      <FooterBottomNav
                        alignWithIllustration={false}
                        socialIconImgClassName={FOOTER_SOCIAL_ICON_UNIFY_FILTER_CLASSNAME}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="absolute bottom-0 left-0 right-0 z-10 flex max-w-full flex-wrap items-center justify-start gap-x-6 gap-y-2 px-5 pb-5 pt-4 sm:gap-x-10 lg:gap-x-14 lg:px-10 lg:pb-6 lg:pt-5"
          role="group"
          aria-label="Legal"
        >
          <p className={`${FOOTER_LEGAL_TEXT_CLASS} min-w-0 shrink-0`}>
            © 2026 TOON EXPO. All rights reserved.
          </p>
          <div className="ml-1 hidden min-w-0 shrink-0 flex-row flex-wrap items-center gap-x-3 gap-y-1 sm:ml-2 sm:flex lg:ml-3">
            <p className="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-[#2ba8b0]/85 sm:text-[0.68rem]">
              {HY_UI.FOOTER_CREATED_BY}
            </p>
            <NeetrinoCreditPopover
              variant="dark"
              menuAlign="start"
              logoClassName={NEETRINO_FOOTER_LOGO_CLASS}
            />
          </div>
        </div>
        <div
          className="absolute right-0 bottom-0 h-40 w-[min(100%,1056px)] overflow-hidden opacity-90 lg:h-48 pr-5 lg:pr-10"
          aria-hidden
        >
          <img
            src={FIGMA_ASSETS.footerIllustration}
            alt=""
            className={`absolute right-0 bottom-0 w-[220px] max-w-none origin-bottom-right scale-x-[4.8] scale-y-[1.333] ${FOOTER_ILLUSTRATION_UNIFY_FILTER_CLASSNAME}`}
          />
        </div>
      </footer>
    </>
  );
}
