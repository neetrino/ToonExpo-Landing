import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/shared/lib/db";
import { logger } from "@/shared/lib/logger";
import { isR2Configured, uploadToR2 } from "@/shared/lib/r2";
import { sanitizeMediaFolderId } from "@/shared/lib/mediaFolderId";
import {
  buildProjectMediaObjectKey,
  isProjectMediaSubfolder,
} from "@/shared/lib/projectMediaR2Key";

export const runtime = "nodejs";

const MAX_BYTES = 15 * 1024 * 1024;
const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "application/pdf",
]);

export async function POST(req: Request): Promise<NextResponse> {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isR2Configured()) {
    return NextResponse.json({ error: "R2 not configured" }, { status: 503 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form" }, { status: 400 });
  }

  const projectId = (formData.get("projectId") as string)?.trim();
  const subfolderRaw = (formData.get("subfolder") as string)?.trim();
  const file = formData.get("file");

  if (!projectId || !subfolderRaw) {
    return NextResponse.json({ error: "projectId and subfolder required" }, { status: 400 });
  }
  if (!isProjectMediaSubfolder(subfolderRaw)) {
    return NextResponse.json({ error: "Invalid subfolder" }, { status: 400 });
  }
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File too large" }, { status: 400 });
  }

  const type = file.type || "application/octet-stream";
  if (!ALLOWED.has(type) && !type.startsWith("image/")) {
    return NextResponse.json({ error: "Unsupported type" }, { status: 400 });
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

  const key = buildProjectMediaObjectKey(mf, subfolderRaw, file.name);
  if (!key) {
    return NextResponse.json({ error: "Invalid file name" }, { status: 400 });
  }

  const buf = Buffer.from(await file.arrayBuffer());
  const url = await uploadToR2({
    key,
    body: buf,
    contentType: type,
  });
  if (!url) {
    logger.warn("project-media upload failed", { key });
    return NextResponse.json({ error: "Upload failed" }, { status: 503 });
  }

  return NextResponse.json({ ok: true, key, url });
}
