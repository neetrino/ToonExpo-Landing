"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  IconCheck,
  IconExternal,
  IconGlobe,
  IconLink2,
  IconPencil,
} from "@/features/admin/components/AdminUiIcons";

function sanitizeProjectIdInput(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "")
    .replace(/-{2,}/g, "-");
}

const SEGMENT_BTN =
  "inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition sm:text-sm";

type ProjectIdRowProps = {
  value: string;
  setValue: (v: string) => void;
  editing: boolean;
  onToggleEdit: () => void;
  pending: boolean;
};

function ProjectIdRow({ value, setValue, editing, onToggleEdit, pending }: ProjectIdRowProps) {
  return (
    <div className="flex min-w-0 max-w-full flex-col gap-1 rounded-xl border border-slate-200 bg-slate-50/95 px-2.5 py-2 sm:max-w-[22rem]">
      <div className="flex min-w-0 items-center gap-2">
        <IconLink2 className="h-3.5 w-3.5 shrink-0 text-[#2eb0b4]" />
        <label
          htmlFor="project-public-id-input"
          className="text-[11px] font-bold uppercase tracking-wider text-slate-500"
        >
          Project ID
        </label>
      </div>
      <div className="flex min-w-0 items-center gap-1">
        <input
          id="project-public-id-input"
          name="projectId"
          value={value}
          onChange={(e) => setValue(sanitizeProjectIdInput(e.target.value))}
          readOnly={!editing}
          required
          minLength={1}
          maxLength={100}
          pattern="[a-z0-9]+([-_][a-z0-9]+)*"
          disabled={pending}
          autoComplete="off"
          spellCheck={false}
          className={`min-w-0 flex-1 border-0 bg-transparent font-mono text-sm outline-none focus:ring-0 disabled:opacity-60 ${
            editing ? "text-slate-900" : "cursor-default text-slate-600 selection:bg-slate-200"
          }`}
        />
        <button
          type="button"
          disabled={pending}
          onClick={onToggleEdit}
          title={editing ? "Ավարտել խմբագրումը" : "Խմբագրել Project ID"}
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition ${
            editing
              ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
              : "border-slate-200 bg-white text-slate-500 hover:border-[#2eb0b4]/40 hover:text-[#2eb0b4]"
          } disabled:opacity-50`}
        >
          {editing ? <IconCheck className="h-4 w-4" /> : <IconPencil className="h-4 w-4" />}
        </button>
      </div>
      <p className="text-[10px] leading-snug text-slate-500">
        URL /p/… և public/project/…/ (նույն Project ID արժեքը)
      </p>
    </div>
  );
}

type PublishedToggleProps = {
  published: boolean;
  setPublished: (v: boolean) => void;
  pending: boolean;
};

function PublishedToggle({ published, setPublished, pending }: PublishedToggleProps) {
  return (
    <div className="flex shrink-0 items-center">
      {published ? <input type="hidden" name="published" value="on" /> : null}
      <div
        className="inline-flex rounded-xl border border-slate-200/90 bg-slate-100/80 p-1 shadow-inner"
        role="group"
        aria-label="Հրապարակման վիճակ"
      >
        <button
          type="button"
          disabled={pending}
          onClick={() => setPublished(true)}
          className={`${SEGMENT_BTN} ${
            published
              ? "bg-[#2eb0b4] text-white shadow-sm"
              : "text-slate-500 hover:bg-white/80 hover:text-slate-700"
          }`}
        >
          <IconGlobe className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Հրապարակված
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => setPublished(false)}
          className={`${SEGMENT_BTN} ${
            !published
              ? "bg-slate-600 text-white shadow-sm"
              : "text-slate-500 hover:bg-white/80 hover:text-slate-700"
          }`}
        >
          Չհրապարակված
        </button>
      </div>
    </div>
  );
}

type Props = {
  defaultProjectPublicId: string;
  defaultPublished: boolean;
  showSaved: boolean;
  pending: boolean;
  landingButtonClass: string;
  lendingLabel: string;
  saveButton: ReactNode;
};

export function EditProjectMetaCard({
  defaultProjectPublicId,
  defaultPublished,
  showSaved,
  pending,
  landingButtonClass,
  lendingLabel,
  saveButton,
}: Props) {
  const [published, setPublished] = useState(defaultPublished);
  const [projectIdValue, setProjectIdValue] = useState(defaultProjectPublicId);
  const [idEditing, setIdEditing] = useState(false);

  useEffect(() => {
    setProjectIdValue(defaultProjectPublicId);
    setPublished(defaultPublished);
  }, [defaultProjectPublicId, defaultPublished]);

  useEffect(() => {
    if (showSaved) {
      setIdEditing(false);
    }
  }, [showSaved]);

  const landingPath = projectIdValue.trim() ? `/p/${projectIdValue.trim()}` : `/p/${defaultProjectPublicId}`;

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
        <div className="flex min-w-0 flex-1 flex-col items-stretch gap-4 sm:flex-row sm:flex-wrap sm:items-center lg:gap-5">
          <ProjectIdRow
            value={projectIdValue}
            setValue={setProjectIdValue}
            editing={idEditing}
            onToggleEdit={() => setIdEditing((v) => !v)}
            pending={pending}
          />
          <PublishedToggle
            published={published}
            setPublished={setPublished}
            pending={pending}
          />
        </div>

        <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 border-t border-slate-100 pt-4 sm:gap-3 lg:border-t-0 lg:pt-0">
          <a
            href={landingPath}
            target="_blank"
            rel="noreferrer"
            className={landingButtonClass}
          >
            <IconExternal className="h-4 w-4 shrink-0 text-[#2eb0b4]" />
            {lendingLabel}
          </a>
          {saveButton}
        </div>
      </div>
    </div>
  );
}
