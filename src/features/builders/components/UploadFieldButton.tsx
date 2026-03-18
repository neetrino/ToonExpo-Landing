"use client";

import { useState } from "react";

const BTN_CLASS =
  "inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-lg bg-[#2eb0b4] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#269a9e] disabled:opacity-50";

type Props = {
  inputName: string;
};

export function UploadFieldButton({ inputName }: Props) {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) {
      return;
    }
    setMsg(null);
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", f);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok) {
        setMsg(data.error ?? "Սխալ");
        return;
      }
      if (data.url) {
        const input = document.querySelector<HTMLInputElement | HTMLTextAreaElement>(
          `[name="${CSS.escape(inputName)}"]`,
        );
        if (input) {
          input.value = data.url;
        }
        setMsg("OK");
      }
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <label className={`${BTN_CLASS} ${busy ? "pointer-events-none" : ""}`}>
        {busy ? "…" : "Վերբեռնել"}
        <input type="file" className="sr-only" accept="image/*,application/pdf" onChange={onFile} />
      </label>
      {msg && msg !== "OK" ? <span className="text-xs text-red-600">{msg}</span> : null}
    </div>
  );
}
