"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  buildAdminProjectsHref,
  type AdminProjectsViewMode,
} from "@/features/admin/lib/adminProjectsQuery";
import {
  IconFilter,
  IconGrid,
  IconList,
  IconSearch,
} from "@/features/admin/components/AdminUiIcons";

const DEBOUNCE_MS = 400;

type Props = {
  initialPublished: string;
  initialView: AdminProjectsViewMode;
};

export function AdminProjectsToolbar({ initialPublished, initialView }: Props) {
  const router = useRouter();
  const sp = useSearchParams();
  const qFromUrl = sp.get("q") ?? "";
  const published = sp.get("published") ?? initialPublished;
  const view = (sp.get("view") === "cards" ? "cards" : "list") as AdminProjectsViewMode;
  const pageFromUrl = Math.max(1, parseInt(sp.get("page") ?? "1", 10) || 1);

  const [search, setSearch] = useState(qFromUrl);
  const skipSearchReplace = useRef(true);

  useEffect(() => {
    setSearch(qFromUrl);
  }, [qFromUrl]);

  const replaceQuery = useCallback(
    (args: {
      q?: string;
      published?: string;
      page?: number;
      view?: AdminProjectsViewMode;
    }) => {
      const href = buildAdminProjectsHref({
        q: args.q ?? search,
        published: args.published ?? published,
        page: args.page ?? (pageFromUrl > 1 ? pageFromUrl : undefined),
        view: args.view ?? view,
      });
      router.replace(href);
    },
    [router, search, published, view, pageFromUrl],
  );

  useEffect(() => {
    if (skipSearchReplace.current) {
      skipSearchReplace.current = false;
      return;
    }
    const t = setTimeout(() => {
      const trimmed = search.trim();
      const urlQ = qFromUrl.trim();
      if (trimmed === urlQ) {
        return;
      }
      replaceQuery({ q: trimmed, page: 1 });
    }, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [search, qFromUrl, replaceQuery]);

  const viewBtn =
    "inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-200";

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/90 bg-gradient-to-br from-white to-slate-50/50 p-4 shadow-sm sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
      <div className="relative min-w-0 flex-1 sm:max-w-md">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          <IconSearch className="h-4 w-4" />
        </span>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="slug կամ անվանում…"
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm shadow-inner transition-all duration-200 placeholder:text-slate-400 focus:border-[#2eb0b4] focus:outline-none focus:ring-2 focus:ring-[#2eb0b4]/20"
          autoComplete="off"
        />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 shadow-sm transition hover:border-[#2eb0b4]/30 hover:shadow-md">
          <IconFilter className="h-4 w-4 shrink-0 text-[#2eb0b4]" />
          <select
            value={published === "yes" || published === "no" ? published : "all"}
            onChange={(e) => {
              replaceQuery({ published: e.target.value, page: 1 });
            }}
            className="min-w-[7rem] border-0 bg-transparent py-1 text-sm font-medium text-slate-700 focus:outline-none focus:ring-0"
          >
            <option value="all">Բոլորը</option>
            <option value="yes">Այո</option>
            <option value="no">Ոչ</option>
          </select>
        </label>
        <div className="flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
          <button
            type="button"
            onClick={() => replaceQuery({ view: "list", page: pageFromUrl })}
            className={`${viewBtn} ${
              view === "list"
                ? "bg-gradient-to-r from-[#2eb0b4] to-[#269a9e] text-white shadow-md"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <IconList className="h-4 w-4" />
            Ցանկ
          </button>
          <button
            type="button"
            onClick={() => replaceQuery({ view: "cards", page: pageFromUrl })}
            className={`${viewBtn} ${
              view === "cards"
                ? "bg-gradient-to-r from-[#2eb0b4] to-[#269a9e] text-white shadow-md"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <IconGrid className="h-4 w-4" />
            Քարտեր
          </button>
        </div>
      </div>
    </div>
  );
}
