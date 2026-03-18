"use client";

import { useTransition } from "react";
import { deleteProjectAction } from "@/features/builders/actions/projectActions";

type Props = {
  projectId: string;
  slug: string;
};

export function DeleteProjectButton({ projectId, slug }: Props) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!window.confirm(`Ջնջել «${slug}»?`)) {
          return;
        }
        startTransition(() => {
          void deleteProjectAction(projectId);
        });
      }}
      className="rounded border border-red-200 px-2 py-1 text-xs text-red-700 disabled:opacity-50"
    >
      {pending ? "…" : "Ջնջել"}
    </button>
  );
}
