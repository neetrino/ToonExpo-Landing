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
  "inline-flex min-w-[3.25rem] items-center justify-center gap-1 rounded-md px-2 py-1.5 text-[11px] font-bold uppercase tracking-wide transition";

/** Նույն բարձրություն՝ ինչպես «Lending» կոճակը (`py-2.5` ≈ h-10) */
const TOOLBAR_BLOCK_CLASS =
  "flex h-10 min-w-0 shrink-0 items-center gap-2 rounded-xl border border-slate-200/80 bg-gradient-to-br from-white to-slate-50/90 px-2.5 shadow-sm ring-1 ring-slate-900/[0.03]";

const META_LABEL_CLASS = "w-[4.5rem] shrink-0 text-[8px] font-semibold uppercase leading-tight tracking-[0.1em] text-slate-500 sm:w-[5rem]";

const NUMBER_INPUT_NO_SPINNER =
  "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none";

type ProjectIdRowProps = {
  value: string;
  setValue: (v: string) => void;
  editing: boolean;
  onToggleEdit: () => void;
  pending: boolean;
};

function ProjectIdRow({ value, setValue, editing, onToggleEdit, pending }: ProjectIdRowProps) {
  return (
    <div
      className={`${TOOLBAR_BLOCK_CLASS} flex-1 sm:max-w-[min(100%,18rem)]`}
      title="Project ID — /p/{id} · public/project/{id}/"
    >
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#2eb0b4]/10 text-[#2eb0b4]">
        <IconLink2 className="h-3 w-3" />
      </span>
      <label htmlFor="project-public-id-input" className={META_LABEL_CLASS}>
        Project ID
      </label>
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
        className={`min-w-0 flex-1 border-0 bg-transparent font-mono text-sm font-semibold leading-none tracking-tight outline-none focus:ring-0 disabled:opacity-60 ${
          editing ? "text-slate-900" : "cursor-default text-slate-800 selection:bg-slate-200"
        }`}
      />
      <button
        type="button"
        disabled={pending}
        onClick={onToggleEdit}
        title={editing ? "Ավարտել խմբագրումը" : "Խմբագրել Project ID"}
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md border text-slate-500 transition ${
          editing
            ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            : "border-slate-200/90 bg-white hover:border-[#2eb0b4]/45 hover:text-[#2eb0b4]"
        } disabled:opacity-50`}
      >
        {editing ? <IconCheck className="h-3.5 w-3.5" /> : <IconPencil className="h-3.5 w-3.5" />}
      </button>
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
    <div
      className={`${TOOLBAR_BLOCK_CLASS} w-auto justify-center px-2`}
      title={published ? "Հրապարակված" : "Չհրապարակված"}
    >
      {published ? <input type="hidden" name="published" value="on" /> : null}
      <div
        className="inline-flex rounded-lg border border-slate-200/90 bg-slate-100/80 p-0.5 shadow-inner"
        role="group"
        aria-label={published ? "Published: on" : "Published: off"}
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
          <IconGlobe className="h-3 w-3 shrink-0 opacity-90" />
          on
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
          off
        </button>
      </div>
    </div>
  );
}

type SortOrderFieldProps = {
  defaultSortOrder: number;
  pending: boolean;
};

function SortOrderField({ defaultSortOrder, pending }: SortOrderFieldProps) {
  const [value, setValue] = useState(String(defaultSortOrder));

  useEffect(() => {
    setValue(String(defaultSortOrder));
  }, [defaultSortOrder]);

  return (
    <div
      className={`${TOOLBAR_BLOCK_CLASS} w-[11.25rem] shrink-0 sm:w-[12rem]`}
      title="Գլխավոր էջ · 1 = առաջինը, 0 = ավտոմատ"
    >
      <label htmlFor="project-sort-order-input" className={`${META_LABEL_CLASS} text-slate-600`}>
        Sorting №
      </label>
      <input
        id="project-sort-order-input"
        name="sortOrder"
        type="number"
        min={0}
        step={1}
        inputMode="numeric"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={pending}
        autoComplete="off"
        className={`${NUMBER_INPUT_NO_SPINNER} h-8 min-w-0 flex-1 rounded-md border border-slate-200/80 bg-white px-1.5 text-center font-mono text-sm font-semibold tabular-nums text-slate-900 shadow-inner outline-none transition focus:border-[#2eb0b4]/50 focus:ring-1 focus:ring-[#2eb0b4]/25 disabled:opacity-60`}
      />
    </div>
  );
}

type Props = {
  defaultProjectPublicId: string;
  defaultPublished: boolean;
  defaultSortOrder: number;
  showSaved: boolean;
  pending: boolean;
  landingButtonClass: string;
  lendingLabel: string;
  saveButton: ReactNode;
};

export function EditProjectMetaCard({
  defaultProjectPublicId,
  defaultPublished,
  defaultSortOrder,
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
    <div className="rounded-2xl border border-slate-200/90 bg-white p-3 shadow-sm sm:p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-5">
        <div className="flex min-w-0 flex-1 flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <ProjectIdRow
            value={projectIdValue}
            setValue={setProjectIdValue}
            editing={idEditing}
            onToggleEdit={() => setIdEditing((v) => !v)}
            pending={pending}
          />
          <SortOrderField defaultSortOrder={defaultSortOrder} pending={pending} />
          <PublishedToggle
            published={published}
            setPublished={setPublished}
            pending={pending}
          />
        </div>

        <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 border-t border-slate-100 pt-3 sm:gap-3 lg:border-t-0 lg:pt-0">
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
