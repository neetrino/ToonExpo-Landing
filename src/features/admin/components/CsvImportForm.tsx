"use client";

import { useState } from "react";
import { importProjectsFromCsvAction } from "@/features/builders/actions/importCsvAction";

export function CsvImportForm() {
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);
    setPending(true);
    const fd = new FormData(e.currentTarget);
    const res = await importProjectsFromCsvAction(fd);
    setPending(false);
    if (res.ok) {
      setMsg(`Ներմուծվեց ${res.imported} տող`);
      e.currentTarget.reset();
    } else {
      setMsg(res.error);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-slate-600">ToonExpoData2026.csv</span>
        <input name="file" type="file" accept=".csv,text/csv" required className="text-sm" />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-[#ffd24d] px-4 py-2 text-sm font-semibold text-slate-900 disabled:opacity-50"
      >
        {pending ? "…" : "Ներմուծել"}
      </button>
      {msg ? <p className="text-sm text-slate-700">{msg}</p> : null}
    </form>
  );
}
