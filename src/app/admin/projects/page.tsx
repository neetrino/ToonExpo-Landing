import Link from "next/link";
import { Suspense } from "react";
import { IconPlus } from "@/features/admin/components/AdminUiIcons";
import { fetchProjectsPage } from "@/features/admin/lib/fetchProjectsPage";
import type { AdminProjectsViewMode } from "@/features/admin/lib/adminProjectsQuery";
import { AdminProjectsToolbar } from "@/features/admin/components/AdminProjectsToolbar";
import { AdminProjectsViews } from "@/features/admin/components/AdminProjectsViews";
import { AdminProjectsPagination } from "@/features/admin/components/AdminProjectsPagination";

export const dynamic = "force-dynamic";

function expoTitle(raw: unknown): string {
  if (!raw || typeof raw !== "object") return "";
  const o = raw as Record<string, unknown>;
  const v = o.expo_field_02 ?? o.expo_field_01;
  return typeof v === "string" ? v.trim() : "";
}

export default async function AdminProjectsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const qRaw = params.q;
  const publishedRaw = params.published;
  const pageRaw = params.page;
  const viewRaw = params.view;

  const q = Array.isArray(qRaw) ? qRaw[0] ?? "" : qRaw ?? "";
  const publishedFilter = (
    Array.isArray(publishedRaw) ? publishedRaw[0] : publishedRaw
  ) as string | undefined;
  const pub =
    publishedFilter === "yes" || publishedFilter === "no"
      ? publishedFilter
      : "all";
  const pageNum = Math.max(
    1,
    parseInt(String(Array.isArray(pageRaw) ? pageRaw[0] : pageRaw ?? "1"), 10) || 1,
  );
  const view: AdminProjectsViewMode =
    (Array.isArray(viewRaw) ? viewRaw[0] : viewRaw) === "cards" ? "cards" : "list";

  const { rows, total, page, pageSize } = await fetchProjectsPage({
    page: pageNum,
    q: String(q),
    published: pub,
  });

  const list = rows.map((p) => ({
    id: p.id,
    slug: p.slug,
    projectId: p.mediaFolderId ?? p.slug,
    published: p.published,
    sortOrder: p.sortOrder,
    title: expoTitle(p.expoFields) || p.slug,
  }));

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Նախագծեր
        </h1>
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#2eb0b4] to-[#269a9e] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#2eb0b4]/25 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-[#2eb0b4]/30 active:scale-[0.98]"
        >
          <IconPlus className="h-4 w-4" />
          Նոր նախագիծ
        </Link>
      </div>

      <Suspense fallback={<div className="h-16 rounded-2xl bg-slate-100" />}>
        <AdminProjectsToolbar initialPublished={pub} initialView={view} />
      </Suspense>

      <AdminProjectsViews projects={list} view={view} />

      <AdminProjectsPagination
        page={page}
        totalPages={totalPages}
        q={String(q).trim()}
        published={pub}
        view={view}
      />
    </div>
  );
}
