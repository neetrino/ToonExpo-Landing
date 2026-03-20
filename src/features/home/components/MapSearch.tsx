"use client";

const SEARCH_PLACEHOLDER = "Որոնում՝ անուն, հասցե…";

type MapSearchProps = {
  value: string;
  onChange: (value: string) => void;
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
  inputId?: string;
  className?: string;
};

export function MapSearch({
  value,
  onChange,
  expanded,
  onExpandedChange,
  inputId = "home-search",
  className,
}: MapSearchProps) {
  if (expanded) {
    return (
      <div className={`sm:w-[320px] ${className ?? ""}`}>
        <label className="sr-only" htmlFor={inputId}>
          Որոնում
        </label>
        <input
          id={inputId}
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => {
            if (!value.trim()) onExpandedChange(false);
          }}
          placeholder={SEARCH_PLACEHOLDER}
          autoFocus
          className="w-full rounded-full border border-white/40 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#2ba8b0]"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onExpandedChange(true)}
      className={`flex h-11 w-11 items-center justify-center rounded-xl border border-white/40 bg-white text-slate-600 transition hover:bg-slate-50 ${className ?? ""}`}
      aria-label="Открыть поиск"
    >
      <SearchIcon />
    </button>
  );
}

function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

