"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { parseLatLng } from "@/shared/lib/mediaUrls";
import { isFieldNonEmpty } from "@/shared/lib/expoFields";
import { HomeMapPreview, type MapMarker } from "@/features/map/components/HomeMapPreview";

export type HomeProject = {
  id: string;
  slug: string;
  expoFields: Record<string, string>;
};

function projectTitle(f: Record<string, string>): string {
  return f.expo_field_02?.trim() || f.expo_field_01?.trim() || "—";
}

function projectThumb(f: Record<string, string>): string | null {
  const u = f.expo_field_50?.trim() || f.expo_field_43?.trim();
  if (u && /^https?:\/\//i.test(u)) {
    return u.split(/[\n;]/)[0]?.trim() ?? null;
  }
  return null;
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

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-4 py-4">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
          <h1 className="text-xl font-bold text-[#2ba8b0]">Toon Expo</h1>
          <Link href="/admin/login" className="text-sm text-slate-600 underline">
            Ադմին
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6">
          <label className="sr-only" htmlFor="home-search">
            Որոնում
          </label>
          <input
            id="home-search"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Որոնում՝ անուն, հասցե…"
            className="w-full max-w-md rounded-lg border border-slate-300 px-4 py-2 text-sm"
          />
        </div>

        <div className="mb-8 overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
          <HomeMapPreview markers={markers} className="h-[420px] w-full" />
        </div>

        {filtered.length === 0 ? (
          <p className="py-12 text-center text-slate-500">Արդյունք չկա</p>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => {
              const f = p.expoFields;
              const title = projectTitle(f);
              const thumb = projectThumb(f);
              const desc = f.expo_field_34?.slice(0, 120);
              return (
                <li key={p.id}>
                  <Link
                    href={`/p/${p.slug}`}
                    className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:border-[#2ba8b0]"
                  >
                    <div className="relative aspect-[16/10] bg-slate-200">
                      {thumb ? (
                        <Image src={thumb} alt="" fill className="object-cover" sizes="400px" />
                      ) : null}
                    </div>
                    <div className="flex flex-1 flex-col gap-2 p-4">
                      <h2 className="font-semibold text-slate-900">{title}</h2>
                      {isFieldNonEmpty(f.expo_field_03) ? (
                        <p className="text-sm text-slate-600">{f.expo_field_03}</p>
                      ) : null}
                      {desc ? (
                        <p className="line-clamp-2 text-sm text-slate-500">{desc}</p>
                      ) : null}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </div>
  );
}
