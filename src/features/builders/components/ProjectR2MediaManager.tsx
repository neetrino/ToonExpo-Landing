"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useState } from "react";
import { PROJECT_MEDIA_SUBFOLDERS } from "@/shared/lib/projectMediaR2Key";
import type { ProjectMediaSubfolder } from "@/shared/lib/projectMediaR2Key";

type GroupedFile = {
  key: string;
  name: string;
  publicUrl: string;
};

type ApiResponse = {
  configured: boolean;
  mediaFolderId?: string | null;
  groups?: Record<string, GroupedFile[]>;
  error?: string;
};

const BTN_PRIMARY =
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2eb0b4] to-[#269a9e] px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50";

const SUBFOLDER_LABELS_HY: Record<ProjectMediaSubfolder, string> = {
  Exterior: "Արտաքին (Exterior)",
  Interior: "Ներքին (Interior)",
  "3DFloorplan": "3D հատակագիծ",
  "2Dfloorplan": "2D հատակագիծ",
  Logo: "Լոգո (Logo)",
};

export function ProjectR2MediaManager({
  projectId,
  mediaFolderId,
}: {
  projectId: string;
  mediaFolderId: string | null;
}) {
  const router = useRouter();
  const modalTitleId = useId();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ApiResponse | null>(null);
  const [uploadBusy, setUploadBusy] = useState<ProjectMediaSubfolder | null>(null);
  const [deleteBusy, setDeleteBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/admin/project-media?projectId=${encodeURIComponent(projectId)}`,
      );
      const json = (await res.json()) as ApiResponse;
      if (!res.ok) {
        setError(json.error ?? "Սխալ");
        setData(null);
        return;
      }
      setData(json);
    } catch {
      setError("Ցանցի սխալ");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    if (open && mediaFolderId) {
      void load();
    }
  }, [open, mediaFolderId, load]);

  const onDelete = async (key: string) => {
    if (!confirm("Ջնջե՞լ այս ֆայլը R2-ից։")) {
      return;
    }
    setDeleteBusy(key);
    setError(null);
    try {
      const u = new URL("/api/admin/project-media", window.location.origin);
      u.searchParams.set("projectId", projectId);
      u.searchParams.set("key", key);
      const res = await fetch(u.toString(), { method: "DELETE" });
      const json = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(json.error ?? "Ջնջումը ձախողվեց");
        return;
      }
      await load();
      router.refresh();
    } catch {
      setError("Ցանցի սխալ");
    } finally {
      setDeleteBusy(null);
    }
  };

  const onUpload = async (subfolder: ProjectMediaSubfolder, fileList: FileList | null) => {
    const file = fileList?.[0];
    if (!file) {
      return;
    }
    setUploadBusy(subfolder);
    setError(null);
    const fd = new FormData();
    fd.append("projectId", projectId);
    fd.append("subfolder", subfolder);
    fd.append("file", file);
    try {
      const res = await fetch("/api/admin/project-media/upload", {
        method: "POST",
        body: fd,
      });
      const json = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(json.error ?? "Վերբեռնումը ձախողվեց");
        return;
      }
      await load();
      router.refresh();
    } catch {
      setError("Ցանցի սխալ");
    } finally {
      setUploadBusy(null);
    }
  };

  const disabled = !mediaFolderId?.trim();

  return (
    <div className="rounded-xl border border-teal-100 bg-gradient-to-br from-white to-teal-50/30 p-4 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-900">Պատկերասրահ R2</p>
          <p className="mt-1 text-xs text-slate-600">
            Դիտել, վերբեռնել և ջնջել ֆայլերը նախագծի պանակում (`projects/…/Exterior`, …, `Logo`)։
          </p>
        </div>
        <button
          type="button"
          disabled={disabled}
          onClick={() => setOpen(true)}
          className={BTN_PRIMARY}
        >
          Բացել ֆայլերը
        </button>
      </div>
      {disabled ? (
        <p className="mt-2 text-xs text-amber-700">
          Նախ լրացրեք Project ID վերևում — առանց դրա պանակ չկա։
        </p>
      ) : null}

      {open ? (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-900/50 p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby={modalTitleId}
        >
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            aria-label="Փակել"
            onClick={() => setOpen(false)}
          />
          <div className="relative z-[101] flex max-h-[min(90vh,900px)] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h2 id={modalTitleId} className="text-lg font-bold text-slate-900">
                Նախագծի ֆայլեր R2-ում
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
              >
                Փակել
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
              {loading ? (
                <p className="text-sm text-slate-500">Բեռնվում է…</p>
              ) : null}
              {error ? (
                <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
                  {error}
                </p>
              ) : null}
              {data && !data.configured ? (
                <p className="text-sm text-amber-800">
                  R2-ը կարգավորված չէ — տե՛ս env (R2_ACCOUNT_ID, …)։
                </p>
              ) : null}
              {data?.configured && data.groups
                ? PROJECT_MEDIA_SUBFOLDERS.map((sub) => {
                    const files = data.groups?.[sub] ?? [];
                    return (
                      <section key={sub} className="mb-8 border-b border-slate-100 pb-6 last:mb-0 last:border-0 last:pb-0">
                        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                          <h3 className="text-base font-semibold text-slate-800">
                            {SUBFOLDER_LABELS_HY[sub]}
                          </h3>
                          <label
                            className={`inline-flex cursor-pointer items-center rounded-lg border border-[#2eb0b4] bg-white px-3 py-1.5 text-sm font-medium text-[#2eb0b4] hover:bg-teal-50 ${uploadBusy === sub ? "pointer-events-none opacity-50" : ""}`}
                          >
                            {uploadBusy === sub ? "…" : "+ Վերբեռնել"}
                            <input
                              type="file"
                              className="sr-only"
                              accept="image/*,application/pdf,.svg"
                              disabled={uploadBusy !== null}
                              onChange={(e) => {
                                void onUpload(sub, e.target.files);
                                e.target.value = "";
                              }}
                            />
                          </label>
                        </div>
                        {files.length === 0 ? (
                          <p className="text-sm text-slate-500">Դատարկ է։</p>
                        ) : (
                          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {files.map((f) => {
                              const isImg =
                                /\.(jpe?g|png|gif|webp|svg)$/i.test(f.name) ||
                                f.publicUrl.match(/\.(jpe?g|png|gif|webp|svg)(\?|$)/i);
                              return (
                                <li
                                  key={f.key}
                                  className="flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-slate-50/80"
                                >
                                  <div className="relative aspect-video w-full bg-white">
                                    {isImg ? (
                                      <Image
                                        src={f.publicUrl}
                                        alt=""
                                        fill
                                        className="object-contain p-1"
                                        sizes="(max-width:768px) 100vw, 33vw"
                                        unoptimized
                                      />
                                    ) : (
                                      <div className="flex h-full items-center justify-center p-2 text-center text-xs text-slate-600">
                                        {f.name}
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex items-center justify-between gap-2 border-t border-slate-200/80 px-2 py-1.5">
                                    <span className="min-w-0 truncate font-mono text-xs text-slate-700">
                                      {f.name}
                                    </span>
                                    <button
                                      type="button"
                                      disabled={deleteBusy !== null}
                                      onClick={() => void onDelete(f.key)}
                                      className="shrink-0 rounded bg-red-500/90 px-2 py-0.5 text-xs text-white hover:bg-red-600 disabled:opacity-50"
                                    >
                                      {deleteBusy === f.key ? "…" : "Ջնջել"}
                                    </button>
                                  </div>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </section>
                    );
                  })
                : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
