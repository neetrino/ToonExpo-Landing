import Link from "next/link";
import { NewProjectFormClient } from "@/features/builders/components/NewProjectFormClient";

export default function NewProjectPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/projects" className="text-sm text-slate-600 underline">
          ← Ցանկ
        </Link>
        <h1 className="text-2xl font-bold">Նոր նախագիծ</h1>
      </div>
      <NewProjectFormClient />
    </div>
  );
}
