"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import type { AdminProjectsViewMode } from "@/features/admin/lib/adminProjectsQuery";
import {
  IconCheck,
  IconCopy,
  IconExternal,
  IconFolder,
  IconGlobe,
  IconInboxEmpty,
} from "@/features/admin/components/AdminUiIcons";

const COPY_FEEDBACK_MS = 2000;

export type AdminProjectItem = {
  id: string;
  slug: string;
  published: boolean;
  title: string;
};

type Props = {
  projects: AdminProjectItem[];
  view: AdminProjectsViewMode;
};

function stopNav(e: React.MouseEvent) {
  e.stopPropagation();
}

function LandingActions({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);

  const copyUrl = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      const url = `${window.location.origin}/p/${slug}`;
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), COPY_FEEDBACK_MS);
      } catch {
        setCopied(false);
      }
    },
    [slug],
  );

  const btnBase =
    "inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/90 bg-white text-slate-600 shadow-sm transition-all duration-200 hover:scale-105 hover:border-[#2eb0b4]/40 hover:text-[#2eb0b4] hover:shadow-md active:scale-95";

  return (
    <div className="flex items-center gap-2" onClick={stopNav}>
      <a
        href={`/p/${slug}`}
        target="_blank"
        rel="noreferrer"
        title="Բացել լենդինգը"
        className={btnBase}
      >
        <IconExternal className="h-4 w-4" />
      </a>
      <button
        type="button"
        title="Պատճենել հղումը"
        onClick={copyUrl}
        className={`${btnBase} ${copied ? "border-emerald-300 text-emerald-600" : ""}`}
      >
        {copied ? <IconCheck className="h-4 w-4" /> : <IconCopy className="h-4 w-4" />}
      </button>
    </div>
  );
}

function StatusBadge({ published }: { published: boolean }) {
  if (published) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200/60 transition hover:ring-emerald-300">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <IconCheck className="h-3 w-3" />
        </span>
        Հրապարակված
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200/80 transition hover:bg-slate-200/50">
      Չհրապարակված
    </span>
  );
}

export function AdminProjectsViews({ projects, view }: Props) {
  const router = useRouter();

  if (projects.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-b from-white to-slate-50/80 p-14 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 transition hover:scale-105 hover:bg-slate-200/80">
          <IconInboxEmpty className="h-8 w-8" />
        </div>
        <p className="font-medium text-slate-600">Նախագծեր չեն գտնվել</p>
      </div>
    );
  }

  if (view === "cards") {
    return (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <div
            key={p.id}
            role="button"
            tabIndex={0}
            onClick={() => router.push(`/admin/projects/${p.id}/edit`)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                router.push(`/admin/projects/${p.id}/edit`);
              }
            }}
            className="group cursor-pointer rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#2eb0b4]/35 hover:shadow-lg hover:shadow-[#2eb0b4]/10"
          >
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#2eb0b4]/15 to-[#2eb0b4]/5 text-[#2eb0b4] transition group-hover:from-[#2eb0b4]/25 group-hover:to-[#2eb0b4]/10">
                <IconFolder className="h-5 w-5" />
              </span>
              <p className="line-clamp-2 flex-1 font-semibold leading-snug text-slate-900 transition group-hover:text-[#1a8a8e]">
                {p.title}
              </p>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
              <StatusBadge published={p.published} />
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <IconGlobe className="h-3.5 w-3.5" />
                <span>Լենդինգ</span>
              </div>
            </div>
            <div className="mt-3 flex justify-end" onClick={stopNav}>
              <LandingActions slug={p.slug} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
              <th className="px-5 py-4 pl-6 font-semibold text-slate-700">
                <span className="inline-flex items-center gap-2">
                  <IconFolder className="h-4 w-4 text-[#2eb0b4]" />
                  Նախագիծ
                </span>
              </th>
              <th className="px-5 py-4 font-semibold text-slate-700">Վիճակ</th>
              <th className="px-5 py-4 pr-6 font-semibold text-slate-700">
                <span className="inline-flex items-center gap-2">
                  <IconGlobe className="h-4 w-4 text-[#2eb0b4]" />
                  Լենդինգ
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr
                key={p.id}
                onClick={() => router.push(`/admin/projects/${p.id}/edit`)}
                className="group cursor-pointer border-b border-slate-100/90 transition-all duration-200 hover:bg-gradient-to-r hover:from-[#2eb0b4]/[0.06] hover:to-transparent hover:shadow-[inset_3px_0_0_0_#2eb0b4]"
              >
                <td className="px-5 py-4 pl-6">
                  <span className="inline-flex items-center gap-3 font-medium text-slate-900 transition group-hover:text-[#1a8a8e]">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition group-hover:bg-[#2eb0b4]/15 group-hover:text-[#2eb0b4]">
                      <IconFolder className="h-4 w-4" />
                    </span>
                    {p.title}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <StatusBadge published={p.published} />
                </td>
                <td className="px-5 py-4 pr-6" onClick={stopNav}>
                  <LandingActions slug={p.slug} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
