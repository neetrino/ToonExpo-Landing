"use client";

import { useMemo } from "react";
import Link from "next/link";
import { HomeMapPreview } from "@/features/map/components/HomeMapPreview";
import { buildMapMarkersFromProjects } from "@/features/home/buildMapMarkers";
import type { HomeProject } from "@/features/home/homeProject.types";
import {
  FooterBottomNav,
  ReachOutCta,
  SocialTilesRow,
  VIEW_APARTMENTS_SIDE_ICON_CLASS,
} from "@/features/home/siteReachFooterBlocks";

const FOOTER_LEGAL_TEXT_CLASS =
  "whitespace-nowrap text-xs uppercase leading-snug tracking-[0.14em] text-white/55 sm:text-sm sm:tracking-[0.16em]";
const FOOTER_PRIVACY_LINK_CLASS = `${FOOTER_LEGAL_TEXT_CLASS} shrink-0 transition hover:text-white/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#277691]/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050b10]`;

const FIGMA_ASSETS = {
  footerLogo: "/figma/home/footerLogo.svg",
  footerIllustration: "/figma/home/footerIllustration.svg",
  locationDivider: "/figma/home/locationDivider.svg",
  visitSiteButton: "/figma/home/visitSiteButton.svg",
} as const;

const HOME_TEAL_VISIT_SITE_CLASS =
  "relative inline-flex h-[60px] w-[307px] max-w-full items-center justify-center text-xs font-semibold uppercase tracking-[0.2em] text-[#2ba8b0] transition hover:brightness-110";

/** /p slug — փոքր Visit Site + սոցիալներ */
const PARTICIPANT_TEAL_VISIT_SITE_CLASS =
  "relative inline-flex h-10 w-52 max-w-full shrink-0 items-center justify-center text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-[#2ba8b0] transition hover:brightness-110";

