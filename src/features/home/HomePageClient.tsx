"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { parseLatLng } from "@/shared/lib/mediaUrls";
import { HomeMapPreview, type MapMarker } from "@/features/map/components/HomeMapPreview";

export type HomeProject = {
  id: string;
  slug: string;
  expoFields: Record<string, string>;
};

const HERO_TITLE = "TOON EXPO 2026. INVEST";
const HERO_SUBTITLE = "interactive map";
const FIGMA_ASSETS = {
  heroBg: "/figma/home/heroBg.jpg",
  headerLogo: "/figma/home/headerLogo.svg",
  footerLogo: "/figma/home/footerLogo.svg",
  footerIllustration: "/figma/home/footerIllustration.svg",
  locationDivider: "/figma/home/locationDivider.svg",
  visitSiteButton: "/figma/home/visitSiteButton.svg",
  visitSiteIconLeft: "/figma/home/visitSiteIconLeft.svg",
  visitSiteIconRight: "/figma/home/visitSiteIconRight.svg",
  reachOutCircle: "/figma/home/reachOutCircle.svg",
  reachOutTarget: "/figma/home/reachOutTarget.svg",
  refundIcon: "/figma/home/refundIcon.svg",
  locationIcon: "/figma/home/locationIcon.svg",
  priceIcon: "/figma/home/priceIcon.svg",
  rangeIcon: "/figma/home/rangeIcon.svg",
  cardImageA: "/figma/home/cardImageA.png",
  cardImageB: "/figma/home/cardImageB.jpg",
  cardImageC: "/figma/home/cardImageC.jpg",
} as const;
const FALLBACK_CARD_IMAGES = [
  FIGMA_ASSETS.cardImageA,
  FIGMA_ASSETS.cardImageB,
  FIGMA_ASSETS.cardImageC,
] as const;

function projectTitle(f: Record<string, string>): string {
  return f.expo_field_02?.trim() || f.expo_field_01?.trim() || "—";
}

