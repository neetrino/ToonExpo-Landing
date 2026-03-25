"use client";

import { useMemo } from "react";
import { buildMapMarkersFromProjects } from "@/features/home/mobile/buildMapMarkers";
import { HomeMapPreviewDynamic } from "@/features/map/components/HomeMapPreviewDynamic";
import { LazyWhenVisible } from "@/features/map/components/LazyWhenVisible";
import type { HomeProject } from "@/features/home/mobile/homeProject.types";
import {
  MOBILE_CONTACT_EMAIL,
  MOBILE_SECTION_INSET,
} from "@/features/landing/mobile/landingPage.constants";
import { toExternalHref } from "@/features/landing/mobile/landingPage.helpers";
import { PROJECT_FIELD } from "@/shared/constants/expoFieldKeys";
import { NeetrinoCreditPopover } from "@/features/home/components/NeetrinoCreditPopover";
import { HY_UI } from "@/shared/i18n/hyUi.constants";

export type SiteReachMapFooterVariant = "home" | "participant";

export function SiteReachMapFooter({
  projects,
  variant = "home",
}: {
  projects: HomeProject[];
  variant?: SiteReachMapFooterVariant;
}) {
  const anchor = projects[0] ?? null;
  const markers = useMemo(() => buildMapMarkersFromProjects(projects), [projects]);
  const footerSite = toExternalHref(anchor?.expoFields[PROJECT_FIELD.website]);
  const footerHref = footerSite || "#top";

  return (
    <>
      <section id="contacts" className={`${MOBILE_SECTION_INSET} pt-9`}>
        <h2 className="text-[20px] font-bold leading-7 text-[#101828]">{HY_UI.HOME_LOCATION}</h2>
        <div className="toon-home-map mt-7 overflow-visible rounded-[10px] border border-[#246976]/12 shadow-[0_8px_24px_rgba(16,24,40,0.08)] [--toon-map-corner-radius:10px]">
          <LazyWhenVisible
            className="h-64 w-full"
            fallback={
              <div className="h-full w-full bg-[#1d5662]/30 animate-pulse" aria-hidden />
            }
          >
            <HomeMapPreviewDynamic markers={markers} className="h-full w-full" />
          </LazyWhenVisible>
        </div>
        {variant === "participant" ? (
          <a
            href={footerHref}
            target={footerSite ? "_blank" : undefined}
            rel={footerSite ? "noreferrer" : undefined}
            className="mt-5 inline-flex h-14 w-full items-center justify-center rounded-[10px] bg-[#2ba8b0] text-[16px] font-bold uppercase tracking-[0.02em] text-white"
          >
            {HY_UI.CTA_VISIT_SITE}
          </a>
        ) : null}
      </section>

      <footer className="px-5 pb-8 pt-8 text-center">
        <div className="space-y-2">
          <p className="text-[14px] font-semibold uppercase leading-5 tracking-[-0.1504px] text-black">{HY_UI.HOME_CONTACT}</p>
          <p className="text-[14px] leading-5 tracking-[-0.1504px] text-black/80">{MOBILE_CONTACT_EMAIL}</p>
        </div>
        <div className="mt-6 flex flex-row flex-wrap items-center justify-center gap-x-3 gap-y-1 border-t border-black/15 pt-6">
          <NeetrinoCreditPopover
            variant="light"
            menuAlign="center"
            logoClassName="h-[0.91rem] w-auto max-w-[51px] object-contain opacity-50 transition-[filter,opacity,transform,box-shadow] duration-200 ease-out group-hover:opacity-100 group-hover:brightness-120 group-hover:drop-shadow-[0_0_12px_rgba(43,168,176,0.75)] group-hover:ring-1 group-hover:ring-[#2ba8b0]/45 group-active:scale-[0.98]"
          />
        </div>
        <div className="mt-4 border-t border-black/20 pt-4">
          <p className="text-[12px] leading-4 text-black/60">© 2026 Toon Expo. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