const PARTICIPANT_TEAL_SOCIAL_ICON_CLASS = "h-8 w-8 shrink-0 object-contain";

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
  const footerSite = anchor?.expoFields.expo_field_51?.trim() ?? "";
  const footerInstagram = anchor?.expoFields.expo_field_52?.trim() ?? "";
  const footerFacebook = anchor?.expoFields.expo_field_53?.trim() ?? "";
  const isParticipant = variant === "participant";

  return (
    <>
      <div className="relative isolate bg-[#246976]">
        <section
          id="contacts"
          className="relative z-20 mx-auto max-w-[1680px] scroll-mt-6 px-5 pb-10 pt-10 lg:px-10 lg:pb-14 lg:pt-12"
        >
          <div className="mb-6 flex items-center gap-4">
            <h2 className="text-2xl font-semibold uppercase tracking-[0.12em] text-white lg:text-[2.5rem]">
              Location
            </h2>
            <img src={FIGMA_ASSETS.locationDivider} alt="" className="h-[2px] min-w-0 flex-1 opacity-70" />
          </div>
          <div className="toon-home-map relative z-0 overflow-hidden rounded-[20px] border border-white/20 shadow-[0_25px_60px_rgba(0,0,0,0.2)]">
            <HomeMapPreview markers={markers} className="h-[240px] w-full md:h-[320px]" />
          </div>
        </section>

        <section className="relative z-10 -mt-12 border-t border-white/10 bg-[#2ba8b0] pt-12 lg:-mt-40 lg:pt-40">
          <div className="relative mx-auto max-w-[1680px] px-5 py-10 lg:min-h-[6rem] lg:px-10 lg:py-12">
            {!isParticipant ? (
              <div className="pointer-events-none absolute inset-0 z-[1] hidden items-center justify-center lg:flex">
                <SocialTilesRow
                  facebookUrl={footerFacebook}
                  instagramUrl={footerInstagram}
                  iconClassName={VIEW_APARTMENTS_SIDE_ICON_CLASS}
                  className="pointer-events-auto flex items-center gap-2"
                />
              </div>
            ) : null}
            <div
              className={`relative z-[2] flex flex-col gap-5 lg:flex-row lg:items-center ${isParticipant ? "" : "lg:justify-between"}`}
            >
              <div
                className={`flex flex-wrap items-center ${isParticipant ? "shrink-0 justify-center lg:justify-start" : ""}`}
              >
                <Link
                  href="/#projects"
                  className="text-xl font-semibold uppercase tracking-[0.14em] text-white lg:text-[2rem]"
                >
                  View Apartments
                </Link>
              </div>
              {isParticipant ? (
                <>
                  <div className="flex min-w-0 flex-1 flex-wrap items-center justify-center gap-2 sm:gap-3">
                    {footerSite ? (
                      <a
                        href={footerSite}
                        target="_blank"
                        rel="noreferrer"
                        className={PARTICIPANT_TEAL_VISIT_SITE_CLASS}
                      >
                        <img
                          src={FIGMA_ASSETS.visitSiteButton}
                          alt=""
                          className="absolute inset-0 h-full w-full"
                        />
                        <span className="relative z-10">Visit Site</span>
                      </a>
                    ) : null}
                    <SocialTilesRow
                      facebookUrl={footerFacebook}
                      instagramUrl={footerInstagram}
                      iconClassName={PARTICIPANT_TEAL_SOCIAL_ICON_CLASS}
                      className="flex items-center gap-1.5"
                    />
                  </div>
                  <div className="flex w-full shrink-0 justify-end lg:w-auto">
                    <ReachOutCta className="shrink-0" />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-center lg:hidden">
                    <SocialTilesRow
                      facebookUrl={footerFacebook}
                      instagramUrl={footerInstagram}
                      iconClassName={VIEW_APARTMENTS_SIDE_ICON_CLASS}
                    />
                  </div>
                  <div className="flex flex-wrap items-center justify-end gap-3 sm:gap-4 lg:ml-auto lg:shrink-0">
                    {footerSite ? (
                      <a
                        href={footerSite}
                        target="_blank"
                        rel="noreferrer"
                        className={HOME_TEAL_VISIT_SITE_CLASS}
                      >
                        <img src={FIGMA_ASSETS.visitSiteButton} alt="" className="absolute inset-0 h-full w-full" />
                        <span className="relative z-10">Visit Site</span>
                      </a>
                    ) : null}
                    <ReachOutCta className="shrink-0" />
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      </div>

      <footer className="bg-[#050b10] px-5 py-4 lg:px-10 lg:py-5">
        <div className="mx-auto max-w-[1680px]">
          <div className="flex flex-col gap-4 text-white/70 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex w-full min-w-0 max-w-full flex-col items-start gap-3 sm:gap-4">
              <img src={FIGMA_ASSETS.footerLogo} alt="" className="h-16 w-16 shrink-0 sm:h-20 sm:w-20" />
              <div
                className="flex max-w-full flex-nowrap items-baseline gap-x-7 overflow-x-auto overscroll-x-contain sm:gap-x-10 sm:[scrollbar-width:thin]"
                role="group"
                aria-label="Legal"
              >
                <p className={`${FOOTER_LEGAL_TEXT_CLASS} shrink-0`}>
                  © 2026 TOON EXPO. All rights reserved.
                </p>
                <Link href="/privacy" className={FOOTER_PRIVACY_LINK_CLASS}>
                  Privacy policy
                </Link>
              </div>
            </div>
            <div className="flex w-full flex-col items-center gap-3 lg:w-[min(100%,min(90vw,640px))] lg:shrink-0 lg:items-end">
              <FooterBottomNav
                facebookUrl={footerFacebook}
                instagramUrl={footerInstagram}
                alignWithIllustration
              />
              <img
                src={FIGMA_ASSETS.footerIllustration}
                alt=""
                className="w-full max-w-[220px] opacity-90 lg:ml-0 lg:mr-0"
              />
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
