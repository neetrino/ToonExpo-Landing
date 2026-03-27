"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CalendarClock, CircleDollarSign, Images, Ruler } from "lucide-react";
import { isFieldNonEmpty } from "@/shared/lib/expoFields";
import { PROJECT_FIELD } from "@/shared/constants/expoFieldKeys";
import { LandingPageLower } from "@/features/landing/mobile/LandingPageLower";
import { visibleBlocks, type ExpoMap } from "@/features/landing/mobile/lib/blockVisibility";
import {
  firstNonEmpty,
  getHeroMedia,
  getLandingTitle,
  getLeadText,
  getLogoUrl,
  getProjectMedia,
  splitParagraphs,
} from "@/features/landing/mobile/landingPage.helpers";
import { LANDING_LUCIDE_STROKE } from "@/features/landing/lib/lucideLandingStyle";
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
import { ContactFabMenu } from "@/features/landing/components/ContactFabMenu";
import type { ResolvedProjectFolderMedia } from "@/features/landing/lib/projectFolderMedia.types";
import { HY_UI } from "@/shared/i18n/hyUi.constants";
import { formatPriceMinForDisplay } from "@/shared/lib/formatPriceMinDisplay";

type Props = {
  fields: ExpoMap;
  folderMedia: ResolvedProjectFolderMedia | null;
  projectSlug: string;
  projectName: string;
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
  Icon,
  tone,
}: {
  value: string;
  label: string;
  Icon: typeof CalendarClock;
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
    <div className={`flex-1 rounded-[14px] px-3 py-3 shadow-[0_4px_6px_rgba(0,0,0,0.07)] ${toneClass}`}>
      <div className="flex justify-center">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/10">
          <Icon aria-hidden className="h-4.5 w-4.5" strokeWidth={LANDING_LUCIDE_STROKE} />
        </span>
      </div>
      <p className={`mt-1 text-center text-[clamp(1.2rem,4.2vw,1.65rem)] font-bold leading-[1.08] tracking-[-0.005em] ${valueClass}`}>
        {value}
      </p>
      <p className="mt-1 text-center text-[10px] uppercase leading-[1.15] opacity-90">{label}</p>
    </div>
  );
}

function getAreaStartValue(raw: string | undefined): string {
  const match = raw?.match(/\d+(?:[.,]\d+)?/);
  if (!match) {
    return "";
  }
  return `${match[0].replace(",", ".")} m²`;
}

function getPriceStartValue(raw: string | undefined): string {
  const formatted = formatPriceMinForDisplay(raw);
  if (!formatted) {
    return "";
  }
  return formatted.replace(/\s*֏/g, "").trim();
}

function getCompletionYearValue(raw: string | undefined): string {
  const value = raw?.trim() ?? "";
  if (!value) {
    return "";
  }
  const yearMatch = value.match(/\d{4}/);
  if (yearMatch?.[0]) {
    return yearMatch[0];
  }
  return value;
}

