"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { parseMediaUrls } from "@/shared/lib/mediaUrls";
import { HomeMapPreview } from "@/features/map/components/HomeMapPreview";
import { buildMapMarkersFromProjects } from "@/features/home/buildMapMarkers";
import type { HomeProject } from "@/features/home/homeProject.types";

export type { HomeProject } from "@/features/home/homeProject.types";

const HERO_TITLE = "TOON EXPO 2026. INVEST";
const HERO_SUBTITLE = "interactive map";

const FIGMA_ASSETS = {
  heroBg: "/figma/home/heroBg.jpg",
  headerLogo: "/figma/home/headerLogo.svg",
  refundIcon: "/figma/home/refundIcon.svg",
  locationIcon: "/figma/home/locationIcon.svg",
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

  const markers = useMemo(() => buildMapMarkersFromProjects(filtered), [filtered]);

  return (
    <div className="min-h-screen bg-white text-white">
      <div className="relative isolate overflow-hidden bg-[#0b2530]">
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

        <header id="top" className="relative z-10 px-5 py-6 lg:px-10">
          <div className="mx-auto flex max-w-[1680px] items-center justify-between gap-4">
            <Link href="/" className="inline-flex items-center gap-3 text-[clamp(1.5rem,2vw,2.25rem)] font-bold uppercase tracking-[0.04em] text-[#2ba8b0]">
              <img src={FIGMA_ASSETS.headerLogo} alt="" className="h-11 w-11 shrink-0" />
              <span>Toon Expo</span>
            </Link>
            <Link
              href="/admin/login"
              className="rounded-[4px] border-2 border-white/85 px-4 py-2 text-sm font-medium uppercase tracking-[0.12em] text-white transition hover:bg-white hover:text-[#0b2530]"
            >
              Admin
            </Link>
          </div>
        </header>

        <section
          id="events"
          className="relative z-10 scroll-mt-6 px-5 pb-16 pt-8 lg:px-10 lg:pb-28"
        >
          <div className="mx-auto max-w-[1680px]">
            <div className="mb-8 text-center">
              <p className="text-[clamp(2rem,4vw,3rem)] font-semibold uppercase tracking-[0.08em] text-white">
                {HERO_TITLE}
              </p>
              <p className="mt-3 text-base uppercase tracking-[0.32em] text-white/80">
                {HERO_SUBTITLE}
              </p>
            </div>

            <div className="toon-home-map relative overflow-hidden rounded-[12px] border border-[#246976] bg-black/20 shadow-[0_32px_80px_rgba(0,0,0,0.32)]">
              <div className="absolute left-4 right-4 top-4 z-20 sm:right-auto sm:w-[320px]">
                <label className="sr-only" htmlFor="home-search">
                  Որոնում
                </label>
                <input
                  id="home-search"
                  type="search"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Որոնում՝ անուն, հասցե…"
                  className="w-full rounded-xl border border-white/40 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#2ba8b0]"
                />
              </div>
              <div
                className="pointer-events-none absolute inset-0 z-10 bg-black/15"
                aria-hidden
              />
              <HomeMapPreview markers={markers} className="h-[440px] w-full md:h-[540px] lg:h-[700px]" />
            </div>
          </div>
        </section>
      </div>

      <main className="bg-[#246976]">
        <section
          id="participants"
          className="mx-auto max-w-[1680px] scroll-mt-6 px-5 py-10 lg:px-10 lg:py-12"
        >
          {filtered.length === 0 ? (
            <p className="rounded-[12px] border border-[#18fffb]/40 bg-white/8 px-6 py-12 text-center text-lg text-white/80">
              Արդյունք չկա
            </p>
          ) : (
            <>
              <ul id="projects" className="grid scroll-mt-6 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filtered.map((project, index) => (
                  <li key={project.id}>
                    <ProjectCard project={project} index={index} />
                  </li>
                ))}
              </ul>
              <div className="mt-10 flex justify-center">
                <div className="rounded-[4px] border border-[#18fffb] px-10 py-4 text-sm font-semibold uppercase tracking-[0.24em] text-white/90">
                  View more
                </div>
              </div>
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

  return (
    <Link
      href={`/p/${project.slug}`}
      className="flex h-full flex-col rounded-[10px] border border-[#18fffb] bg-[rgba(43,168,176,0.45)] p-5 transition duration-200 hover:-translate-y-1 hover:bg-[rgba(43,168,176,0.62)]"
    >
      <h2 className="min-h-16 text-[1.6rem] font-bold uppercase leading-tight text-white">
        {title}
      </h2>
      <div className="relative mt-5 aspect-[1.5/1] overflow-hidden rounded-[10px] bg-[#1d5662]">
        <img src={imageSrc} alt={title} loading="lazy" className="h-full w-full object-cover" />
      </div>
      <ul className="mt-5 space-y-3 text-sm text-white/95">
        <li className="flex items-start gap-3">
          <img src={FIGMA_ASSETS.locationIcon} alt="" className="mt-0.5 h-5 w-5 shrink-0" />
          <span>{location}</span>
        </li>
        <li className="flex items-start gap-3">
          <img src={FIGMA_ASSETS.refundIcon} alt="" className="mt-0.5 h-5 w-5 shrink-0" />
          <span>Tax refund: {taxRefund}</span>
        </li>
        <li className="flex items-start gap-3">
          <img src={FIGMA_ASSETS.priceIcon} alt="" className="mt-0.5 h-5 w-5 shrink-0" />
          <span>Price / m²: {pricePerMeter}</span>
        </li>
        <li className="flex items-start gap-3">
          <img src={FIGMA_ASSETS.rangeIcon} alt="" className="mt-0.5 h-5 w-5 shrink-0" />
          <span>Range: {priceRange}</span>
        </li>
      </ul>
    </Link>
  );
}
