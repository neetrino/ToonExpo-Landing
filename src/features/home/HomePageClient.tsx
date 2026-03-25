"use client";

import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { CircleDollarSign, MapPin, Percent, Ruler } from "lucide-react";
import { useScrolledPastThreshold } from "@/shared/hooks/useScrolledPastThreshold";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { LANDING_LUCIDE_STROKE } from "@/features/landing/lib/lucideLandingStyle";
import { PROJECT_FIELD } from "@/shared/constants/expoFieldKeys";
import { HomeMapPreviewDynamic } from "@/features/map/components/HomeMapPreviewDynamic";
import { MapSearch } from "@/features/home/components/MapSearch";
import { useBottomBarCallbacks } from "@/features/home/context/BottomBarContext";
import { buildMapMarkersFromProjects } from "@/features/home/buildMapMarkers";
import type { HomeProject } from "@/features/home/homeProject.types";
import { HY_UI } from "@/shared/i18n/hyUi.constants";
import { formatPriceMinForDisplay } from "@/shared/lib/formatPriceMinDisplay";
import { formatTaxRefundForHomeCard } from "@/shared/lib/formatTaxRefundDisplayHy";
import { publicAssetUrl } from "@/shared/lib/publicAssetUrl";

export type { HomeProject } from "@/features/home/homeProject.types";

/** Ниже Tailwind `lg` — мобильная/планшетная колонка списка. */
const MOBILE_LIST_QUERY = "(max-width: 1023px)" as const;
const PROJECTS_PAGE_SIZE_DESKTOP = 15;
const PROJECTS_PAGE_SIZE_MOBILE = 10;

const FIGMA_ASSETS = {
  heroBg: publicAssetUrl("/figma/home/heroBg.webp"),
  siteHeaderLogo: publicAssetUrl("/figma/home/footerLogo.svg"),
} as const;

const PROJECT_CARD_LUCIDE_CLASS =
  "h-4 w-4 shrink-0 text-[#2ba8b0] sm:h-[18px] sm:w-[18px]" as const;

/** Համապատասխանում է `#participants` grid-ին՝ 1 / 2 / 3 սյուն և padding-ներին (`max-w-[1680px]` px-4 … lg:px-10)։ */
const PROJECT_CARD_HERO_SIZES =
  "(max-width: 767px) calc(100vw - 2rem), (max-width: 1279px) calc((100vw - 5rem) / 2), calc((min(1680px, 100vw) - 5rem) / 3)" as const;

const PROJECT_CARD_LOGO_MAX_PX = 156 as const;
const PROJECT_CARD_LOGO_MAX_SM_PX = 68 as const;

const PF = PROJECT_FIELD;

function projectTitle(f: Record<string, string>): string {
  return f[PF.titleExhibition]?.trim() || f[PF.participantName]?.trim() || "—";
}

/** Fallback hero — CSV-ում պատկերների URL չկա։ */
function projectThumb(_f: Record<string, string>): string | null {
  return null;
}

function projectLocation(f: Record<string, string>): string {
  return f[PF.shortName]?.trim() || "Location unavailable";
}

