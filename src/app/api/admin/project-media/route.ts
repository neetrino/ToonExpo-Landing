import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/shared/lib/db";
import { logger } from "@/shared/lib/logger";
import {
  deleteObjectFromR2,
  isR2Configured,
  listR2ObjectsAtLevel,
} from "@/shared/lib/r2";
import { sanitizeMediaFolderId } from "@/shared/lib/mediaFolderId";
import {
  PROJECT_MEDIA_SUBFOLDERS,
  buildProjectPrefixFromRelativePath,
  relativePathFromAbsolutePrefix,
  validateProjectMediaObjectKey,
} from "@/shared/lib/projectMediaR2Key";

export const runtime = "nodejs";

type FileEntry = {
  key: string;
  name: string;
  publicUrl: string;
};

type FolderEntry = {
  name: string;
  path: string;
};

function publicUrlForKey(key: string): string {
  const base = process.env.R2_PUBLIC_URL?.replace(/\/$/, "") ?? "";
  return `${base}/${key}`;
}

export async function GET(req: Request): Promise<NextResponse> {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const url = new URL(req.url);
  const projectId = url.searchParams.get("projectId")?.trim();
  const pathParam = url.searchParams.get("path")?.trim() ?? "";
  if (!projectId) {
    return NextResponse.json({ error: "projectId required" }, { status: 400 });
  }
  if (!isR2Configured()) {
    return NextResponse.json({
      configured: false as const,
      error: "R2 not configured",
      mediaFolderId: null as string | null,
      relativePath: "",
      folders: [] as FolderEntry[],
      files: [] as FileEntry[],
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

  const levelPrefix = buildProjectPrefixFromRelativePath(mf, pathParam);
  if (!levelPrefix) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  const { commonPrefixes, objectKeys } = await listR2ObjectsAtLevel(levelPrefix);

  const folders: FolderEntry[] = [];
  for (const cp of commonPrefixes) {
    const rel = relativePathFromAbsolutePrefix(mf, cp);
    if (!rel) {
      continue;
    }
    const name = rel.split("/").filter(Boolean).pop() ?? rel;
    folders.push({ name, path: rel });
  }
  /**
   * R2/S3-ում «դատարկ պանակ» գոյություն չունի — առանց օբյեկտի CommonPrefixes չի գալիս։
   * Ռութում ավելացնում ենք allowlist-ի ենթապանակները, որպեսզի դատարկ Interior-ը նույնպես երևա։
   */
  if (pathParam === "") {
    const seen = new Set(folders.map((f) => f.path));
    for (const sub of PROJECT_MEDIA_SUBFOLDERS) {
      if (!seen.has(sub)) {
        folders.push({ name: sub, path: sub });
        seen.add(sub);
      }
    }
  }
  folders.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

  const files: FileEntry[] = [];
  const normalizedLevel = levelPrefix.endsWith("/") ? levelPrefix : `${levelPrefix}/`;
  for (const key of objectKeys) {
    if (!key.startsWith(normalizedLevel)) {
      continue;
    }
    const name = key.slice(normalizedLevel.length);
    if (!name || name.includes("/")) {
      continue;
    }
    files.push({
      key,
      name,
      publicUrl: publicUrlForKey(key),
    });
  }
  files.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

  return NextResponse.json({
    configured: true as const,
    mediaFolderId: mf,
    relativePath: pathParam,
    folders,
    files,
  });
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
