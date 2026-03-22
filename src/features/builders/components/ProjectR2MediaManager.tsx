"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useState } from "react";
import { PROJECT_MEDIA_SUBFOLDERS } from "@/shared/lib/projectMediaR2Key";
import type { ProjectMediaSubfolder } from "@/shared/lib/projectMediaR2Key";

type FileEntry = {
  key: string;
  name: string;
  publicUrl: string;
};

type FolderEntry = {
  name: string;
  path: string;
};

type ApiResponse = {
  configured: boolean;
  mediaFolderId?: string | null;
  relativePath?: string;
  folders?: FolderEntry[];
  files?: FileEntry[];
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

function getParentPath(p: string): string {
  const parts = p.split("/").filter(Boolean);
  parts.pop();
  return parts.join("/");
}

function segmentLabel(segment: string): string {
  const sub = PROJECT_MEDIA_SUBFOLDERS.find((s) => s === segment);
  return sub ? SUBFOLDER_LABELS_HY[sub] : segment;
}

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
  const [relativePath, setRelativePath] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ApiResponse | null>(null);
  const [uploadBusy, setUploadBusy] = useState(false);
  const [deleteBusy, setDeleteBusy] = useState<string | null>(null);

  const load = useCallback(
    async (path: string) => {
      setLoading(true);
      setError(null);
      try {
        const u = new URL("/api/admin/project-media", window.location.origin);
        u.searchParams.set("projectId", projectId);
        u.searchParams.set("path", path);
        const res = await fetch(u.toString());
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
    },
    [projectId],
  );

  useEffect(() => {
    if (open && mediaFolderId) {
      void load(relativePath);
    }
  }, [open, mediaFolderId, relativePath, load]);

  const handleClose = () => {
    setOpen(false);
    setRelativePath("");
    setData(null);
    setError(null);
  };

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
      await load(relativePath);
      router.refresh();
    } catch {
      setError("Ցանցի սխալ");
    } finally {
      setDeleteBusy(null);
    }
  };

  const onUpload = async (fileList: FileList | null) => {
    const file = fileList?.[0];
    if (!file || !relativePath) {
      return;
    }
    setUploadBusy(true);
    setError(null);
    const fd = new FormData();
    fd.append("projectId", projectId);
    fd.append("relativePath", relativePath);
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
      await load(relativePath);
      router.refresh();
    } catch {
      setError("Ցանցի սխալ");
    } finally {
      setUploadBusy(false);
    }
  };

  const disabled = !mediaFolderId?.trim();
  const folders = data?.folders ?? [];
  const files = data?.files ?? [];
  const pathParts = relativePath.split("/").filter(Boolean);

  return (
    <div className="rounded-xl border border-teal-100 bg-gradient-to-br from-white to-teal-50/30 p-4 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-900">Պատկերասրահ R2</p>
          <p className="mt-1 text-xs text-slate-600">
            Պանակներից մեկը բացեք — ֆայլերը բեռնվում են միայն ընթացիկ մակարդակում։
          </p>
        </div>
        <button
          type="button"
          disabled={disabled}
          onClick={() => setOpen(true)}
          className={BTN_PRIMARY}
        >
          Բացել պատկերասրահը
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
            onClick={handleClose}
          />
          <div className="relative z-[101] flex max-h-[min(90vh,900px)] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h2 id={modalTitleId} className="text-lg font-bold text-slate-900">
                Նախագծի ֆայլեր R2-ում
              </h2>
              <button
                type="button"
                onClick={handleClose}
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
              >
                Փակել
              </button>
            </div>

            <div className="border-b border-slate-100 bg-slate-50/80 px-5 py-3">
              <nav className="flex flex-wrap items-center gap-1 text-xs text-slate-600">
                <button
                  type="button"
                  className="font-medium text-[#269a9e] hover:underline"
                  onClick={() => setRelativePath("")}
                >
                  projects
                </button>
                {pathParts.map((seg, i) => {
                  const upTo = pathParts.slice(0, i + 1).join("/");
                  return (
                    <span key={upTo} className="inline-flex items-center gap-1">
                      <span className="text-slate-400">/</span>
                      <button
                        type="button"
                        className="hover:text-[#269a9e] hover:underline"
                        onClick={() => setRelativePath(upTo)}
                      >
                        {segmentLabel(seg)}
                      </button>
                    </span>
                  );
                })}
              </nav>
              {relativePath ? (
                <div className="mt-3 flex w-full flex-wrap items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setRelativePath(getParentPath(relativePath))}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100"
                  >
                    ← Հետ
                  </button>
                  <label
                    className={`inline-flex shrink-0 cursor-pointer items-center rounded-lg border border-[#2eb0b4] bg-white px-3 py-1.5 text-sm font-medium text-[#2eb0b4] hover:bg-teal-50 ${uploadBusy ? "pointer-events-none opacity-50" : ""}`}
                  >
                    {uploadBusy ? "…" : "+ Վերբեռնել մեդիա"}
                    <input
                      type="file"
                      className="sr-only"
                      accept="image/*,application/pdf,.svg"
                      disabled={uploadBusy}
                      onChange={(e) => {
                        void onUpload(e.target.files);
                        e.target.value = "";
                      }}
                    />
                  </label>
                </div>
              ) : null}
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

              {data?.configured && !loading ? (
                <>
                  {!relativePath ? (
                    <p className="mb-3 text-sm text-slate-600">
                      Ընտրեք պանակ — ցուցադրվում են միայն այն պանակները, որոնք կան R2-ում։
                    </p>
                  ) : null}
                  {folders.length > 0 ? (
                    <ul className="mb-6 grid grid-cols-2 gap-4">
                      {folders.map((f) => (
                        <li key={f.path}>
                          <button
                            type="button"
                            onClick={() => setRelativePath(f.path)}
                            className="flex min-h-[5.5rem] w-full items-center gap-4 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50/80 px-5 py-5 text-left shadow-sm transition hover:border-[#2eb0b4]/50 hover:shadow-md"
                          >
                            <span
                              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-teal-100/80 text-3xl"
                              aria-hidden
                            >
                              📁
                            </span>
                            <span className="min-w-0">
                              <span className="block truncate text-base font-semibold text-slate-800">
                                {segmentLabel(f.name)}
                              </span>
                              <span className="mt-1 block truncate font-mono text-[0.8125rem] text-slate-500">
                                {f.path}
                              </span>
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : !relativePath ? (
                    <p className="text-sm text-slate-500">
                      Պանակներ չկան — ստեղծեք ենթապանակ R2-ում կամ վերբեռնեք ֆայլեր API-ով։
                    </p>
                  ) : null}

                  {relativePath ? (
                    <>
                      <h3 className="mb-2 text-sm font-semibold text-slate-700">Ֆայլեր</h3>
                      {files.length === 0 ? (
                        <p className="text-sm text-slate-500">Այս մակարդակում ֆայլեր չկան։</p>
                      ) : (
                        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                          {files.map((fItem) => {
                            const isImg =
                              /\.(jpe?g|png|gif|webp|svg)$/i.test(fItem.name) ||
                              fItem.publicUrl.match(/\.(jpe?g|png|gif|webp|svg)(\?|$)/i);
                            return (
                              <li
                                key={fItem.key}
                                className="flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-slate-50/80"
                              >
                                <div className="relative aspect-video w-full bg-white">
                                  {isImg ? (
                                    <Image
                                      src={fItem.publicUrl}
                                      alt=""
                                      fill
                                      className="object-contain p-1"
                                      sizes="(max-width:768px) 100vw, 33vw"
                                      unoptimized
                                    />
                                  ) : (
                                    <div className="flex h-full items-center justify-center p-2 text-center text-xs text-slate-600">
                                      {fItem.name}
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center justify-between gap-2 border-t border-slate-200/80 px-2 py-1.5">
                                  <span className="min-w-0 truncate font-mono text-xs text-slate-700">
                                    {fItem.name}
                                  </span>
                                  <button
                                    type="button"
                                    disabled={deleteBusy !== null}
                                    onClick={() => void onDelete(fItem.key)}
                                    className="shrink-0 rounded bg-red-500/90 px-2 py-0.5 text-xs text-white hover:bg-red-600 disabled:opacity-50"
                                  >
                                    {deleteBusy === fItem.key ? "…" : "Ջնջել"}
                                  </button>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </>
                  ) : null}
                </>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
