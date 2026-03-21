"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { isFieldNonEmpty } from "@/shared/lib/expoFields";
import { LandingPageLower } from "@/features/landing/mobile/LandingPageLower";
import { visibleBlocks, type ExpoMap } from "@/features/landing/mobile/lib/blockVisibility";
import {
  firstNonEmpty,
  getHeroMedia,
  getLandingTitle,
  getLeadText,
  getMobileStats,
  getLogoUrl,
  getProjectMedia,
  splitParagraphs,
} from "@/features/landing/mobile/landingPage.helpers";
import { MOBILE_SECTION_INSET, participantFigmaAssets } from "@/features/landing/mobile/landingPage.constants";
import { MobileLandingStickyHeader } from "@/features/landing/mobile/MobileLandingStickyHeader";

type Props = {
  fields: ExpoMap;
};

const MOBILE_NAV_ITEMS = [
  { id: "about", label: "About", block: "about" },
  { id: "investment", label: "Investment", block: "investment" },
  { id: "gallery", label: "Gallery", block: "gallery" },
  { id: "options", label: "Apartments", block: "hero" },
  { id: "payment", label: "Payment", block: "payment" },
  { id: "contacts", label: "Location", block: "location" },
] as const;

function MobileStatCard({
  value,
  label,
  tone,
}: {
  value: string;
  label: string;
  tone: "teal" | "gold" | "navy";
}) {
  const toneClass =
    tone === "gold"
      ? "bg-[#ffd24d] text-black"
      : tone === "navy"
        ? "bg-[#192643] text-white"
        : "bg-[#2ba8b0] text-white";
  const valueClass = tone === "navy" ? "text-[#2ba8b0]" : "";

  return (
    <div className={`flex-1 rounded-[14px] px-4 py-4 shadow-[0_4px_6px_rgba(0,0,0,0.07)] ${toneClass}`}>
      <p className={`text-center text-2xl font-bold leading-8 ${valueClass}`}>{value}</p>
      <p className="mt-1 text-center text-[12px] uppercase leading-4 opacity-90">{label}</p>
    </div>
  );
}

