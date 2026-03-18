"use client";

import { useState } from "react";
import { EXPO_FIELD_GROUPS, type ExpoFieldGroupId } from "@/shared/constants/expoFieldKeys";
import type { ExpoFieldsFormValues } from "@/shared/lib/expoFields";
import { ProjectFieldsForm } from "@/features/builders/components/ProjectFieldsForm";

type Props = { defaults: ExpoFieldsFormValues };

export function EditProjectTabs({ defaults }: Props) {
  const [activeId, setActiveId] = useState<ExpoFieldGroupId>(EXPO_FIELD_GROUPS[0].id);

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200">
        <nav className="-mb-px flex flex-wrap gap-1" role="tablist" aria-label="Բաժիններ">
          {EXPO_FIELD_GROUPS.map((group) => (
            <button
              key={group.id}
              type="button"
              id={`tab-btn-${group.id}`}
              role="tab"
              aria-selected={activeId === group.id}
              aria-controls={`tab-${group.id}`}
              onClick={() => setActiveId(group.id)}
              className={`rounded-t-lg border px-4 py-2.5 text-sm font-medium transition ${
                activeId === group.id
                  ? "border-slate-200 border-b-white bg-white text-[#2eb0b4]"
                  : "border-transparent text-slate-600 hover:border-slate-200 hover:text-slate-900"
              }`}
            >
              {group.titleHy}
            </button>
          ))}
        </nav>
      </div>

      <div className="min-h-[320px]">
        {EXPO_FIELD_GROUPS.map((group) => (
          <div
            key={group.id}
            role="tabpanel"
            hidden={activeId !== group.id}
            className={activeId !== group.id ? "sr-only" : undefined}
            id={`tab-${group.id}`}
            aria-labelledby={`tab-btn-${group.id}`}
          >
            <ProjectFieldsForm defaults={defaults} groupId={group.id} />
          </div>
        ))}
      </div>
    </div>
  );
}
