"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/shared/lib/db";
import { logger } from "@/shared/lib/logger";
import {
  expoFieldsFormSchema,
  expoFieldsToJson,
} from "@/shared/lib/expoFields";
import { slugifyTitle } from "@/shared/lib/slug";
import { sanitizeMediaFolderId } from "@/shared/lib/mediaFolderId";
import { parseProjectSortOrder } from "@/shared/lib/parseProjectSortOrder";
import { z } from "zod";

const projectMetaSchema = z.object({
  published: z.coerce.boolean().optional().default(true),
});

function parsePublicProjectId(raw: unknown): string | null {
  if (typeof raw !== "string") {
    return null;
  }
  return sanitizeMediaFolderId(raw.trim().toLowerCase());
}

async function requireAdmin(): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/admin/login");
  }
}

async function ensureUniqueSlug(base: string, excludeId?: string): Promise<string> {
  let slug = base;
  let n = 0;
  while (true) {
    const existing = await prisma.project.findUnique({ where: { slug } });
    if (!existing || existing.id === excludeId) {
      return slug;
    }
    n += 1;
    slug = `${base}-${n}`;
  }
}

export async function createProjectAction(
  _prev: { error?: string },
  formData: FormData,
): Promise<{ error?: string }> {
  await requireAdmin();
  const title =
    (formData.get("expo_field_02") as string)?.trim() ||
    (formData.get("expo_field_01") as string)?.trim() ||
    "project";
  const fromProjectId = parsePublicProjectId(formData.get("projectId"));
  let slugBase: string;
  let mediaFolderId: string | null;
  if (fromProjectId) {
    slugBase = fromProjectId;
    mediaFolderId = fromProjectId;
  } else {
    slugBase = slugifyTitle(title, "project");
    mediaFolderId = null;
  }
  const slug = await ensureUniqueSlug(slugBase);

  const published = formData.get("published") === "on";
  const sortOrder = parseProjectSortOrder(formData.get("sortOrder"));
  const values: Record<string, string> = {};
  const { EXPO_FIELD_KEYS } = await import("@/shared/constants/expoFieldKeys");
  for (const k of EXPO_FIELD_KEYS) {
    values[k] = (formData.get(k) as string) ?? "";
  }
  const parsedFields = expoFieldsFormSchema.safeParse(values);
  if (!parsedFields.success) {
    return { error: "Դաշտերի վալիդացիա" };
  }
  const expoJson = expoFieldsToJson(parsedFields.data);

  let created: { id: string };
  try {
    created = await prisma.project.create({
      data: {
        slug,
        published,
        expoFields: expoJson,
        mediaFolderId,
        sortOrder,
      },
    });
  } catch (e) {
    logger.error("createProjectAction", { error: String(e) });
    return { error: "Ստեղծումը ձախողվեց" };
  }
  revalidatePath("/");
  revalidatePath("/admin/projects");
  revalidatePath(`/p/${slug}`);
  revalidatePath(`/p/${slug}/mobile`);
  redirect(`/admin/projects/${created.id}/edit`);
}

export async function updateProjectAction(
  projectId: string,
  _prev: unknown,
  formData: FormData,
): Promise<{ ok: false; error: string } | { ok: true }> {
  await requireAdmin();
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) {
    return { ok: false, error: "Չի գտնվել" };
  }
  try {
    const publicId = parsePublicProjectId(formData.get("projectId"));
    if (!publicId) {
      return { ok: false, error: "Project ID — անվավեր կամ դատարկ" };
    }
    const meta = projectMetaSchema.safeParse({ published: formData.get("published") === "on" });
    if (!meta.success) {
      return { ok: false, error: "Վիճակի վալիդացիա" };
    }
    const slug = await ensureUniqueSlug(publicId, project.id);

    const values: Record<string, string> = {};
    const { EXPO_FIELD_KEYS } = await import("@/shared/constants/expoFieldKeys");
    for (const k of EXPO_FIELD_KEYS) {
      values[k] = (formData.get(k) as string) ?? "";
    }
    const parsedFields = expoFieldsFormSchema.safeParse(values);
    if (!parsedFields.success) {
      return { ok: false, error: "Դաշտերի վալիդացիա" };
    }
    const expoJson = expoFieldsToJson(parsedFields.data);
    const sortOrder = parseProjectSortOrder(formData.get("sortOrder"));

    await prisma.project.update({
      where: { id: projectId },
      data: {
        slug,
        published: meta.data.published,
        expoFields: expoJson,
        mediaFolderId: publicId,
        sortOrder,
      },
    });
    revalidatePath("/");
    revalidatePath("/admin/projects");
    revalidatePath(`/p/${slug}`);
    revalidatePath(`/p/${slug}/mobile`);
    if (project.slug !== slug) {
      revalidatePath(`/p/${project.slug}`);
      revalidatePath(`/p/${project.slug}/mobile`);
    }
    return { ok: true };
  } catch (e) {
    logger.error("updateProjectAction", { error: String(e) });
    return { ok: false, error: "Թարմացումը ձախողվեց" };
  }
}

export async function updateProjectFormAction(
  _prev: { ok?: boolean; error?: string },
  formData: FormData,
): Promise<{ ok: boolean; error?: string }> {
  const id = formData.get("_projectId") as string;
  if (!id?.trim()) {
    return { ok: false, error: "ID բացակայում է" };
  }
  return updateProjectAction(id, null, formData);
}

export async function deleteProjectAction(projectId: string): Promise<void> {
  await requireAdmin();
  const p = await prisma.project.findUnique({ where: { id: projectId } });
  if (p) {
    await prisma.project.delete({ where: { id: projectId } });
    revalidatePath("/");
    revalidatePath("/admin/projects");
    revalidatePath(`/p/${p.slug}`);
    revalidatePath(`/p/${p.slug}/mobile`);
  }
  redirect("/admin/projects");
}
