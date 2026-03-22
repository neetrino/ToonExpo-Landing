"use client";

import { useActionState } from "react";
import { updateProjectFormAction } from "@/features/builders/actions/projectActions";
import { EditProjectTabs } from "@/features/builders/components/EditProjectTabs";
import { EditProjectMetaCard } from "@/features/builders/components/EditProjectMetaCard";
import type { ExpoFieldsFormValues } from "@/shared/lib/expoFields";
import { IconSave } from "@/features/admin/components/AdminUiIcons";

const LANDING_BTN_CLASS =
  "inline-flex items-center gap-2 rounded-xl border border-slate-200/90 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-[#2eb0b4]/40 hover:text-[#2eb0b4] hover:shadow-md active:scale-[0.98]";

type Props = {
  projectId: string;
  defaultSlug: string;
  defaultPublished: boolean;
  defaultMediaFolderId: string | null;
  defaults: ExpoFieldsFormValues;
};

export function EditProjectFormClient({
  projectId,
  defaultSlug,
  defaultPublished,
  defaultMediaFolderId,
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

      <EditProjectMetaCard
        defaultProjectPublicId={defaultMediaFolderId ?? defaultSlug}
        defaultPublished={defaultPublished}
        showSaved={showSaved}
        pending={pending}
        landingButtonClass={LANDING_BTN_CLASS}
        lendingLabel="Lending"
        saveButton={
          <button
            type="submit"
            disabled={pending}
            title="Պահպանել"
            className="inline-flex items-center gap-2 rounded-xl bg-[#2eb0b4] px-5 py-2.5 font-semibold text-white shadow-md transition hover:bg-[#269a9e] disabled:opacity-50"
          >
            <IconSave className="h-5 w-5 shrink-0" />
            {pending ? "Պահպանվում է…" : "Պահպանել"}
          </button>
        }
      />

      <EditProjectTabs
        defaults={defaults}
        projectId={projectId}
        deleteConfirmSlug={defaultSlug}
      />
    </form>
  );
}
