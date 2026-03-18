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
    <div className="min-h-screen bg-slate-50">
      {session ? (
        <header className="border-b border-slate-200 bg-white px-4 py-3">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
            <nav className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-700">
              <Link href="/admin/projects" className="text-[#2ba8b0]">
                Նախագծեր
              </Link>
              <Link href="/admin/projects/new">Նոր նախագիծ</Link>
              <Link href="/" className="text-slate-500">
                Կայք
              </Link>
            </nav>
            <form action={logoutAction}>
              <button type="submit" className="text-sm text-slate-600 underline">
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
