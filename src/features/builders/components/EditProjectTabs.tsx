"use client";

import { useState } from "react";
import {
  EXPO_EDIT_SECTIONS,
  type ExpoEditSectionId,
} from "@/shared/constants/expoFieldKeys";
import type { ExpoFieldsFormValues } from "@/shared/lib/expoFields";
import { ProjectFieldsForm } from "@/features/builders/components/ProjectFieldsForm";

type Props = { defaults: ExpoFieldsFormValues };

export function EditProjectTabs({ defaults }: Props) {
  const [activeId, setActiveId] = useState<ExpoEditSectionId>(EXPO_EDIT_SECTIONS[0].id);

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
      <aside
        className="shrink-0 lg:w-[min(100%,17.5rem)] lg:sticky lg:top-6"
        aria-label="Խմբագրման բաժիններ"
      >
        <nav
          className="flex flex-col gap-1.5 rounded-2xl border border-slate-200/80 bg-gradient-to-b from-slate-50 to-slate-100/90 p-3 shadow-sm"
          role="tablist"
        >
          <p className="mb-1 px-3 pt-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Բաժիններ
          </p>
          {EXPO_EDIT_SECTIONS.map((section, index) => {
            const isActive = activeId === section.id;
            return (
              <button
                key={section.id}
                type="button"
                id={`section-btn-${section.id}`}
                role="tab"
                aria-selected={isActive}
                aria-controls={`section-panel-${section.id}`}
                onClick={() => setActiveId(section.id)}
                className={`group flex w-full items-start gap-3 rounded-xl border px-3 py-3.5 text-left transition-all duration-200 ${
                  isActive
                    ? "border-teal-200/80 bg-white shadow-md shadow-teal-900/5 ring-1 ring-teal-500/15"
                    : "border-transparent bg-transparent hover:border-slate-200/60 hover:bg-white/70"
                }`}
              >
                <span
                  className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold tabular-nums ${
                    isActive
                      ? "bg-[#2eb0b4] text-white"
                      : "bg-slate-200/80 text-slate-600 group-hover:bg-slate-300/80"
                  }`}
                >
                  {index + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    className={`block text-sm font-semibold leading-snug ${
                      isActive ? "text-slate-900" : "text-slate-700"
                    }`}
                  >
                    {section.titleHy}
                  </span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-slate-500">
                    {section.descriptionHy}
                  </span>
                </span>
              </button>
            );
          })}
        </nav>
      </aside>

      <div className="min-h-[24rem] min-w-0 flex-1">
        {EXPO_EDIT_SECTIONS.map((section) => {
          const isActive = activeId === section.id;
          return (
            <div
              key={section.id}
              role="tabpanel"
              id={`section-panel-${section.id}`}
              aria-labelledby={`section-btn-${section.id}`}
              hidden={!isActive}
              className={
                isActive
                  ? "rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-8"
                  : "sr-only"
              }
            >
              {isActive ? (
                <header className="mb-6 border-b border-slate-100 pb-4">
                  <h2 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                    {section.titleHy}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">{section.descriptionHy}</p>
                </header>
              ) : null}
              <ProjectFieldsForm defaults={defaults} sectionId={section.id} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
