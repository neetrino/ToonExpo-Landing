import Link from "next/link";
import { auth } from "@/auth";
import { logoutAction } from "@/features/admin/actions/logoutAction";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="min-h-screen bg-slate-100">
      {session ? (
        <header className="border-b border-slate-200 bg-white shadow-sm">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
            <nav className="flex flex-wrap items-center gap-6 text-sm font-medium">
              <Link
                href="/admin/projects"
                className="text-[#2eb0b4] transition hover:text-[#269a9e]"
              >
                Նախագծեր
              </Link>
              <Link
                href="/admin/projects/new"
                className="text-slate-600 transition hover:text-slate-900"
              >
                Նոր նախագիծ
              </Link>
              <Link href="/" className="text-slate-500 hover:text-slate-700" target="_blank">
                Կայք →
              </Link>
            </nav>
            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-lg px-3 py-1.5 text-sm text-slate-600 transition hover:bg-slate-100"
              >
                Ելք
              </button>
            </form>
          </div>
        </header>
      ) : null}
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
