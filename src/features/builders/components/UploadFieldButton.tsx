"use client";

import { useState } from "react";

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
          `[name="${inputName}"]`,
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
    <div className="flex flex-wrap items-center gap-2">
      <label className="cursor-pointer text-sm text-[#2ba8b0] underline">
        {busy ? "…" : "Վերբեռնել"}
        <input type="file" className="sr-only" accept="image/*,application/pdf" onChange={onFile} />
      </label>
      {msg && msg !== "OK" ? <span className="text-xs text-red-600">{msg}</span> : null}
    </div>
  );
}
