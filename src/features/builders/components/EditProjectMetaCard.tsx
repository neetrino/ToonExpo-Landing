"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  IconCheck,
  IconExternal,
  IconGlobe,
  IconLink2,
  IconPencil,
} from "@/features/admin/components/AdminUiIcons";

function sanitizeSlugInput(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-");
}

const SEGMENT_BTN =
  "inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition sm:text-sm";

type SlugRowProps = {
  slugValue: string;
  setSlugValue: (v: string) => void;
  slugEditing: boolean;
  onToggleEdit: () => void;
  pending: boolean;
};

function SlugRow({
  slugValue,
  setSlugValue,
  slugEditing,
  onToggleEdit,
  pending,
}: SlugRowProps) {
  const slugInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!slugEditing) {
      return;
    }
    const el = slugInputRef.current;
    if (el) {
      el.focus();
      el.select();
    }
  }, [slugEditing]);

  return (
    <div className="flex min-w-0 max-w-full items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/95 py-1.5 pl-2.5 pr-1 sm:max-w-[22rem]">
      <IconLink2 className="h-3.5 w-3.5 shrink-0 text-[#2eb0b4]" />
      <label
        htmlFor="project-slug-input"
        className="shrink-0 text-[11px] font-bold uppercase tracking-wider text-slate-500"
      >
        Slug
      </label>
      <input
        ref={slugInputRef}
        id="project-slug-input"
        name="slug"
        value={slugValue}
        onChange={(e) => setSlugValue(sanitizeSlugInput(e.target.value))}
        readOnly={!slugEditing}
        required
        minLength={1}
        maxLength={100}
        pattern="[a-z0-9]+(-[a-z0-9]+)*"
        disabled={pending}
        autoComplete="off"
        spellCheck={false}
        className={`min-w-0 flex-1 border-0 bg-transparent py-0.5 font-mono text-sm outline-none focus:ring-0 disabled:opacity-60 ${
          slugEditing
            ? "text-slate-900"
            : "cursor-default text-slate-600 selection:bg-slate-200"
        }`}
      />
      <button
        type="button"
        disabled={pending}
        onClick={onToggleEdit}
        title={slugEditing ? "Ավարտել խմբագրումը" : "Խմբագրել slug"}
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition ${
          slugEditing
            ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            : "border-slate-200 bg-white text-slate-500 hover:border-[#2eb0b4]/40 hover:text-[#2eb0b4]"
        } disabled:opacity-50`}
      >
        {slugEditing ? <IconCheck className="h-4 w-4" /> : <IconPencil className="h-4 w-4" />}
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
  defaultSlug: string;
  defaultPublished: boolean;
  showSaved: boolean;
  pending: boolean;
  landingButtonClass: string;
  lendingLabel: string;
  saveButton: ReactNode;
};

export function EditProjectMetaCard({
  defaultSlug,
  defaultPublished,
  showSaved,
  pending,
  landingButtonClass,
  lendingLabel,
  saveButton,
}: Props) {
  const [published, setPublished] = useState(defaultPublished);
  const [slugValue, setSlugValue] = useState(defaultSlug);
  const [slugEditing, setSlugEditing] = useState(false);

  useEffect(() => {
    setSlugValue(defaultSlug);
    setPublished(defaultPublished);
  }, [defaultSlug, defaultPublished]);

  useEffect(() => {
    if (showSaved) {
      setSlugEditing(false);
    }
  }, [showSaved]);

  const landingPath = slugValue.trim() ? `/p/${slugValue.trim()}` : `/p/${defaultSlug}`;

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
        <div className="flex min-w-0 flex-1 flex-col items-stretch gap-4 sm:flex-row sm:flex-wrap sm:items-center lg:gap-5">
          <SlugRow
            slugValue={slugValue}
            setSlugValue={setSlugValue}
            slugEditing={slugEditing}
            onToggleEdit={() => setSlugEditing((v) => !v)}
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
