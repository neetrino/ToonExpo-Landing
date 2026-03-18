import Link from "next/link";
import { prisma } from "@/shared/lib/db";
import { CsvImportForm } from "@/features/admin/components/CsvImportForm";
import { DeleteProjectButton } from "@/features/builders/components/DeleteProjectButton";
import { AdminProjectsList } from "@/features/admin/components/AdminProjectsList";
import { AdminProjectsFilters } from "@/features/admin/components/AdminProjectsFilters";

export const dynamic = "force-dynamic";

type SearchParams = { q?: string; published?: string };

export default async function AdminProjectsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const qRaw = params.q;
  const publishedRaw = params.published;
  const q = Array.isArray(qRaw) ? qRaw[0] ?? "" : qRaw ?? "";
  const publishedFilter = Array.isArray(publishedRaw) ? publishedRaw[0] ?? "all" : publishedRaw ?? "all";
  const qNorm = String(q).trim().toLowerCase();
  const publishedOnly =
    publishedFilter === "yes" ? true : publishedFilter === "no" ? false : null;

  const projects = await prisma.project.findMany({
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      slug: true,
      published: true,
      updatedAt: true,
      expoFields: true,
    },
  });

  const expoTitle = (raw: unknown): string => {
    if (!raw || typeof raw !== "object") return "";
    const o = raw as Record<string, unknown>;
    const v = o.expo_field_02 ?? o.expo_field_01;
    return typeof v === "string" ? v.trim() : "";
  };

  let filtered = projects;
  if (qNorm) {
    filtered = projects.filter((p) => {
      const title = expoTitle(p.expoFields);
      return (
        p.slug.toLowerCase().includes(qNorm) ||
        title.toLowerCase().includes(qNorm)
      );
    });
  }
  if (publishedOnly !== null) {
    filtered = filtered.filter((p) => p.published === publishedOnly);
  }

  const list = filtered.map((p) => ({
    id: p.id,
    slug: p.slug,
    published: p.published,
    updatedAt: p.updatedAt,
    title: expoTitle(p.expoFields) || p.slug,
  }));

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Նախագծեր
        </h1>
        <Link
          href="/admin/projects/new"
          className="rounded-xl bg-[#2eb0b4] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#269a9e]"
        >
          + Նոր նախագիծ
        </Link>
      </div>

      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-base font-semibold text-slate-800">
          CSV ներմուծում
        </h2>
        <CsvImportForm />
      </section>

      <AdminProjectsFilters currentQ={q} currentPublished={publishedFilter} />

      <AdminProjectsList projects={list} />
    </div>
  );
}
