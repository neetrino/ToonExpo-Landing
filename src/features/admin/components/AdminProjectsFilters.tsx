"use client";

type Props = {
  currentQ: string;
  currentPublished: string;
};

export function AdminProjectsFilters({ currentQ, currentPublished }: Props) {
  return (
    <form
      method="get"
      action="/admin/projects"
      className="flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm"
    >
      <label className="flex min-w-0 flex-1 items-center gap-2 sm:max-w-xs">
        <span className="shrink-0 text-sm font-medium text-slate-600">Փնտրել</span>
        <input
          type="search"
          name="q"
          defaultValue={currentQ}
          placeholder="slug կամ անվանում..."
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:border-[#2eb0b4] focus:outline-none focus:ring-1 focus:ring-[#2eb0b4]"
        />
      </label>
      <label className="flex items-center gap-2">
        <span className="text-sm font-medium text-slate-600">Հրապարակված</span>
        <select
          name="published"
          defaultValue={currentPublished}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-[#2eb0b4] focus:outline-none focus:ring-1 focus:ring-[#2eb0b4]"
        >
          <option value="all">Բոլորը</option>
          <option value="yes">Այո</option>
          <option value="no">Ոչ</option>
        </select>
      </label>
      <button
        type="submit"
        className="rounded-lg bg-[#2eb0b4] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#269a9e]"
      >
        Փնտրել
      </button>
    </form>
  );
}
