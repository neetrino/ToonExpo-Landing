"use client";

import { useState, useId } from "react";
import Image from "next/image";

const SEP = "\n";

function parseUrls(raw: string): string[] {
  return raw
    .split(SEP)
    .map((s) => s.trim())
    .filter((s) => /^https?:\/\//i.test(s));
}

function joinUrls(urls: string[]): string {
  return urls.filter(Boolean).join(SEP);
}

type Props = {
  name: string;
  label: string;
  defaultValue: string;
};

export function MediaListField({ name, label, defaultValue }: Props) {
  const [urls, setUrls] = useState<string[]>(() => parseUrls(defaultValue));
  const [newUrl, setNewUrl] = useState("");
  const [uploadBusy, setUploadBusy] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const id = useId();

  const value = joinUrls(urls);

  const addUrl = (url: string) => {
    const u = url.trim();
    if (u && /^https?:\/\//i.test(u) && !urls.includes(u)) {
      setUrls((prev) => [...prev, u]);
    }
  };

  const remove = (index: number) => {
    setUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const onFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploadError(null);
    setUploadBusy(true);
    const added: string[] = [];
    for (let i = 0; i < files.length; i += 1) {
      const file = files[i];
      const fd = new FormData();
      fd.append("file", file);
      try {
        const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
        const data = (await res.json()) as { url?: string; error?: string };
        if (res.ok && data.url) {
          added.push(data.url);
        } else {
          setUploadError(data.error ?? "Սխալ");
        }
      } catch {
        setUploadError("Ցանցի սխալ");
      }
    }
    if (added.length) {
      setUrls((prev) => [...prev, ...added]);
    }
    setUploadBusy(false);
    e.target.value = "";
  };

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-slate-700">
        {label}
      </label>
      <input type="hidden" name={name} value={value} readOnly />
      <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4">
        {urls.length > 0 ? (
          <ul className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {urls.map((url, i) => (
              <li key={`${url}-${i}`} className="relative group">
                <div className="relative aspect-video overflow-hidden rounded-lg border border-slate-200 bg-white">
                  <Image
                    src={url}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width:640px) 50vw, 25vw"
                  />
                  <button
                    type="button"
                    onClick={() => remove(i)}
                    className="absolute right-1 top-1 rounded bg-red-500/90 px-2 py-0.5 text-xs text-white hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : null}
        <div className="flex flex-wrap items-center gap-3">
          <input
            id={id}
            type="url"
            placeholder="https://..."
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addUrl(newUrl);
                setNewUrl("");
              }
            }}
            className="min-w-[200px] flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-[#2eb0b4] focus:outline-none focus:ring-1 focus:ring-[#2eb0b4]"
          />
          <button
            type="button"
            onClick={() => {
              addUrl(newUrl);
              setNewUrl("");
            }}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Ավելացնել URL
          </button>
          <label className="cursor-pointer rounded-lg bg-[#2eb0b4] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#269a9e] disabled:opacity-50">
            {uploadBusy ? "…" : "Վերբեռնել ֆայլեր"}
            <input
              type="file"
              className="sr-only"
              accept="image/*"
              multiple
              disabled={uploadBusy}
              onChange={onFileSelect}
            />
          </label>
        </div>
        {uploadError ? (
          <p className="mt-2 text-sm text-red-600">{uploadError}</p>
        ) : null}
      </div>
    </div>
  );
}
