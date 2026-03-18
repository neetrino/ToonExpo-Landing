"use client";

import { useActionState } from "react";
import { updateProjectFormAction } from "@/features/builders/actions/projectActions";
import { EditProjectTabs } from "@/features/builders/components/EditProjectTabs";
import { DeleteProjectButton } from "@/features/builders/components/DeleteProjectButton";
import type { ExpoFieldsFormValues } from "@/shared/lib/expoFields";
import { IconGlobe, IconLink2, IconSave } from "@/features/admin/components/AdminUiIcons";

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

      <div className="sticky top-0 z-20 -mx-4 border-b border-slate-200/90 bg-slate-100/95 px-4 py-3 shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-slate-100/80">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-2">
            {state?.error ? (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
                {state.error}
              </p>
            ) : null}
            {showSaved ? (
              <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
                Պահպանված է
              </p>
            ) : null}
          </div>
          <button
            type="submit"
            disabled={pending}
            title="Պահպանել"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#2eb0b4] px-5 py-2.5 font-semibold text-white shadow-md transition hover:bg-[#269a9e] disabled:opacity-50 sm:px-6 sm:py-3"
          >
            <IconSave className="h-5 w-5" />
            {pending ? "Պահպանվում է…" : "Պահպանել"}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <label className="flex flex-col gap-1 text-sm">
          <span className="inline-flex items-center gap-2 font-medium text-slate-700">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-[#2eb0b4]">
              <IconLink2 className="h-3.5 w-3.5" />
            </span>
            Slug
          </span>
          <input
            name="slug"
            type="text"
            defaultValue={defaultSlug}
            required
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
            className="rounded-lg border border-slate-300 px-3 py-2 focus:border-[#2eb0b4] focus:outline-none focus:ring-1 focus:ring-[#2eb0b4]"
          />
        </label>
        <label className="flex items-center gap-3 text-sm">
          <input
            name="published"
            type="checkbox"
            defaultChecked={defaultPublished}
            className="h-4 w-4 rounded border-slate-300 text-[#2eb0b4] focus:ring-[#2eb0b4]"
          />
          <span className="inline-flex items-center gap-2 font-medium text-slate-700">
            <IconGlobe className="h-4 w-4 text-[#2eb0b4]" />
            Հրապարակված
          </span>
        </label>
      </div>

      <EditProjectTabs defaults={defaults} />

      <div className="flex justify-start border-t border-slate-200/90 pt-6">
        <DeleteProjectButton projectId={projectId} slug={defaultSlug} />
      </div>
    </form>
  );
}
