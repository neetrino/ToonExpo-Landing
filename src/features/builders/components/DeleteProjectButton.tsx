"use client";

import { useTransition } from "react";
import { deleteProjectAction } from "@/features/builders/actions/projectActions";
import { IconTrash } from "@/features/admin/components/AdminUiIcons";

type Props = {
  projectId: string;
  slug: string;
  className?: string;
};

export function DeleteProjectButton({ projectId, slug, className }: Props) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      title="Ջնջել նախագիծը"
      onClick={() => {
        if (!window.confirm(`Ջնջել «${slug}»?`)) {
          return;
        }
        startTransition(() => {
          void deleteProjectAction(projectId);
        });
      }}
      className={`inline-flex items-center gap-2 rounded-xl border border-red-200/90 bg-white px-4 py-2.5 text-sm font-medium text-red-700 shadow-sm transition-all duration-200 hover:border-red-300 hover:bg-red-50 disabled:opacity-50 ${className ?? ""}`}
    >
      <IconTrash className="h-4 w-4 shrink-0" />
      {pending ? "Ջնջվում է…" : "Ջնջել"}
    </button>
  );
}
