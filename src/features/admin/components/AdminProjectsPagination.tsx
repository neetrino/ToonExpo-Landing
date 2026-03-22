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

/** Եթե էջերի մեծ է այս քանակից — ցուցադրում ենք ընդհատված ցուցակ (ellipsis)։ */
const MAX_INLINE_PAGE_BUTTONS = 12;

const navLinkClass =
  "inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:scale-[1.03] hover:border-[#2eb0b4]/40 hover:text-[#2eb0b4] hover:shadow-md active:scale-[0.98]";

const pageNumberInactiveClass =
  "inline-flex min-h-[2.5rem] min-w-[2.5rem] items-center justify-center rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:scale-[1.03] hover:border-[#2eb0b4]/40 hover:text-[#2eb0b4] hover:shadow-md active:scale-[0.98]";

const pageNumberActiveClass =
  "inline-flex min-h-[2.5rem] min-w-[2.5rem] cursor-default items-center justify-center rounded-lg border border-[#2eb0b4] bg-[#2eb0b4]/10 px-2.5 py-2 text-sm font-semibold text-[#269a9e] shadow-sm ring-1 ring-[#2eb0b4]/40";

const ellipsisClass =
  "inline-flex min-w-[2rem] select-none items-center justify-center px-1 text-sm font-medium text-slate-400";

/**
 * Վերադարձնում է էջերի համարները կամ ellipsis, երբ ընդհանուր էջերը շատ են։
 */
function getPaginationItems(
  totalPages: number,
  currentPage: number,
): Array<number | "ellipsis"> {
  if (totalPages <= MAX_INLINE_PAGE_BUTTONS) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const delta = 1;
  const pageSet = new Set<number>();
  pageSet.add(1);
  pageSet.add(totalPages);
  for (
    let i = Math.max(2, currentPage - delta);
    i <= Math.min(totalPages - 1, currentPage + delta);
    i++
  ) {
    pageSet.add(i);
  }

  const sorted = [...pageSet].sort((a, b) => a - b);
  const out: Array<number | "ellipsis"> = [];
  const EPSILON_GAP = 1;

  for (let idx = 0; idx < sorted.length; idx++) {
    const n = sorted[idx];
    const prev = sorted[idx - 1];
    if (prev !== undefined && n - prev > EPSILON_GAP) {
      out.push("ellipsis");
    }
    out.push(n);
  }

  return out;
}

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

  const items = getPaginationItems(totalPages, page);

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 py-6">
      {page > 1 ? (
        <Link href={href(page - 1)} className={navLinkClass}>
          <IconChevronLeft className="h-4 w-4" />
          Նախորդ
        </Link>
      ) : null}

      <div
        className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2"
        role="navigation"
        aria-label="Էջերի ընտրություն"
      >
        {items.map((item, idx) =>
          item === "ellipsis" ? (
            <span
              key={`e-${idx}`}
              className={ellipsisClass}
              aria-hidden
            >
              …
            </span>
          ) : item === page ? (
            <span
              key={item}
              className={pageNumberActiveClass}
              aria-current="page"
            >
              {item}
            </span>
          ) : (
            <Link
              key={item}
              href={href(item)}
              className={pageNumberInactiveClass}
            >
              {item}
            </Link>
          ),
        )}
      </div>

      {page < totalPages ? (
        <Link href={href(page + 1)} className={navLinkClass}>
          Հաջորդ
          <IconChevronRight className="h-4 w-4" />
        </Link>
      ) : null}
    </div>
  );
}
