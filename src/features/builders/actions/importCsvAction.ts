"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/shared/lib/db";
import { logger } from "@/shared/lib/logger";
import {
  parseExpoCsvBuffer,
  slugFromRow,
  rowToExpoJson,
} from "@/features/import/csvImport";
import { sanitizeMediaFolderId } from "@/shared/lib/mediaFolderId";

async function ensureUniqueSlug(base: string): Promise<string> {
  let slug = base;
  let n = 0;
  while (await prisma.project.findUnique({ where: { slug } })) {
    n += 1;
    slug = `${base}-${n}`;
  }
  return slug;
}

export async function importProjectsFromCsvAction(
  formData: FormData,
): Promise<{ ok: true; imported: number } | { ok: false; error: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: "Unauthorized" };
  }
  const file = formData.get("file");
  if (!file || !(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Ֆայլ չկա" };
  }
  if (file.size > 5 * 1024 * 1024) {
    return { ok: false, error: "Ֆայլը մեծ է (max 5MB)" };
  }
  try {
    const buf = Buffer.from(await file.arrayBuffer());
    const rows = parseExpoCsvBuffer(buf);
    if (rows.length === 0) {
      return { ok: false, error: "Տվյալներ չկան" };
    }
    let imported = 0;
    for (let i = 0; i < rows.length; i += 1) {
      const row = rows[i];
      const base = slugFromRow(row, i);
      const slug = await ensureUniqueSlug(base);
      const folderId = sanitizeMediaFolderId(row.mediaFolderId ?? undefined);
      await prisma.project.create({
        data: {
          slug,
          published: true,
          expoFields: rowToExpoJson(row),
          mediaFolderId: folderId,
        },
      });
      imported += 1;
    }
    revalidatePath("/");
    revalidatePath("/admin/projects");
    return { ok: true, imported };
  } catch (e) {
    logger.error("importCsv", { error: String(e) });
    return { ok: false, error: "CSV վերլուծման սխալ" };
  }
}
