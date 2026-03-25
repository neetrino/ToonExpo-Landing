import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { uploadToR2 } from "@/shared/lib/r2";
import { logger } from "@/shared/lib/logger";
import { randomBytes } from "node:crypto";

export const runtime = "nodejs";

const MAX_BYTES = 15 * 1024 * 1024;
const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
]);

export async function POST(req: Request): Promise<NextResponse> {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form" }, { status: 400 });
  }
  const file = formData.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File too large" }, { status: 400 });
  }
  const type = file.type || "application/octet-stream";
  if (!ALLOWED.has(type)) {
    return NextResponse.json({ error: "Unsupported type" }, { status: 400 });
  }
  const ext = file.name.split(".").pop()?.slice(0, 8) || "bin";
  const key = `uploads/${randomBytes(16).toString("hex")}.${ext}`;
  const buf = Buffer.from(await file.arrayBuffer());
  const url = await uploadToR2({
    key,
    body: buf,
    contentType: type,
  });
  if (!url) {
    logger.warn("upload failed or R2 disabled");
    return NextResponse.json(
      { error: "Storage not configured or upload failed" },
      { status: 503 },
    );
  }
  return NextResponse.json({ url });
}
