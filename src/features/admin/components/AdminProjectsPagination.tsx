import Link from "next/link";
import { buildAdminProjectsHref } from "@/features/admin/lib/adminProjectsQuery";
import type { AdminProjectsViewMode } from "@/features/admin/lib/adminProjectsQuery";
import { IconChevronLeft, IconChevronRight } from "@/features/admin/components/AdminUiIcons";

type Props = {
  page: number;
  totalPages: number;
  q: string;
  published: string;
  view: AdminProjectsViewMode;
};

const pageLinkClass =
  "inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:scale-[1.03] hover:border-[#2eb0b4]/40 hover:text-[#2eb0b4] hover:shadow-md active:scale-[0.98]";

export function AdminProjectsPagination({
  page,
  totalPages,
  q,
  published,
  view,
}: Props) {
  if (totalPages <= 1) {
    return null;
  }

  const href = (p: number) =>
    buildAdminProjectsHref({
      q,
      published,
      page: p > 1 ? p : undefined,
      view,
    });

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 py-6">
      {page > 1 ? (
        <Link href={href(page - 1)} className={pageLinkClass}>
          <IconChevronLeft className="h-4 w-4" />
          Նախորդ
        </Link>
      ) : null}
      <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600 ring-1 ring-slate-200/80">
        Էջ {page} / {totalPages}
      </span>
      {page < totalPages ? (
        <Link href={href(page + 1)} className={pageLinkClass}>
          Հաջորդ
          <IconChevronRight className="h-4 w-4" />
        </Link>
      ) : null}
    </div>
  );
}
