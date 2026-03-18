import Link from "next/link";
import { DeleteProjectButton } from "@/features/builders/components/DeleteProjectButton";

type ProjectRow = {
  id: string;
  slug: string;
  published: boolean;
  updatedAt: Date;
  title: string;
};

type Props = { projects: ProjectRow[] };

export function AdminProjectsList({ projects }: Props) {
  if (projects.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200/80 bg-white p-12 text-center shadow-sm">
        <p className="text-slate-500">Նախագծեր չեն գտնվել</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80">
              <th className="px-5 py-4 font-semibold text-slate-700">Նախագիծ</th>
              <th className="px-5 py-4 font-semibold text-slate-700">Slug</th>
              <th className="px-5 py-4 font-semibold text-slate-700">Վիճակ</th>
              <th className="px-5 py-4 font-semibold text-slate-700">Թարմացում</th>
              <th className="px-5 py-4 font-semibold text-slate-700">Գործողություն</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr
                key={p.id}
                className="border-b border-slate-100 transition hover:bg-slate-50/50"
              >
                <td className="px-5 py-3">
                  <span className="font-medium text-slate-900">{p.title || p.slug}</span>
                </td>
                <td className="px-5 py-3">
                  <Link
                    href={`/p/${p.slug}`}
                    className="text-[#2eb0b4] underline decoration-[#2eb0b4]/50 underline-offset-2 hover:decoration-[#2eb0b4]"
                    target="_blank"
                  >
                    {p.slug}
                  </Link>
                </td>
                <td className="px-5 py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      p.published
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {p.published ? "Հրապարակված" : "Չհրապարակված"}
                  </span>
                </td>
                <td className="px-5 py-3 text-slate-500">
                  {p.updatedAt.toISOString().slice(0, 10)}
                </td>
                <td className="px-5 py-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/admin/projects/${p.id}/edit`}
                      className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-[#2eb0b4] hover:text-white"
                    >
                      Խմբագրել
                    </Link>
                    <DeleteProjectButton projectId={p.id} slug={p.slug} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
