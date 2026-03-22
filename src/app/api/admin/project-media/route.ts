import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/shared/lib/db";
import { logger } from "@/shared/lib/logger";
import {
  deleteObjectFromR2,
  isR2Configured,
  listR2ObjectKeysUnderPrefix,
} from "@/shared/lib/r2";
import { sanitizeMediaFolderId } from "@/shared/lib/mediaFolderId";
import {
  PROJECT_MEDIA_SUBFOLDERS,
  validateProjectMediaObjectKey,
} from "@/shared/lib/projectMediaR2Key";

export const runtime = "nodejs";

type GroupedFile = {
  key: string;
  name: string;
  publicUrl: string;
};

function publicUrlForKey(key: string): string {
  const base = process.env.R2_PUBLIC_URL?.replace(/\/$/, "") ?? "";
  return `${base}/${key}`;
}

function groupKeysBySubfolder(
  mediaFolderId: string,
  keys: string[],
): Record<string, GroupedFile[]> {
  const id = sanitizeMediaFolderId(mediaFolderId);
  if (!id) {
    return {};
  }
  const prefix = `projects/${id}/`;
  const out: Record<string, GroupedFile[]> = {};
  for (const sub of PROJECT_MEDIA_SUBFOLDERS) {
    out[sub] = [];
  }
  for (const key of keys) {
    if (!key.startsWith(prefix)) {
      continue;
    }
    const rest = key.slice(prefix.length);
    const parts = rest.split("/").filter(Boolean);
    if (parts.length < 2) {
      continue;
    }
    const sub = parts[0];
    if (!out[sub]) {
      continue;
    }
    const name = parts.slice(1).join("/");
    out[sub].push({
      key,
      name,
      publicUrl: publicUrlForKey(key),
    });
  }
  for (const sub of PROJECT_MEDIA_SUBFOLDERS) {
    out[sub].sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
  }
  return out;
}

export async function GET(req: Request): Promise<NextResponse> {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const projectId = new URL(req.url).searchParams.get("projectId")?.trim();
  if (!projectId) {
    return NextResponse.json({ error: "projectId required" }, { status: 400 });
  }
  if (!isR2Configured()) {
    return NextResponse.json({
      configured: false as const,
      error: "R2 not configured",
      groups: {} as Record<string, GroupedFile[]>,
      mediaFolderId: null as string | null,
    });
  }
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { mediaFolderId: true },
  });
  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }
  const mf = sanitizeMediaFolderId(project.mediaFolderId ?? undefined);
  if (!mf) {
    return NextResponse.json(
      { error: "Project has no media folder id" },
      { status: 400 },
    );
  }
  const prefix = `projects/${mf}/`;
  const keys = await listR2ObjectKeysUnderPrefix(prefix);
  const groups = groupKeysBySubfolder(mf, keys);
  return NextResponse.json({ configured: true as const, mediaFolderId: mf, groups });
}

export async function DELETE(req: Request): Promise<NextResponse> {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const projectId = new URL(req.url).searchParams.get("projectId")?.trim();
  const key = new URL(req.url).searchParams.get("key")?.trim();
  if (!projectId || !key) {
    return NextResponse.json({ error: "projectId and key required" }, { status: 400 });
  }
  if (!isR2Configured()) {
    return NextResponse.json({ error: "R2 not configured" }, { status: 503 });
  }
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { mediaFolderId: true },
  });
  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }
  const mf = sanitizeMediaFolderId(project.mediaFolderId ?? undefined);
  if (!mf) {
    return NextResponse.json({ error: "No media folder" }, { status: 400 });
  }
  const v = validateProjectMediaObjectKey(mf, key);
  if (!v.ok) {
    return NextResponse.json({ error: "Invalid key" }, { status: 400 });
  }
  const ok = await deleteObjectFromR2(key);
  if (!ok) {
    logger.warn("project-media delete failed", { key });
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
