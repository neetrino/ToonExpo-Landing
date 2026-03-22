"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
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
import {
  MOBILE_HERO_PROJECT_LOGO_BOX_CLASS,
  MOBILE_HERO_PROJECT_LOGO_IMG_CLASS,
} from "@/features/landing/landingPage.constants";
import {
  MOBILE_HERO_READ_FULL_LABEL_HY,
  MOBILE_PARTICIPANT_HERO_INSET_TOP_CLASS,
  MOBILE_SECTION_INSET,
  participantFigmaAssets,
} from "@/features/landing/mobile/landingPage.constants";
import { MobileLandingNavMenu } from "@/features/landing/mobile/MobileLandingNavMenu";
import { MobileLandingStickyHeader } from "@/features/landing/mobile/MobileLandingStickyHeader";
import type { ResolvedProjectFolderMedia } from "@/features/landing/lib/projectFolderMedia.types";
import { HY_UI } from "@/shared/i18n/hyUi.constants";

type Props = {
  fields: ExpoMap;
  folderMedia: ResolvedProjectFolderMedia | null;
};

const MOBILE_NAV_ITEMS = [
  { id: "about", label: HY_UI.NAV_ABOUT, block: "about" },
  { id: "investment", label: HY_UI.NAV_INVESTMENT, block: "investment" },
  { id: "gallery", label: HY_UI.NAV_GALLERY, block: "gallery" },
  { id: "options", label: HY_UI.NAV_APARTMENTS, block: "hero" },
  { id: "payment", label: HY_UI.NAV_PAYMENT, block: "payment" },
  { id: "contacts", label: HY_UI.NAV_LOCATION, block: "location" },
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

export function LandingPage({ fields, folderMedia }: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHeroReadFullOpen, setIsHeroReadFullOpen] = useState(false);
  const [heroShowReadFull, setHeroShowReadFull] = useState(false);
  const heroTextBlockRef = useRef<HTMLParagraphElement>(null);
  const vis = visibleBlocks(fields);
  const galleryFromFolder = (folderMedia?.galleryUrls.length ?? 0) > 0;
  const title = getLandingTitle(fields);
  const media = getProjectMedia(fields);
  const heroBg =
    folderMedia?.heroUrl || getHeroMedia(fields) || participantFigmaAssets.heroBackground;
  const heroLogoUrl = firstNonEmpty(folderMedia?.logoUrl, getLogoUrl(fields));
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
  const aboutPrimaryImage =
    folderMedia?.aboutLargeUrl || media[1] || media[0] || participantFigmaAssets.aboutPrimary;
  const aboutInteriorOneOverlayUrl = folderMedia?.aboutSmallUrl ?? null;
  const stats = getMobileStats(fields);
  const menuItems = useMemo(
    () =>
      MOBILE_NAV_ITEMS.filter((item) => {
        if (item.id === "options") {
          return Boolean(fields.expo_field_06?.trim());
        }
        if (item.block === "gallery") {
          return vis.gallery || galleryFromFolder;
        }

        return vis[item.block];
      }),
    [fields.expo_field_06, galleryFromFolder, vis],
  );

  useEffect(() => {
    if (!isMenuOpen && !isHeroReadFullOpen) {
      document.body.style.removeProperty("overflow");
      return;
    }

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.removeProperty("overflow");
    };
  }, [isMenuOpen, isHeroReadFullOpen]);

  useLayoutEffect(() => {
    setHeroShowReadFull(false);
  }, [title, heroLead, heroSummary, addressText]);

  useLayoutEffect(() => {
    const el = heroTextBlockRef.current;
    if (!el) {
      return;
    }

    let observer: ResizeObserver | null = null;

    const checkOverflow = () => {
      if (el.scrollHeight > el.clientHeight + 1) {
        setHeroShowReadFull(true);
      }
    };

    const frameId = window.requestAnimationFrame(() => {
      checkOverflow();
      observer = new ResizeObserver(checkOverflow);
      observer.observe(el);
    });

    return () => {
      window.cancelAnimationFrame(frameId);
      observer?.disconnect();
    };
  }, [title, heroLead, heroSummary, addressText]);

  useEffect(() => {
    if (!isHeroReadFullOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsHeroReadFullOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isHeroReadFullOpen]);

  return (
    <div className="overflow-x-hidden bg-white text-[#101828]">
      <MobileLandingStickyHeader onMenuClick={() => setIsMenuOpen(true)} />
      <MobileLandingNavMenu
        open={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        items={menuItems}
      />
      <section className="relative h-[500px] overflow-hidden text-white">
        <img src={heroBg} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/35 to-black/70" />

        <div
          className={`relative z-10 flex h-full min-h-0 flex-col gap-4 ${MOBILE_SECTION_INSET} ${MOBILE_PARTICIPANT_HERO_INSET_TOP_CLASS} pb-[max(1.5rem,env(safe-area-inset-bottom))]`}
        >
          <div className="relative flex min-h-0 min-w-0 flex-1 flex-col items-center justify-start overflow-hidden pt-1 text-center">
            {heroLogoUrl ? (
              <div className={`${MOBILE_HERO_PROJECT_LOGO_BOX_CLASS} mb-6 shrink-0`}>
                <img src={heroLogoUrl} alt="" className={MOBILE_HERO_PROJECT_LOGO_IMG_CLASS} />
              </div>
            ) : null}
            <h1 className="w-full min-w-0 max-w-full shrink-0 break-words text-[clamp(1.125rem,5.2vw,1.875rem)] font-bold uppercase leading-[1.2]">
              {title}
            </h1>
            <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden">
              <p
                ref={heroTextBlockRef}
                className={`mt-2 min-h-0 w-full min-w-0 flex-1 overflow-hidden break-words text-center [overflow-wrap:anywhere] ${
                  heroShowReadFull ? "line-clamp-[6]" : ""
                }`}
              >
                <span className="font-light text-[clamp(0.9375rem,4vw,1.125rem)] leading-snug">{heroLead}</span>
                <br />
                <span className="text-[clamp(0.75rem,3.5vw,0.875rem)] leading-5 text-white/90">{heroSummary}</span>
                {addressText ? (
                  <>
                    <br />
                    <span className="text-[clamp(0.75rem,3.5vw,0.875rem)] leading-5 text-white/90">{addressText}</span>
                  </>
                ) : null}
              </p>
              {heroShowReadFull ? (
                <button
                  type="button"
                  onClick={() => setIsHeroReadFullOpen(true)}
                  className="mt-2 inline-flex shrink-0 items-center justify-center gap-2 self-center rounded-full border border-white/35 bg-white/12 px-4 py-2.5 text-[13px] font-semibold text-white shadow-[0_8px_24px_rgba(0,0,0,0.2)] backdrop-blur-md transition active:scale-[0.98]"
                >
                  {MOBILE_HERO_READ_FULL_LABEL_HY}
                  <img src={participantFigmaAssets.readMoreIcon} alt="" className="h-4 w-4 opacity-90" />
                </button>
              ) : null}
            </div>
          </div>

          <a
            href="#options"
            className="inline-flex h-14 w-full shrink-0 items-center justify-center rounded-[10px] bg-[#2ba8b0] text-[16px] font-bold uppercase tracking-[0.02em] text-white"
          >
            {HY_UI.CTA_VIEW_APARTMENTS}
          </a>
        </div>

        {isHeroReadFullOpen
          ? createPortal(
              <div
                className="fixed inset-0 z-[10001] flex items-end justify-center p-4 pt-[env(safe-area-inset-top)] pb-[max(1rem,env(safe-area-inset-bottom))] sm:items-center"
                role="dialog"
                aria-modal="true"
                aria-labelledby="mobile-hero-read-full-title"
              >
                <button
                  type="button"
                  aria-label={HY_UI.ARIA_CLOSE_FULLTEXT}
                  className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
                  onClick={() => setIsHeroReadFullOpen(false)}
                />
                <div className="relative z-10 flex max-h-[min(85vh,720px)] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#0b1220]/94 shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
                  <div className="flex shrink-0 items-start justify-between gap-3 border-b border-white/10 px-5 pb-3 pt-4">
                    <p
                      id="mobile-hero-read-full-title"
                      className="min-w-0 flex-1 text-left text-[15px] font-bold uppercase leading-snug text-white"
                    >
                      {title}
                    </p>
                    <button
                      type="button"
                      aria-label={HY_UI.ARIA_CLOSE}
                      onClick={() => setIsHeroReadFullOpen(false)}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-lg leading-none text-white transition hover:bg-white/16"
                    >
                      ×
                    </button>
                  </div>
                  <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-5 pt-3 text-left">
                    <p className="text-[15px] font-light leading-relaxed text-white/95">{heroLead}</p>
                    <p className="mt-3 text-[14px] leading-relaxed text-white/88">{heroSummary}</p>
                    {addressText ? (
                      <p className="mt-3 text-[14px] leading-relaxed text-white/88">{addressText}</p>
                    ) : null}
                  </div>
                </div>
              </div>,
              document.body,
            )
          : null}
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
            <h2 className="text-[20px] font-bold uppercase leading-7 text-[#2ba8b0]">{HY_UI.MOBILE_ABOUT_SECTION}</h2>
            <p className="mt-3 max-w-[296px] text-[14px] leading-[1.625] text-[#1e2939]">{aboutText}</p>
            <a
              href="#investment"
              className="mt-3 inline-flex items-center gap-1.5 text-[14px] font-semibold uppercase leading-5 text-[#2ba8b0]"
            >
              {HY_UI.CTA_READ_MORE}
              <img src={participantFigmaAssets.readMoreIcon} alt="" className="h-4 w-4" />
            </a>
          </div>
        </section>
      ) : null}

      <section className={`${MOBILE_SECTION_INSET} flex flex-col gap-4 pt-11`}>
        <div className="overflow-hidden rounded-[16px] shadow-[0_4px_6px_rgba(0,0,0,0.1)]">
          <img src={aboutPrimaryImage} alt="" className="h-64 w-full object-cover" />
        </div>
        {aboutInteriorOneOverlayUrl ? (
          <div className="overflow-hidden rounded-[16px]">
            <img src={aboutInteriorOneOverlayUrl} alt="" className="h-56 w-full object-cover" />
          </div>
        ) : null}
      </section>

      <LandingPageLower fields={fields} title={title} folderMedia={folderMedia} />
    </div>
  );
}
