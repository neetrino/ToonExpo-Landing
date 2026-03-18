import Link from "next/link";
import { prisma } from "@/shared/lib/db";
import { CsvImportForm } from "@/features/admin/components/CsvImportForm";
import { DeleteProjectButton } from "@/features/builders/components/DeleteProjectButton";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { updatedAt: "desc" },
    select: { id: true, slug: true, published: true, updatedAt: true },
  });

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Նախագծեր</h1>
        <Link
          href="/admin/projects/new"
          className="rounded-lg bg-[#2ba8b0] px-4 py-2 text-sm font-medium text-white"
        >
          + Նոր նախագիծ
        </Link>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="mb-3 text-lg font-semibold">CSV ներմուծում</h2>
        <CsvImportForm />
      </section>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="p-3 font-semibold">Slug</th>
              <th className="p-3 font-semibold">Հրապարակված</th>
              <th className="p-3 font-semibold">Թարմացում</th>
              <th className="p-3 font-semibold">Գործողություն</th>
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-6 text-center text-slate-500">
                  Դատարկ է
                </td>
              </tr>
            ) : (
              projects.map((p) => (
                <tr key={p.id} className="border-b border-slate-100">
                  <td className="p-3">
                    <Link href={`/p/${p.slug}`} className="text-[#2ba8b0] underline" target="_blank">
                      {p.slug}
                    </Link>
                  </td>
                  <td className="p-3">{p.published ? "Այո" : "Ոչ"}</td>
                  <td className="p-3 text-slate-600">
                    {p.updatedAt.toISOString().slice(0, 10)}
                  </td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/admin/projects/${p.id}/edit`}
                        className="rounded border border-slate-300 px-2 py-1 text-xs"
                      >
                        Խմբագրել
                      </Link>
                      <DeleteProjectButton projectId={p.id} slug={p.slug} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
