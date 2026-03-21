"use client";

import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { parseMediaUrls } from "@/shared/lib/mediaUrls";
import { HomeMapPreview } from "@/features/map/components/HomeMapPreview";
import { MapSearch } from "@/features/home/components/MapSearch";
import { useBottomBarCallbacks } from "@/features/home/context/BottomBarContext";
import { buildMapMarkersFromProjects } from "@/features/home/buildMapMarkers";
import type { HomeProject } from "@/features/home/homeProject.types";

export type { HomeProject } from "@/features/home/homeProject.types";

/** Ниже Tailwind `lg` — мобильная/планшетная колонка списка. */
const MOBILE_LIST_QUERY = "(max-width: 1023px)" as const;
const PROJECTS_PAGE_SIZE_DESKTOP = 15;
const PROJECTS_PAGE_SIZE_MOBILE = 10;

const FIGMA_ASSETS = {
  heroBg: "/figma/home/heroBg.jpg",
  siteHeaderLogo: "/figma/home/footerLogo.svg",
  refundIcon: "/figma/home/refundIcon.svg",
  locationIcon: "/figma/home/loocation.svg",
  priceIcon: "/figma/home/priceIcon.svg",
  rangeIcon: "/figma/home/rangeIcon.svg",
  cardImageA: "/figma/home/cardImageA.png",
  cardImageB: "/figma/home/cardImageB.jpg",
  cardImageC: "/figma/home/cardImageC.jpg",
} as const;

function projectTitle(f: Record<string, string>): string {
  return f.expo_field_02?.trim() || f.expo_field_01?.trim() || "—";
}

function projectThumb(f: Record<string, string>): string | null {
  const logo = f.expo_field_50?.trim();
  if (logo && /^https?:\/\//i.test(logo)) {
    return logo;
  }

  const media = [...parseMediaUrls(f.expo_field_43), ...parseMediaUrls(f.expo_field_44)];
  return media[0] ?? null;
}

function projectLocation(f: Record<string, string>): string {
  return f.expo_field_03?.trim() || "Location unavailable";
}

function formatRange(minValue?: string, maxValue?: string): string {
  const min = minValue?.trim();
  const max = maxValue?.trim();

  if (min && max) {
    return min === max ? min : `${min} — ${max}`;
  }

  return min || max || "On request";
}

