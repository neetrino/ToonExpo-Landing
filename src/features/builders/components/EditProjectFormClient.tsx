"use client";

import { useActionState } from "react";
import { updateProjectFormAction } from "@/features/builders/actions/projectActions";
import { ProjectFieldsForm } from "@/features/builders/components/ProjectFieldsForm";
import type { ExpoFieldsFormValues } from "@/shared/lib/expoFields";

type Props = {
  projectId: string;
  defaultSlug: string;
  defaultPublished: boolean;
  defaults: ExpoFieldsFormValues;
};

export function EditProjectFormClient({
  projectId,
  defaultSlug,
  defaultPublished,
  defaults,
}: Props) {
  const [state, formAction, pending] = useActionState(updateProjectFormAction, {
    ok: false,
  });

  const showSaved = state.ok === true && !state.error;

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <input type="hidden" name="_projectId" value={projectId} />

      {state?.error ? (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-800" role="alert">
          {state.error}
        </p>
      ) : null}
      {showSaved ? (
        <p className="rounded-lg bg-emerald-50 px-4 py-2 text-sm text-emerald-800">
          Պահպանված է
        </p>
      ) : null}

      <div className="flex flex-wrap gap-6 rounded-xl border border-slate-200 bg-white p-4">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-slate-700">Slug</span>
          <input
            name="slug"
            type="text"
            defaultValue={defaultSlug}
            required
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
            className="rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            name="published"
            type="checkbox"
            defaultChecked={defaultPublished}
            className="h-4 w-4"
          />
          <span>Հրապարակված</span>
        </label>
      </div>

      <ProjectFieldsForm defaults={defaults} />

      <button
        type="submit"
        disabled={pending}
        className="max-w-xs rounded-lg bg-[#2ba8b0] py-3 font-semibold text-white disabled:opacity-50"
      >
        {pending ? "…" : "Պահպանել"}
      </button>
    </form>
  );
}