export function HomePageClient({ projects }: { projects: HomeProject[] }) {
  const [q, setQ] = useState("");
  const [pageSize, setPageSize] = useState(PROJECTS_PAGE_SIZE_DESKTOP);
  const [visibleCount, setVisibleCount] = useState(PROJECTS_PAGE_SIZE_DESKTOP);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);
  const headerScrolled = useScrolledPastThreshold(20);
  const { setCallbacks } = useBottomBarCallbacks();

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) {
      return projects;
    }
    return projects.filter((p) => {
      const f = p.expoFields;
      const hay = [
        projectTitle(f),
        f[PF.participantName],
        f[PF.titleExhibition],
        f[PF.shortName],
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(needle);
    });
  }, [projects, q]);

  useLayoutEffect(() => {
    const mq = window.matchMedia(MOBILE_LIST_QUERY);
    const sync = () => {
      setPageSize(mq.matches ? PROJECTS_PAGE_SIZE_MOBILE : PROJECTS_PAGE_SIZE_DESKTOP);
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useLayoutEffect(() => {
    setVisibleCount(pageSize);
  }, [q, pageSize]);

  // Обработка ESC для выхода из полноэкранного режима
  useEffect(() => {
    if (!isMapFullscreen) {
      return;
    }
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMapFullscreen(false);
        setIsSearchExpanded(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isMapFullscreen]);

  const markers = useMemo(() => buildMapMarkersFromProjects(filtered), [filtered]);
  const visibleProjects = filtered.slice(0, visibleCount);
  const hasMoreProjects = filtered.length > visibleProjects.length;

  function handleShowMore() {
    setVisibleCount((currentCount) => currentCount + pageSize);
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openSearch() {
    const input = document.getElementById("home-search-featured");
    input?.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => (input as HTMLInputElement | null)?.focus(), 400);
  }

  useEffect(() => {
    const onGoHome = () => {
      if (isMapFullscreen) setIsMapFullscreen(false);
      setTimeout(scrollToTop, isMapFullscreen ? 200 : 0);
    };
    const onScrollToTop = () => {
      if (isMapFullscreen) setIsMapFullscreen(false);
      setTimeout(scrollToTop, isMapFullscreen ? 200 : 0);
    };
    const onOpenSearch = () => {
      if (isMapFullscreen) setIsMapFullscreen(false);
      setTimeout(openSearch, isMapFullscreen ? 200 : 0);
    };
    setCallbacks({
      onGoHome,
      onScrollToTop,
      onOpenSearch,
      onOpenMap: () => setIsMapFullscreen(true),
    });
    return () => setCallbacks(null);
  }, [isMapFullscreen, setCallbacks]);

  useEffect(() => {
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    if (hash === "#search") setTimeout(openSearch, 300);
    if (hash === "#map") setTimeout(() => setIsMapFullscreen(true), 300);
  }, []);

  return (
    <div className="min-h-screen bg-[#00303D] text-white">
      <header
        id="top"
        className={`fixed inset-x-0 top-0 z-[90] text-white transition-[background-color,backdrop-filter,border-color] duration-200 lg:hidden ${
          headerScrolled
            ? "border-b border-white/15 bg-black/72 backdrop-blur"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-[1680px] items-center justify-center gap-4 px-5 py-4">
          <Link
            href="/"
            className="inline-flex shrink-0 items-center transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2ba8b0] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b2530]"
          >
            <img
              src={FIGMA_ASSETS.siteHeaderLogo}
              alt="Toon Expo"
              className="h-10 w-10 object-contain lg:h-12 lg:w-12"
            />
          </Link>
        </div>
      </header>

      <div className="relative isolate overflow-hidden rounded-b-[26px] bg-[#00303D] sm:rounded-bl-[111px] sm:rounded-br-[111px] sm:rounded-b-none">
        <Image
          src={FIGMA_ASSETS.heroBg}
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Лёгкий тёмный градиент снизу для читаемости текста — фото без синеватого оверлея */}
        <div
          className="pointer-events-none absolute inset-0 rounded-b-[26px] bg-[linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.15)_70%,rgba(0,0,0,0.35)_100%)] sm:rounded-bl-[111px] sm:rounded-br-[111px] sm:rounded-b-none"
          aria-hidden
        />
        {/* Стеклянный эффект как у мобил bar — backdrop-blur + полупрозрачность + border */}
        <div
          className="pointer-events-none absolute inset-0 rounded-b-[26px] border border-white/15 bg-black/40 backdrop-blur-[10px] sm:rounded-bl-[111px] sm:rounded-br-[111px] sm:rounded-b-none"
          aria-hidden
        />

        {/* Десктоп: старый хедер в потоке (без фиксации), только lg+ */}
        <header className="relative z-10 hidden px-5 py-6 lg:block lg:px-10">
          <div className="mx-auto flex max-w-[1680px] items-center justify-between gap-4">
            <Link
              href="/"
              className="inline-flex shrink-0 items-center transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2ba8b0] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b2530]"
            >
              <img
                src={FIGMA_ASSETS.siteHeaderLogo}
                alt="Toon Expo"
                className="h-[4.5rem] w-[4.5rem] object-contain sm:h-[5.25rem] sm:w-[5.25rem]"
              />
            </Link>
          </div>
        </header>

        {/* Мобильный: отступ сверху под фиксированный хедер. Десктоп: хедер в потоке, обычные отступы. */}
        <section
          id="events"
          className="relative z-10 scroll-mt-6 px-4 pb-12 pt-[72px] sm:px-5 sm:pb-16 sm:pt-[72px] lg:px-[92px] lg:pb-28 lg:pr-[107px] lg:pt-8"
        >
          <div className="mx-auto grid max-w-[1920px] grid-cols-1 items-start gap-0 lg:grid-cols-[minmax(0,1063px)_24px_634px] lg:gap-0">
            <div className="order-2 min-w-0 lg:order-1 toon-home-map relative z-0 overflow-visible rounded-[26px] border border-[#00303D] bg-black/20 shadow-[0_32px_80px_rgba(0,0,0,0.32)] [--toon-map-corner-radius:26px] lg:min-h-[531px]">
              <div className="absolute left-4 top-4 z-20 sm:right-auto">
                <MapSearch
                  value={q}
                  onChange={setQ}
                  expanded={isSearchExpanded}
                  onExpandedChange={setIsSearchExpanded}
                  inputId="home-search"
                />
              </div>

              {/* Кнопка полноэкранного режима */}
              <button
                type="button"
                onClick={() => {
                  const next = !isMapFullscreen;
                  setIsMapFullscreen(next);
                  if (next) setIsSearchExpanded(true);
                  else setIsSearchExpanded(false);
                }}
                className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-xl border border-white/40 bg-white text-slate-600 transition hover:bg-slate-50"
                aria-label={isMapFullscreen ? HY_UI.MAP_FULLSCREEN_EXIT : HY_UI.MAP_FULLSCREEN_ENTER}
              >
                {isMapFullscreen ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                  </svg>
                )}
              </button>
              <div
                className="pointer-events-none absolute inset-0 z-10 bg-black/15"
                aria-hidden
              />
              <div className="h-[280px] w-full sm:h-[360px] md:h-[440px] lg:h-[531px]">
                {!isMapFullscreen ? (
                  <HomeMapPreviewDynamic markers={markers} className="h-full w-full" />
                ) : (
                  <div className="h-full w-full bg-[#1d5662]/50" />
                )}
              </div>
            </div>

            {/* Мобильный: первый блок (order-1). Десктоп: справа от карты. Lg размеры подогнаны под высоту карты 531px — весь столбец не ниже её нижнего края. */}
            <div className="order-1 relative z-10 mb-6 flex w-full max-w-[634px] flex-col items-center gap-[11px] lg:order-2 lg:mb-0 lg:mt-0 lg:w-[634px] lg:max-w-none lg:items-end lg:self-start">
              {/* До lg: две строки — бренд + год/акцент; после lg скрыто (дубликат не попадает в a11y-tree). */}
              <div className="flex w-full min-w-0 flex-col items-center gap-2 px-1 lg:hidden">
                <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center font-bold uppercase leading-[0.95] tracking-[0.14em] text-white [font-size:clamp(1.85rem,8.8vw,3.35rem)]">
                  <span className="drop-shadow-[0_2px_24px_rgba(0,0,0,0.35)]">TOON</span>
                  <span
                    className="inline-flex h-5 w-px shrink-0 bg-gradient-to-b from-transparent via-[#2ba8b0] to-transparent opacity-90"
                    aria-hidden
                  />
                  <span className="drop-shadow-[0_2px_24px_rgba(0,0,0,0.35)]">EXPO</span>
                </p>
                <p className="flex flex-wrap items-baseline justify-center gap-x-4 gap-y-1 text-center [font-size:clamp(1.5rem,7vw,2.85rem)]">
                  <span className="font-bold tabular-nums tracking-[0.06em] text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.3)]">
                    2026
                  </span>
                  <span
                    className="font-bold italic leading-none text-[#FFD700] [font-size:clamp(1.2rem,5.5vw,2.35rem)] drop-shadow-[0_0_20px_rgba(255,215,0,0.25)]"
                  >
                    INVEST
                  </span>
                </p>
              </div>

              <div className="hidden flex-col items-center gap-0 lg:flex lg:items-end lg:w-full">
                <p className="text-center font-bold uppercase leading-[0.98] text-white [font-size:clamp(2rem,8vw,184px)] lg:text-right lg:text-[184px]">
                  toon
                </p>
                <p className="-mt-2 text-center font-bold uppercase leading-[0.98] text-white [font-size:clamp(2rem,8vw,184px)] lg:-mt-4 lg:translate-x-20 lg:text-right lg:text-[184px]">
                  expo
                </p>
                <p className="-mt-2 text-center font-bold leading-[0.98] text-white [font-size:clamp(1.75rem,6vw,110px)] lg:-mt-2 lg:text-right lg:text-[110px]">
                  2026
                </p>
                <p className="-mt-1 text-center font-bold italic leading-none text-[#FFD700] [font-size:clamp(1.25rem,4vw,72px)] lg:text-right lg:text-[72px]">
                  INVEST
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Попап карты на 90% экрана */}
      {isMapFullscreen &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80"
            role="dialog"
            aria-modal="true"
            aria-label={HY_UI.MAP_DIALOG_FULLSCREEN}
            onClick={() => {
              setIsMapFullscreen(false);
              setIsSearchExpanded(false);
            }}
          >
            <div
              className="toon-home-map relative h-[74vh] w-[88vw] overflow-visible rounded-[26px] border border-[#00303D] bg-black shadow-2xl [--toon-map-corner-radius:26px]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* В попапе поиск всегда раскрыт (не зависим от isSearchExpanded) */}
              <div className="absolute left-4 top-4 z-[100] shrink-0">
                <MapSearch
                  value={q}
                  onChange={setQ}
                  expanded={true}
                  onExpandedChange={setIsSearchExpanded}
                  inputId="home-search-popup"
                />
              </div>

              <div className="absolute inset-0 z-0">
                <HomeMapPreviewDynamic
                  key="fullscreen-map"
                  markers={markers}
                  className="h-full w-full"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                setIsMapFullscreen(false);
                setIsSearchExpanded(false);
              }}
                className="absolute right-4 top-4 z-[100] flex h-12 w-12 items-center justify-center rounded-xl border border-white/40 bg-white text-slate-600 shadow-lg transition hover:bg-slate-50"
                aria-label={HY_UI.MAP_FULLSCREEN_EXIT}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>,
          document.body,
        )}

      <main className="overflow-x-hidden bg-[#00303D] pb-20 lg:pb-0">
        {/* Секция под hero: поиск + Featured Properties (по макету Figma) */}
        <section
          aria-labelledby="featured-heading"
          className="mx-auto min-w-0 max-w-[1680px] px-4 pt-8 pb-6 sm:px-5 sm:pt-10 sm:pb-8 lg:px-10 lg:pt-12 lg:pb-10"
        >
          <div className="flex flex-col gap-6">
            <div className="w-full max-w-[576px] sm:w-[576px]">
              <MapSearch
                value={q}
                onChange={setQ}
                expanded={true}
                onExpandedChange={() => {}}
                inputId="home-search-featured"
                className="w-full sm:w-[576px]"
              />
            </div>
            <div>
              <h2
id="featured-heading"
                  className="text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl"
                >
                  Ընտիր օբյեկտներ
                </h2>
              <p className="mt-1 text-base text-white/90 sm:text-lg">
                Ձեզ համար ձեռքով ընտրված բացառիկ առաջարկներ
              </p>
            </div>
          </div>
        </section>

        <section
          id="participants"
          className="mx-auto min-w-0 max-w-[1680px] scroll-mt-6 px-4 py-8 sm:px-5 sm:py-10 lg:px-10 lg:py-12"
        >
          {filtered.length === 0 ? (
            <p className="rounded-[12px] border border-[#18fffb]/40 bg-white/8 px-4 py-10 text-center text-base text-white/80 sm:px-6 sm:py-12 sm:text-lg">
              Արդյունք չկա
            </p>
          ) : (
            <>
              <ul id="projects" className="grid min-w-0 scroll-mt-6 grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
                {visibleProjects.map((project) => (
                  <li key={project.id} className="min-w-0">
                    <ProjectCard project={project} />
                  </li>
                ))}
              </ul>
              {hasMoreProjects ? (
                <div className="mt-8 flex justify-center sm:mt-10">
                  <button
                    type="button"
                    onClick={handleShowMore}
                    className="cursor-pointer min-w-[200px] rounded-[10px] bg-white px-10 py-3 text-center text-[16px] font-bold leading-6 text-[#0f172b] transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#00303D]"
                  >
                    {HY_UI.CTA_VIEW_MORE}
                  </button>
                </div>
              ) : null}
            </>
          )}
        </section>
      </main>

    </div>
  );
}

function ProjectCard({ project }: { project: HomeProject }) {
  const fields = project.expoFields;
  const thumb = projectThumb(fields);
  const heroPreferred = project.cardHeroUrl ?? thumb;
  const hasPhoto = Boolean(heroPreferred);
  const logoSrc = project.cardLogoUrl?.trim() || null;
  const title = projectTitle(fields);
  const location = projectLocation(fields);
  const taxRefundDisplay = formatTaxRefundForHomeCard(fields[PF.taxRefund]);
  const priceMinDisplay =
    formatPriceMinForDisplay(fields[PF.priceMin]) || HY_UI.ON_REQUEST;
  const areasDisplay = fields[PF.areas]?.trim() || HY_UI.ON_REQUEST;

  return (
    <Link
      href={`/p/${project.slug}`}
      className="flex h-full min-w-0 max-w-full flex-col overflow-hidden rounded-[16px] bg-white shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] transition duration-200 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2ba8b0] focus-visible:ring-offset-2"
    >
      {/* Блок изображения: на мобильном ниже, на десктопе 256px */}
      <div className="relative h-[200px] w-full shrink-0 overflow-hidden bg-[#e2e8f0] sm:h-[230px] lg:h-[256px]">
        {hasPhoto ? (
          <Image
            src={heroPreferred!}
            alt={title}
            fill
            sizes={PROJECT_CARD_HERO_SIZES}
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[#94a3b8]">
            <CardPhotoPlaceholderIcon className="h-20 w-20" />
          </div>
        )}
        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-[rgba(15,23,43,0.6)] to-transparent"
          aria-hidden
        />
        {logoSrc ? (
          <div className="absolute left-2 top-2 z-[2] max-h-[57px] max-w-[156px] rounded-lg bg-white/92 p-2 shadow-md ring-1 ring-black/5 sm:left-3 sm:top-3 sm:max-h-[68px] sm:p-2.5">
            <Image
              src={logoSrc}
              alt=""
              width={PROJECT_CARD_LOGO_MAX_PX}
              height={PROJECT_CARD_LOGO_MAX_SM_PX}
              className="h-[36px] max-h-full w-auto max-w-full object-contain sm:h-[42px]"
            />
          </div>
        ) : null}
      </div>

      {/* Контент: адаптивные отступы, min-w-0 чтобы не вылезало на мобильных */}
      <div className="flex min-w-0 flex-1 flex-col gap-3 px-4 pt-4 pb-4 sm:gap-4 sm:px-5 sm:pt-5 sm:pb-5 lg:px-6 lg:pt-6 lg:pb-5">
        <div className="flex min-w-0 flex-col gap-1.5 sm:gap-2">
          <h2 className="min-w-0 truncate text-[17px] font-bold leading-tight tracking-[-0.45px] text-[#0f172b] sm:text-[20px] sm:leading-7">
            {title}
          </h2>
          <div className="flex min-w-0 items-start gap-2 text-[13px] leading-tight text-[#45556c] sm:text-[14px] sm:leading-5">
            <Percent
              aria-hidden
              className={`${PROJECT_CARD_LUCIDE_CLASS} mt-0.5`}
              strokeWidth={LANDING_LUCIDE_STROKE}
            />
            <span className="min-w-0 line-clamp-3">
              <span className="font-normal">{HY_UI.PAYMENT_TAX}՝ </span>
              <span className="font-bold text-[#0f172b]">{taxRefundDisplay}</span>
            </span>
          </div>
          <div className="flex min-w-0 items-center gap-2 text-[13px] leading-tight text-[#45556c] sm:text-[14px] sm:leading-5">
            <MapPin
              aria-hidden
              className={PROJECT_CARD_LUCIDE_CLASS}
              strokeWidth={LANDING_LUCIDE_STROKE}
            />
            <span className="min-w-0 truncate">{location}</span>
          </div>
        </div>

        <div className="flex min-w-0 flex-wrap items-center gap-3 border-b border-[#f1f5f9] pb-2 sm:gap-4 sm:pb-3">
          <div className="flex min-w-0 items-start gap-1.5 text-[13px] text-[#45556c] sm:text-[14px]">
            <CircleDollarSign
              aria-hidden
              className={`${PROJECT_CARD_LUCIDE_CLASS} mt-0.5`}
              strokeWidth={LANDING_LUCIDE_STROKE}
            />
            <span className="min-w-0 break-words leading-snug">
              <span className="font-normal">{HY_UI.HOME_CARD_MIN_PRICE_PER_SQM}՝ </span>
              <span className="font-bold text-[#0f172b]">{priceMinDisplay}</span>
            </span>
          </div>
        </div>

        <div className="mt-auto flex min-w-0 items-center justify-between gap-2 sm:gap-3">
          <div className="flex min-w-0 flex-1 items-start gap-2 overflow-hidden text-[13px] text-[#45556c] sm:text-[14px]">
            <Ruler
              aria-hidden
              className={`${PROJECT_CARD_LUCIDE_CLASS} mt-0.5`}
              strokeWidth={LANDING_LUCIDE_STROKE}
            />
            <span className="min-w-0 line-clamp-2">
              <span className="font-normal">{HY_UI.INVEST_CARD_AREAS}՝ </span>
              <span className="font-bold text-[#0f172b]">{areasDisplay}</span>
            </span>
          </div>
          <span className="shrink-0 rounded-[10px] bg-[#00303D] px-4 py-2 text-center text-[14px] font-medium leading-6 text-white sm:px-5 sm:py-2.5 sm:text-[16px]">
            Դիտել
          </span>
        </div>
      </div>
    </Link>
  );
}

function CardPhotoPlaceholderIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  );
}
