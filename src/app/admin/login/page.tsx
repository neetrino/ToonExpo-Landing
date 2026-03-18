import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AdminLoginForm } from "@/features/admin/components/AdminLoginForm";

export default async function AdminLoginPage(props: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const session = await auth();
  if (session) {
    redirect("/admin/projects");
  }
  const searchParams = await props.searchParams;
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-center text-xl font-semibold text-slate-800">
          Ադմին մուտք
        </h1>
        <AdminLoginForm callbackUrl={searchParams.callbackUrl ?? "/admin/projects"} />
      </div>
    </div>
  );
}