export function LandingPage({ fields }: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const vis = visibleBlocks(fields);
  const title = getLandingTitle(fields);
  const media = getProjectMedia(fields);
  const heroBg = getHeroMedia(fields) || participantFigmaAssets.heroBackground;
  const heroLogo = getLogoUrl(fields) || participantFigmaAssets.fallbackLogo;
  const aboutParagraphs = splitParagraphs(fields.expo_field_34);
  const leadText = getLeadText(fields);
  const rawAboutText = aboutParagraphs[0] ?? "";
  const hasDenseListCopy = (rawAboutText.match(/,/g) ?? []).length > 3 || rawAboutText.length > 120;
  const heroLead =
    leadText.length > 40 || (leadText.match(/,/g) ?? []).length > 2
      ? "Discover the joy again!"
      : leadText;
  const heroSummary = hasDenseListCopy
    ? "Premium residential project with strong investment potential and comfortable urban living."
    : firstNonEmpty(rawAboutText, "Premium residential project with strong investment potential and comfortable urban living.");
  const addressText = isFieldNonEmpty(fields.expo_field_03) ? fields.expo_field_03 : "";
  const aboutText = firstNonEmpty(
    hasDenseListCopy ? "" : rawAboutText,
    addressText ? `${title} is a residential project located at ${addressText}.` : "",
    "Modern residential project designed for comfortable living and long-term value.",
  );
  const aboutPrimaryImage = media[1] || participantFigmaAssets.aboutPrimary;
  const aboutSecondaryImage = media[2] || media[1] || participantFigmaAssets.aboutSecondary;
  const stats = getMobileStats(fields);
  const menuItems = useMemo(
    () =>
      MOBILE_NAV_ITEMS.filter((item) => {
        if (item.id === "options") {
          return Boolean(fields.expo_field_06?.trim());
        }

        return vis[item.block];
      }),
    [fields.expo_field_06, vis],
  );

  useEffect(() => {
    if (!isMenuOpen) {
      document.body.style.removeProperty("overflow");
      return;
    }

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.removeProperty("overflow");
    };
  }, [isMenuOpen]);

  return (
    <div className="overflow-x-hidden bg-white text-[#101828]">
      <MobileLandingStickyHeader onMenuClick={() => setIsMenuOpen(true)} />
      <section className="relative h-[500px] overflow-hidden text-white">
        <img src={heroBg} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/35 to-black/70" />
        {isMenuOpen &&
          createPortal(
            <div className="fixed inset-0 z-[10002] flex flex-col bg-[#050b10] pt-[env(safe-area-inset-top)] pb-[max(5.5rem,env(safe-area-inset-bottom))]">
              <div className={`flex min-h-0 flex-1 flex-col ${MOBILE_SECTION_INSET}`}>
                <div className="flex shrink-0 items-center justify-between pt-4">
                  <Link
                    href="/"
                    aria-label="Go to home page"
                    className="inline-flex"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <img src={participantFigmaAssets.headerLogo} alt="Toon Expo" className="h-9 w-9" />
                  </Link>
                  <button
                    type="button"
                    aria-label="Close mobile menu"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-white/25 bg-white/12 text-lg leading-none text-white"
                  >
                    ×
                  </button>
                </div>

                <div className="flex min-h-0 flex-1 flex-col overflow-y-auto py-3">
                  <nav className="w-full shrink-0 rounded-2xl border border-white/18 bg-white/10 px-4 py-4 shadow-[0_12px_40px_rgba(0,0,0,0.25)]">
                    <div className="mb-2 text-[10px] font-medium uppercase tracking-[0.2em] text-white/60">
                      Navigation
                    </div>
                    <div className="flex flex-col gap-2">
                      {menuItems.map((item) => (
                        <a
                          key={item.id}
                          href={`#${item.id}`}
                          onClick={() => setIsMenuOpen(false)}
                          className="rounded-xl border border-white/10 bg-white/6 px-3 py-2.5 text-[15px] font-semibold uppercase tracking-[0.03em] text-white transition hover:bg-white/12"
                        >
                          {item.label}
                        </a>
                      ))}
                    </div>
                  </nav>
                </div>
              </div>
            </div>,
            document.body,
          )}

        <div
          className={`relative z-10 flex h-full min-h-0 flex-col gap-4 ${MOBILE_SECTION_INSET} pt-[calc(0.75rem+3.25rem+max(1.25rem,env(safe-area-inset-top)))] pb-[max(1.5rem,env(safe-area-inset-bottom))]`}
        >
          <div className="relative flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto overscroll-contain text-center">
            <img
              src={heroLogo}
              alt=""
              className="absolute top-[2px] h-[105px] w-[133px] object-contain"
            />
            <h1 className="mt-20 max-w-[288px] text-[30px] font-bold uppercase leading-[1.25]">
              {title}
            </h1>
            <p className="mt-2 text-[18px] font-light leading-7">{heroLead}</p>
            <p className="mt-2 max-w-[338px] text-[14px] leading-5 text-white/90">{heroSummary}</p>
            {addressText ? (
              <p className="mt-2 max-w-[338px] text-[14px] leading-5 text-white/90">{addressText}</p>
            ) : null}
          </div>

          <a
            href="#options"
            className="inline-flex h-14 w-full shrink-0 items-center justify-center rounded-[10px] bg-[#2ba8b0] text-[16px] font-bold uppercase tracking-[0.02em] text-white"
          >
            View Apartments
          </a>
        </div>
      </section>

      <section className={`${MOBILE_SECTION_INSET} relative z-10 -mt-[7px]`}>
        <div className="flex gap-3">
          {stats.map((item) => (
            <MobileStatCard key={item.label} value={item.value} label={item.label} tone={item.tone} />
          ))}
        </div>
      </section>

      {vis.about ? (
        <section id="about" className={`${MOBILE_SECTION_INSET} pt-12`}>
          <div className="rounded-[16px] border border-[#f3f4f6] bg-white p-5 shadow-[0_2px_14px_rgba(34,33,33,0.1)]">
            <h2 className="text-[20px] font-bold uppercase leading-7 text-[#2ba8b0]">About the Project</h2>
            <p className="mt-3 max-w-[296px] text-[14px] leading-[1.625] text-[#1e2939]">{aboutText}</p>
            <a
              href="#investment"
              className="mt-3 inline-flex items-center gap-1.5 text-[14px] font-semibold uppercase leading-5 text-[#2ba8b0]"
            >
              Read More
              <img src={participantFigmaAssets.readMoreIcon} alt="" className="h-4 w-4" />
            </a>
          </div>
        </section>
      ) : null}

      <section className={`${MOBILE_SECTION_INSET} flex flex-col gap-4 pt-11`}>
        <div className="overflow-hidden rounded-[16px] shadow-[0_4px_6px_rgba(0,0,0,0.1)]">
          <img src={aboutPrimaryImage} alt="" className="h-64 w-full object-cover" />
        </div>
        <div className="overflow-hidden rounded-[16px]">
          <img src={aboutSecondaryImage} alt="" className="h-56 w-full object-cover" />
        </div>
      </section>

      <LandingPageLower fields={fields} title={title} />
    </div>
  );
}
