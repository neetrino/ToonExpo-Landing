"use client";

import { useMemo } from "react";
import { buildMapMarkersFromProjects } from "@/features/home/mobile/buildMapMarkers";
import { HomeMapPreview } from "@/features/home/mobile/HomeMapPreview";
import type { HomeProject } from "@/features/home/mobile/homeProject.types";
import {
  MOBILE_CONTACT_EMAIL,
  MOBILE_SECTION_INSET,
} from "@/features/landing/mobile/landingPage.constants";
import { toExternalHref } from "@/features/landing/mobile/landingPage.helpers";

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
  const footerSite = toExternalHref(anchor?.expoFields.expo_field_51);
  const footerHref = footerSite || "#top";

  return (
    <>
      <section id="contacts" className={`${MOBILE_SECTION_INSET} pt-9`}>
        <h2 className="text-[20px] font-bold leading-7 text-[#101828]">Location</h2>
        <div className="toon-home-map mt-7 overflow-hidden rounded-[10px] border border-[#246976]/12 shadow-[0_8px_24px_rgba(16,24,40,0.08)]">
          <HomeMapPreview markers={markers} className="h-64 w-full" />
        </div>
        {variant === "participant" ? (
          <a
            href={footerHref}
            target={footerSite ? "_blank" : undefined}
            rel={footerSite ? "noreferrer" : undefined}
            className="mt-5 inline-flex h-14 w-full items-center justify-center rounded-[10px] bg-[#2ba8b0] text-[16px] font-bold uppercase tracking-[0.02em] text-white"
          >
            Visit Site
          </a>
        ) : null}
      </section>

      <footer className="px-5 pb-8 pt-8 text-center">
        <div className="space-y-2">
          <p className="text-[14px] font-semibold uppercase leading-5 tracking-[-0.1504px] text-black">Contact</p>
          <p className="text-[14px] leading-5 tracking-[-0.1504px] text-black/80">{MOBILE_CONTACT_EMAIL}</p>
        </div>
        <div className="mt-4 border-t border-black/20 pt-4">
          <p className="text-[12px] leading-4 text-black/60">© 2026 Toon Expo. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
