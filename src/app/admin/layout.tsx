import Link from "next/link";
import { auth } from "@/auth";
import { logoutAction } from "@/features/admin/actions/logoutAction";
import { IconExternal, IconFolder } from "@/features/admin/components/AdminUiIcons";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="min-h-screen bg-slate-100">
      {session ? (
        <header className="border-b border-slate-200/90 bg-white shadow-sm">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
            <nav className="flex flex-wrap items-center gap-5 text-sm font-medium">
              <Link
                href="/admin/projects"
                className="inline-flex items-center gap-2 rounded-lg px-2 py-1 text-[#2eb0b4] transition-all duration-200 hover:bg-[#2eb0b4]/10 hover:text-[#269a9e]"
              >
                <IconFolder className="h-4 w-4" />
                Նախագծեր
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-slate-500 transition-all duration-200 hover:bg-slate-100 hover:text-slate-800"
                target="_blank"
              >
                <IconExternal className="h-3.5 w-3.5" />
                Կայք
              </Link>
            </nav>
            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-slate-100 hover:text-slate-900 active:scale-[0.98]"
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
