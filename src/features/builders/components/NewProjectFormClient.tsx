"use client";

import { useActionState } from "react";
import { createProjectAction } from "@/features/builders/actions/projectActions";
import { ProjectFieldsForm } from "@/features/builders/components/ProjectFieldsForm";
import { emptyExpoFields } from "@/shared/lib/expoFields";

export function NewProjectFormClient() {
  const [state, formAction, pending] = useActionState(createProjectAction, {});

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {state.error ? (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-800" role="alert">
          {state.error}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-6 rounded-xl border border-slate-200 bg-white p-4">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-slate-700">Project ID (ըստ ցանկության)</span>
          <input
            name="projectId"
            type="text"
            placeholder="օր. 37 — URL և public/project/37/"
            pattern="[a-z0-9]+([-_][a-z0-9]+)*"
            className="rounded-lg border border-slate-300 px-3 py-2 font-mono"
          />
          <span className="text-xs text-slate-500">
            Դատարկ թողնելու դեպքում slug-ը կկազմվի վերնագրից։
          </span>
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-600">
            Sorting №
          </span>
          <input
            name="sortOrder"
            type="number"
            min={0}
            step={1}
            inputMode="numeric"
            placeholder="0"
            defaultValue={0}
            title="Գլխավոր էջ · 1 = առաջինը, 0 = ավտոմատ"
            className="max-w-[7.5rem] rounded-lg border border-slate-300 px-2 py-2 text-center font-mono text-[15px] font-semibold tabular-nums [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input name="published" type="checkbox" defaultChecked className="h-4 w-4" />
          <span>Հրապարակված</span>
        </label>
      </div>

      <ProjectFieldsForm defaults={emptyExpoFields()} />

      <button
        type="submit"
        disabled={pending}
        className="max-w-xs rounded-lg bg-[#2ba8b0] py-3 font-semibold text-white disabled:opacity-50"
      >
        {pending ? "…" : "Պահպանել և խմբագրել"}
      </button>
    </form>
  );
}