export function LandingPage({ fields, folderMedia, projectSlug, projectName }: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHeroReadFullOpen, setIsHeroReadFullOpen] = useState(false);
  const [heroShowReadFull, setHeroShowReadFull] = useState(false);
  const heroTextBlockRef = useRef<HTMLParagraphElement>(null);
  const vis = visibleBlocks(fields);
  const galleryFromFolder = (folderMedia?.galleryUrls.length ?? 0) > 0;
  const canOpenGallery = vis.gallery || galleryFromFolder;
  const title = getLandingTitle(fields);
  const media = getProjectMedia(fields);
  const heroBg = folderMedia?.heroUrl || getHeroMedia(fields) || null;
  const heroLogoUrl = firstNonEmpty(folderMedia?.logoUrl, getLogoUrl(fields));
  const F = PROJECT_FIELD;
  const aboutParagraphs = splitParagraphs(fields[F.description]);
  const leadText = getLeadText(fields);
  const desc = fields[F.description]?.trim() ?? "";
  const rawAboutText = aboutParagraphs[0] ?? "";
  const hasDenseListCopy = (rawAboutText.match(/,/g) ?? []).length > 3 || rawAboutText.length > 120;
  const heroLead =
    leadText.length > 40 || (leadText.match(/,/g) ?? []).length > 2
      ? "Discover the joy again!"
      : leadText;
  const heroSummary = hasDenseListCopy
    ? "Premium residential project with strong investment potential and comfortable urban living."
    : firstNonEmpty(rawAboutText, "Premium residential project with strong investment potential and comfortable urban living.");
  const addressText = isFieldNonEmpty(fields[F.shortName]) ? fields[F.shortName] : "";
  const aboutText = firstNonEmpty(desc, leadText);
  const aboutPrimaryImage =
    folderMedia?.aboutLargeUrl || media[1] || media[0] || null;
  const aboutInteriorOneOverlayUrl = folderMedia?.aboutSmallUrl ?? null;
  const keyMetrics = [
    {
      value: firstNonEmpty(getCompletionYearValue(fields[F.completion]), HY_UI.ON_REQUEST),
      label: HY_UI.INVEST_CARD_COMPLETION,
      tone: "teal" as const,
      Icon: CalendarClock,
    },
    {
      value: firstNonEmpty(getAreaStartValue(fields[F.areas]), HY_UI.ON_REQUEST),
      label: HY_UI.INVEST_CARD_AREAS,
      tone: "gold" as const,
      Icon: Ruler,
    },
    {
      value: firstNonEmpty(getPriceStartValue(fields[F.priceMin]), HY_UI.ON_REQUEST),
      label: HY_UI.HOME_CARD_MIN_PRICE_PER_SQM,
      tone: "navy" as const,
      Icon: CircleDollarSign,
    },
  ];
  const mobileSpecialOffer = fields[F.specialOffer]?.trim() ?? "";
  const menuItems = useMemo(
    () =>
      MOBILE_NAV_ITEMS.filter((item) => {
        if (item.id === "options") {
          return Boolean(fields[F.areas]?.trim());
        }
        if (item.block === "gallery") {
          return vis.gallery || galleryFromFolder;
        }

        return vis[item.block];
      }),
    [fields, galleryFromFolder, vis],
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
        {heroBg ? (
          <img src={heroBg} alt="" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-black" aria-hidden />
        )}
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

          <button
            type="button"
            onClick={() => {
              if (canOpenGallery) {
                window.dispatchEvent(new CustomEvent("toon:open-mobile-gallery"));
                return;
              }
              const optionsSection = document.getElementById("options");
              optionsSection?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className="inline-flex h-14 w-full shrink-0 items-center justify-center gap-2 rounded-[10px] bg-[#2ba8b0] text-[16px] font-bold uppercase tracking-[0.02em] text-white"
          >
            <Images aria-hidden className="h-5 w-5" strokeWidth={LANDING_LUCIDE_STROKE} />
            {HY_UI.NAV_GALLERY}
          </button>
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
          {keyMetrics.map((item) => (
            <MobileStatCard
              key={item.label}
              value={item.value}
              label={item.label}
              tone={item.tone}
              Icon={item.Icon}
            />
          ))}
        </div>
      </section>

      {vis.about ? (
        <section id="about" className={`${MOBILE_SECTION_INSET} pt-12`}>
          <div className="rounded-[16px] border border-[#f3f4f6] bg-white p-5 shadow-[0_2px_14px_rgba(34,33,33,0.1)]">
            <h2 className="text-[clamp(1.55rem,2.1vw,2.25rem)] font-semibold uppercase leading-none tracking-[0.01em] text-[#2ba8b0]">
              {HY_UI.MOBILE_ABOUT_SECTION}
            </h2>
            <p className="mt-3 max-w-[296px] whitespace-pre-line text-[14px] leading-[1.625] text-[#1e2939]">
              {aboutText}
            </p>
            {mobileSpecialOffer ? (
              <div className="mt-4 rounded-[10px] border border-[#16a34a]/55 bg-[#d9fbe5] px-4 py-4 shadow-[0_8px_22px_rgba(34,197,94,0.18)]">
                <div className="mb-2 flex items-center gap-2">
                  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5 shrink-0 text-[#16a34a]">
                    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" fill="currentColor"/>
                  </svg>
                  <p className="text-[0.75rem] font-bold uppercase tracking-[0.18em] text-[#16a34a]">
                    {HY_UI.MOBILE_SPECIAL_OFFER}
                  </p>
                </div>
                <p className="whitespace-pre-line text-[13px] leading-[1.6] text-[#1e2939]">
                  {mobileSpecialOffer}
                </p>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      <section className={`${MOBILE_SECTION_INSET} flex flex-col gap-4 pt-11`}>
        <div className="overflow-hidden rounded-[16px] shadow-[0_4px_6px_rgba(0,0,0,0.1)]">
          {aboutPrimaryImage ? (
            <img src={aboutPrimaryImage} alt="" className="h-64 w-full object-cover" />
          ) : (
            <div className="h-64 w-full bg-black" aria-hidden />
          )}
        </div>
        {aboutInteriorOneOverlayUrl ? (
          <div className="overflow-hidden rounded-[16px]">
            <img src={aboutInteriorOneOverlayUrl} alt="" className="h-56 w-full object-cover" />
          </div>
        ) : null}
      </section>

      <LandingPageLower fields={fields} title={title} folderMedia={folderMedia} />
      <ContactFabMenu
        variant="mobile"
        toggleLabel={HY_UI.CTA_CALL_US}
        phone={fields[F.phone]}
        instagram={fields[F.instagram]}
        facebook={fields[F.facebook]}
        website={fields[F.website]}
        projectSlug={projectSlug}
        projectName={projectName}
      />
    </div>
  );
}