export function HomePageClient({ projects }: { projects: HomeProject[] }) {
  const [q, setQ] = useState("");
  const [pageSize, setPageSize] = useState(PROJECTS_PAGE_SIZE_DESKTOP);
  const [visibleCount, setVisibleCount] = useState(PROJECTS_PAGE_SIZE_DESKTOP);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);
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
        f.expo_field_01,
        f.expo_field_02,
        f.expo_field_03,
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
    <div className="min-h-screen bg-[#246976] text-white">
      <header
        id="top"
        className="fixed inset-x-0 top-0 z-[90] border-b border-white/15 bg-black/72 text-white backdrop-blur lg:hidden"
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

      <div className="relative isolate overflow-hidden rounded-b-[26px] bg-[#246976] sm:rounded-bl-[125px] sm:rounded-br-[132px] sm:rounded-b-none">
        <Image
          src={FIGMA_ASSETS.heroBg}
          alt=""
          fill
          priority
          unoptimized
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,19,26,0.58),rgba(7,27,36,0.88))]" />
        {/* Figma: Rectangle 1177 — overlay со скруглением снизу */}
        <div
          className="absolute inset-0 rounded-b-[26px] bg-[#277691] mix-blend-overlay sm:rounded-bl-[125px] sm:rounded-br-[132px] sm:rounded-b-none"
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
            <div className="order-2 min-w-0 lg:order-1 toon-home-map relative z-0 overflow-hidden rounded-[26px] border border-[#246976] bg-black/20 shadow-[0_32px_80px_rgba(0,0,0,0.32)] lg:min-h-[531px]">
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
                aria-label={isMapFullscreen ? "Выйти из полноэкранного режима" : "Полноэкранный режим"}
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
              {!isMapFullscreen ? (
                <HomeMapPreview
                  markers={markers}
                  className="h-[280px] w-full sm:h-[360px] md:h-[440px] lg:h-[531px]"
                />
              ) : (
                <div className="h-[280px] w-full bg-[#1d5662]/50 sm:h-[360px] md:h-[440px] lg:h-[531px]" />
              )}
            </div>

            {/* Мобильный: первый блок (order-1). Десктоп: справа от карты. */}
            <div className="order-1 relative z-10 mb-6 flex w-full max-w-[634px] flex-col items-center gap-[11px] lg:order-2 lg:mb-0 lg:mt-[110px] lg:w-[634px] lg:max-w-none lg:items-end">
              <p className="text-center font-semibold uppercase leading-[0.98] text-white [font-size:clamp(1.75rem,5vw,5.5rem)] lg:text-right lg:text-[88px]">
                TOON EXPO <span className="text-[#008999]">2026.</span> INVEST
              </p>
              <p className="text-center text-lg font-semibold leading-normal text-white sm:text-[24px] lg:text-right">
                interactive map
              </p>
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
            aria-label="Карта на весь экран"
            onClick={() => {
              setIsMapFullscreen(false);
              setIsSearchExpanded(false);
            }}
          >
            <div
              className="toon-home-map relative h-[74vh] w-[88vw] overflow-hidden rounded-[26px] border border-[#246976] bg-black shadow-2xl"
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
                <HomeMapPreview
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
                aria-label="Закрыть полноэкранный режим"
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

      <main className="overflow-x-hidden bg-[#246976] pb-20 lg:pb-0">
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
                {visibleProjects.map((project, index) => (
                  <li key={project.id} className="min-w-0">
                    <ProjectCard project={project} index={index} />
                  </li>
                ))}
              </ul>
              {hasMoreProjects ? (
                <div className="mt-8 flex justify-center sm:mt-10">
                  <button
                    type="button"
                    onClick={handleShowMore}
                    className="cursor-pointer min-w-[200px] rounded-[10px] bg-white px-10 py-3 text-center text-[16px] font-bold leading-6 text-[#0f172b] transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#246976]"
                  >
                    View more
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

const CARD_FALLBACK_IMAGES = [
  FIGMA_ASSETS.cardImageA,
  FIGMA_ASSETS.cardImageB,
  FIGMA_ASSETS.cardImageC,
] as const;

function ProjectCard({ project, index }: { project: HomeProject; index: number }) {
  const fields = project.expoFields;
  const thumb = projectThumb(fields);
  const title = projectTitle(fields);
  const location = projectLocation(fields);
  const taxRefund = fields.expo_field_09?.trim() || "On request";
  const pricePerMeter = formatRange(fields.expo_field_07, fields.expo_field_08);
  const priceRange = formatRange(fields.expo_field_17, fields.expo_field_18);
  const imageSrc = thumb ?? CARD_FALLBACK_IMAGES[index % CARD_FALLBACK_IMAGES.length];
  const hasPhoto = Boolean(thumb);

  return (
    <Link
      href={`/p/${project.slug}`}
      className="flex h-full min-w-0 max-w-full flex-col overflow-hidden rounded-[16px] bg-white shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] transition duration-200 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2ba8b0] focus-visible:ring-offset-2"
    >
      {/* Блок изображения: на мобильном ниже, на десктопе 256px */}
      <div className="relative h-[200px] w-full shrink-0 overflow-hidden bg-[#e2e8f0] sm:h-[230px] lg:h-[256px]">
        {hasPhoto ? (
          <img
            src={imageSrc}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[#94a3b8]">
            <CardPhotoPlaceholderIcon className="h-20 w-20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(15,23,43,0.6)] to-transparent" aria-hidden />
      </div>

      {/* Контент: адаптивные отступы, min-w-0 чтобы не вылезало на мобильных */}
      <div className="flex min-w-0 flex-1 flex-col gap-3 px-4 pt-4 pb-4 sm:gap-4 sm:px-5 sm:pt-5 sm:pb-5 lg:px-6 lg:pt-6 lg:pb-5">
        <div className="flex min-w-0 flex-col gap-1.5 sm:gap-2">
          <h2 className="min-w-0 truncate text-[17px] font-bold leading-tight tracking-[-0.45px] text-[#0f172b] sm:text-[20px] sm:leading-7">
            {title}
          </h2>
          <div className="flex min-w-0 items-center gap-2 text-[13px] leading-tight text-[#45556c] sm:text-[14px] sm:leading-5">
            <img src={FIGMA_ASSETS.refundIcon} alt="" className="h-4 w-4 shrink-0 object-contain" />
            <span className="min-w-0 line-clamp-2">{taxRefund}</span>
          </div>
          <div className="flex min-w-0 items-center gap-2 text-[13px] leading-tight text-[#45556c] sm:text-[14px] sm:leading-5">
            <img
              src={FIGMA_ASSETS.locationIcon}
              alt=""
              className="h-5 w-5 shrink-0 object-contain"
              width={20}
              height={20}
            />
            <span className="min-w-0 truncate">{location}</span>
          </div>
        </div>

        <div className="flex min-w-0 flex-wrap items-center gap-3 border-b border-[#f1f5f9] pb-2 sm:gap-4 sm:pb-3">
          <div className="flex min-w-0 items-center gap-1.5 text-[13px] text-[#45556c] sm:text-[14px]">
            <img src={FIGMA_ASSETS.priceIcon} alt="" className="h-4 w-4 shrink-0" />
            <span className="min-w-0 truncate">{pricePerMeter}</span>
          </div>
        </div>

        <div className="mt-auto flex min-w-0 items-center justify-between gap-2 sm:gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden text-[13px] text-[#45556c] sm:text-[14px]">
            <img src={FIGMA_ASSETS.rangeIcon} alt="" className="h-4 w-4 shrink-0" />
            <span className="min-w-0 truncate">{priceRange}</span>
          </div>
          <span className="shrink-0 rounded-[10px] bg-[#0f172b] px-4 py-2 text-center text-[14px] font-medium leading-6 text-white sm:px-5 sm:py-2.5 sm:text-[16px]">
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
