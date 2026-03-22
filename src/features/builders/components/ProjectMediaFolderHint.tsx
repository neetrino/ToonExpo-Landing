"use client";

import Image from "next/image";

export type ProjectMediaFolderHintProps = {
  mediaFolderId: string | null;
  /** Լոգոյի URL՝ նույնը, ինչ resolveProjectFolderMedia-ն (R2 կամ /project/...) */
  folderLogoUrl: string | null;
  /** Օրինակ ամբողջական R2 URL, եթե env-ում կա R2_PUBLIC_URL */
  exampleLogoPublicUrl: string | null;
};

/**
 * Մեդիա ներդիրում — R2 պանակի հիշեցում և լոգոյի նախադիտում (եթե ֆայլը կա)։
 */
export function ProjectMediaFolderHint({
  mediaFolderId,
  folderLogoUrl,
  exampleLogoPublicUrl,
}: ProjectMediaFolderHintProps) {
  const id = mediaFolderId?.trim() || "—";
  const relKey = mediaFolderId?.trim()
    ? `projects/${mediaFolderId.trim()}/Logo/Logo.png`
    : "projects/{Project ID}/Logo/Logo.png";

  return (
    <div className="rounded-xl border border-teal-200/80 bg-teal-50/40 p-4 text-sm text-slate-800">
      <p className="font-semibold text-slate-900">Նախագծի ֆայլեր (R2)</p>
      <p className="mt-2 text-slate-700">
        Հիմնական պատկերները և PDF-ները պահեք Cloudflare R2-ում՝ նույն կառուցվածքով, ինչ լենդինգը սպասում է
        (տե՛ս docs/50-PROJECT-MEDIA.md)։ Project ID. <span className="font-mono text-teal-900">{id}</span>
      </p>
      <p className="mt-2 font-mono text-xs text-slate-600 break-all">
        R2 object key. {relKey}
      </p>
      {exampleLogoPublicUrl ? (
        <p className="mt-1 font-mono text-xs text-slate-500 break-all">
          Օրինակ URL. {exampleLogoPublicUrl}
        </p>
      ) : null}
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
        <p className="text-slate-700">Լոգո լենդինգում (ըստ ֆայլի պանակում)</p>
        {folderLogoUrl ? (
          <div className="relative h-14 w-40 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white">
            <Image
              src={folderLogoUrl}
              alt=""
              fill
              className="object-contain p-1"
              sizes="160px"
              unoptimized={folderLogoUrl.startsWith("http")}
            />
          </div>
        ) : (
          <span className="text-slate-500">ֆայլը չի գտնվել (կամ դեռ չի վերբեռնվել)</span>
        )}
      </div>
    </div>
  );
}
