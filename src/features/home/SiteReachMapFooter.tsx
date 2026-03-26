/* eslint-disable @next/next/no-img-element */
"use client";

import { useMemo } from "react";
import { HomeMapPreviewDynamic } from "@/features/map/components/HomeMapPreviewDynamic";
import { LazyWhenVisible } from "@/features/map/components/LazyWhenVisible";
import { buildMapMarkersFromProjects } from "@/features/home/buildMapMarkers";
import type { HomeProject } from "@/features/home/homeProject.types";
import { FooterEvolverCreditCard } from "@/features/home/components/FooterEvolverCreditCard";
import { FooterNeetrinoCreditCard } from "@/features/home/components/FooterNeetrinoCreditCard";
import { FooterBottomNav, ReachOutCta, SocialTilesRow } from "@/features/home/siteReachFooterBlocks";
import { toExternalHref } from "@/features/landing/mobile/landingPage.helpers";
import { PROJECT_FIELD } from "@/shared/constants/expoFieldKeys";
import {
  FOOTER_ILLUSTRATION_UNIFY_FILTER_CLASSNAME,
  FOOTER_OUTLINE_BORDER_CLASSNAME,
  FOOTER_SOCIAL_ICON_UNIFY_FILTER_CLASSNAME,
} from "@/shared/constants/footerBrand.constants";
import {
  FOOTER_PARTNER_LOGO_IMG_BOX_DARK,
  FOOTER_PARTNER_LOGO_IMG_TRANSITION_DARK,
} from "@/shared/constants/footerPartnerLogo.constants";
import { EVOLVER_LOGO_FOOTER_CLASSNAME_DARK } from "@/shared/constants/evolverCredit.constants";
import { NEETRINO_LOGO_FOOTER_WHITE_FILTER_CLASSNAME } from "@/shared/constants/neetrinoCredit.constants";
import { HY_UI } from "@/shared/i18n/hyUi.constants";
import { publicAssetUrl } from "@/shared/lib/publicAssetUrl";

const FOOTER_LEGAL_TEXT_CLASS =
  "whitespace-nowrap text-xs uppercase leading-snug tracking-[0.14em] text-white/55 sm:text-sm sm:tracking-[0.16em]";

/** Neetrino լոգո — նույն տուփի չափեր, ինչ Evolver (տե՛ս `footerPartnerLogo.constants`)։ */
const NEETRINO_FOOTER_LOGO_CLASS = [
  FOOTER_PARTNER_LOGO_IMG_BOX_DARK,
  NEETRINO_LOGO_FOOTER_WHITE_FILTER_CLASSNAME,
  FOOTER_PARTNER_LOGO_IMG_TRANSITION_DARK,
].join(" ");

const FOOTER_NAV_PILL_CLASS = [
  "rounded-lg bg-black px-2.5 py-2 sm:px-3.5 sm:py-2.5 lg:px-4 lg:py-3",
  FOOTER_OUTLINE_BORDER_CLASSNAME,
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
  const footerPhoneRaw = isParticipant
    ? (anchor?.expoFields[F.phone]?.trim() ?? "").split(/[\n,]/)[0].trim()
    : "";
  const footerPhone = footerPhoneRaw.replace(/\s/g, "");
  const footerPhoneDisplay = footerPhoneRaw;

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
                  {footerPhone ? (
                    <div className="flex flex-col items-end gap-1.5">
                      <a
                        href={`tel:${footerPhone}`}
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#e8192c] px-5 py-2.5 text-[0.7rem] font-extrabold uppercase tracking-[0.14em] text-white shadow-[0_4px_18px_rgba(232,25,44,0.4)] transition hover:brightness-110"
                      >
                        <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 shrink-0">
                          <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.36 11.36 0 003.56.57 1 1 0 011 1V21a1 1 0 01-1 1A17 17 0 013 5a1 1 0 011-1h3.5a1 1 0 011 1 11.36 11.36 0 00.57 3.56 1 1 0 01-.25 1.01l-2.2 2.22z"/>
                        </svg>
                        {HY_UI.CTA_CALL_US}
                      </a>
                      <span className="text-[0.7rem] font-semibold tracking-[0.06em] text-white/80">
                        {footerPhoneDisplay}
                      </span>
                    </div>
                  ) : (
                    <ReachOutCta className="shrink-0" />
                  )}
                </div>
              </div>
            </div>
          </section>
        ) : null}
      </div>

      <footer className="relative flex min-h-[20rem] flex-col bg-black px-5 py-[5.2rem] lg:min-h-[24rem] lg:px-10 lg:py-[6.5rem]">
        <div className="relative mx-auto flex flex-1 min-h-0 w-full max-w-[1680px] flex-col">
          <div className="flex flex-1 flex-col">
            <div className="flex flex-col gap-8 text-white/70 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
              <img
                src={FIGMA_ASSETS.footerLogo}
                alt="Toon Expo"
                className="-mt-8 hidden h-32 w-32 shrink-0 sm:block sm:h-40 sm:w-40 lg:-mt-12"
              />
              <div className="-mt-8 flex min-w-0 flex-1 flex-col lg:-mt-12">
                <div className="flex w-full min-w-0 flex-row flex-wrap items-stretch justify-end gap-x-3 gap-y-3 sm:gap-x-4 lg:gap-4">
                  <div className="flex min-w-0 shrink-0 self-stretch overflow-visible">
                    <div className="flex flex-wrap items-stretch gap-2 sm:gap-3">
                      <FooterNeetrinoCreditCard
                        logoClassName={NEETRINO_FOOTER_LOGO_CLASS}
                        menuAlign="start"
                        className="h-full min-h-0"
                      />
                      <FooterEvolverCreditCard
                        logoClassName={EVOLVER_LOGO_FOOTER_CLASSNAME_DARK}
                        className="h-full min-h-0"
                      />
                    </div>
                  </div>
                  <div className="flex min-w-0 shrink-0 self-stretch">
                    <div
                      className={`flex h-full min-h-0 items-center ${FOOTER_NAV_PILL_CLASS}`}
                    >
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