function projectThumb(f: Record<string, string>): string | null {
  const u = f.expo_field_43?.trim() || f.expo_field_44?.trim() || f.expo_field_50?.trim();
  if (u && /^https?:\/\//i.test(u)) {
    return u.split(/[\n;]/)[0]?.trim() ?? null;
  }
  return null;
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

function buildMarkers(list: HomeProject[]): MapMarker[] {
  const markers: MapMarker[] = [];
  for (const p of list) {
    const f = p.expoFields;
    const ll = parseLatLng(f.expo_field_16);
    if (ll) {
      markers.push({
        lat: ll.lat,
        lng: ll.lng,
        label: projectTitle(f),
        href: `/p/${p.slug}`,
      });
    }
  }
  return markers;
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

  const markers = useMemo(() => buildMarkers(filtered), [filtered]);
  const footerProject = filtered[0] ?? projects[0] ?? null;
  const footerSite = footerProject?.expoFields.expo_field_51?.trim() ?? "";
  const footerInstagram = footerProject?.expoFields.expo_field_52?.trim() ?? "";
  const footerFacebook = footerProject?.expoFields.expo_field_53?.trim() ?? "";

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

        <section className="relative z-10 px-5 pb-16 pt-8 lg:px-10 lg:pb-28">
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
        <section id="projects" className="mx-auto max-w-[1680px] px-5 py-10 lg:px-10 lg:py-12">
          {filtered.length === 0 ? (
            <p className="rounded-[12px] border border-[#18fffb]/40 bg-white/8 px-6 py-12 text-center text-lg text-white/80">
              Արդյունք չկա
            </p>
          ) : (
            <>
              <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
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

        <section className="h-24 bg-white" />

        <section id="location" className="mx-auto max-w-[1680px] px-5 pb-10 lg:px-10 lg:pb-14">
          <div className="mb-6 flex items-center gap-4">
            <h2 className="text-2xl font-semibold uppercase tracking-[0.12em] text-white lg:text-[2.5rem]">
              Location
            </h2>
            <img src={FIGMA_ASSETS.locationDivider} alt="" className="h-[2px] min-w-0 flex-1 opacity-70" />
          </div>
          <div className="toon-home-map overflow-hidden rounded-[20px] border border-white/20 shadow-[0_25px_60px_rgba(0,0,0,0.2)]">
            <HomeMapPreview markers={markers} className="h-[240px] w-full md:h-[320px]" />
          </div>
        </section>

        <section className="border-t border-white/10 bg-[#2ba8b0]">
          <div className="mx-auto grid max-w-[1680px] gap-6 px-5 py-8 lg:grid-cols-[1.1fr_auto_auto] lg:items-center lg:px-10">
            <a href="#projects" className="text-xl font-semibold uppercase tracking-[0.14em] text-white lg:text-[2rem]">
              View Apartments
            </a>
            <div className="flex flex-wrap items-center gap-3">
              {footerSite ? (
                <a
                  href={footerSite}
                  target="_blank"
                  rel="noreferrer"
                  className="relative inline-flex h-[60px] w-[307px] items-center justify-center text-xs font-semibold uppercase tracking-[0.2em] text-[#2ba8b0] transition hover:brightness-110"
                >
                  <img src={FIGMA_ASSETS.visitSiteButton} alt="" className="absolute inset-0 h-full w-full" />
                  <span className="relative z-10">Visit Site</span>
                </a>
              ) : null}
              {footerInstagram ? (
                <a
                  href={footerInstagram}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="transition hover:brightness-110"
                >
                  <img src={FIGMA_ASSETS.visitSiteIconLeft} alt="" className="h-[60px] w-[60px]" />
                </a>
              ) : null}
              {footerFacebook ? (
                <a
                  href={footerFacebook}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="transition hover:brightness-110"
                >
                  <img src={FIGMA_ASSETS.visitSiteIconRight} alt="" className="h-[60px] w-[60px]" />
                </a>
              ) : null}
            </div>
            <a
              href="#location"
              className="inline-flex items-center justify-center gap-3 rounded-full bg-[#fbcd06] px-6 py-3 text-sm font-bold uppercase tracking-[0.2em] text-black transition hover:brightness-105"
            >
              Reach Out
              <span className="relative inline-flex h-10 w-10 items-center justify-center">
                <img src={FIGMA_ASSETS.reachOutCircle} alt="" className="absolute inset-0 h-full w-full" />
                <img src={FIGMA_ASSETS.reachOutTarget} alt="" className="relative h-7 w-7" />
              </span>
            </a>
          </div>
        </section>
      </main>

      <footer className="bg-[#050b10] px-5 py-8 lg:px-10">
        <div className="mx-auto flex max-w-[1680px] flex-col gap-6 text-white/70 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-4">
            <img src={FIGMA_ASSETS.footerLogo} alt="" className="h-14 w-14 shrink-0" />
            <div>
              <p className="text-2xl font-bold uppercase tracking-[0.08em] text-white">Toon Expo</p>
              <p className="mt-3 text-sm uppercase tracking-[0.16em] text-white/55">
                © 2026 Toon Expo. All rights reserved.
              </p>
            </div>
          </div>
          <div className="hidden lg:block lg:w-[340px]">
            <img src={FIGMA_ASSETS.footerIllustration} alt="" className="ml-auto w-full max-w-[320px] opacity-90" />
          </div>
          <nav className="flex flex-wrap gap-x-5 gap-y-3 text-sm uppercase tracking-[0.18em]">
            <a href="#top" className="transition hover:text-white">
              About
            </a>
            <a href="#projects" className="transition hover:text-white">
              Participants
            </a>
            <a href="#location" className="transition hover:text-white">
              Location
            </a>
            <Link href="/admin/login" className="transition hover:text-white">
              Admin
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}

function ProjectCard({ project, index }: { project: HomeProject; index: number }) {
  const fields = project.expoFields;
  const thumb = projectThumb(fields);
  const title = projectTitle(fields);
  const location = projectLocation(fields);
  const taxRefund = fields.expo_field_09?.trim() || "On request";
  const pricePerMeter = formatRange(fields.expo_field_07, fields.expo_field_08);
  const priceRange = formatRange(fields.expo_field_17, fields.expo_field_18);
  const fallbackImage = FALLBACK_CARD_IMAGES[index % FALLBACK_CARD_IMAGES.length];

  return (
    <Link
      href={`/p/${project.slug}`}
      className="flex h-full flex-col rounded-[10px] border border-[#18fffb] bg-[rgba(43,168,176,0.45)] p-5 transition duration-200 hover:-translate-y-1 hover:bg-[rgba(43,168,176,0.62)]"
    >
      <h2 className="min-h-16 text-[1.6rem] font-bold uppercase leading-tight text-white">
        {title}
      </h2>
      <div className="relative mt-5 aspect-[1.5/1] overflow-hidden rounded-[10px] bg-[#1d5662]">
        <Image
          src={thumb || fallbackImage}
          alt={title}
          fill
          unoptimized
          className="object-cover"
          sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"
        />
      </div>
      <div className="mt-6 space-y-4 text-white">
        <InfoRow iconSrc={FIGMA_ASSETS.refundIcon} label="Income Tax Refund" value={taxRefund} />
        <InfoRow iconSrc={FIGMA_ASSETS.locationIcon} label="Location" value={location} />
        <InfoRow iconSrc={FIGMA_ASSETS.priceIcon} label="Price per m2" value={pricePerMeter} />
        <InfoRow iconSrc={FIGMA_ASSETS.rangeIcon} label="Price Range" value={priceRange} />
      </div>
    </Link>
  );
}

function InfoRow({
  iconSrc,
  label,
  value,
}: {
  iconSrc: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <img src={iconSrc} alt="" className="mt-0.5 h-5 w-5 shrink-0" />
      <div className="min-w-0">
        <p className="text-[0.72rem] uppercase tracking-[0.18em] text-[#192643]">{label}</p>
        <p className="text-sm leading-6 text-white">{value}</p>
      </div>
    </div>
  );
}
