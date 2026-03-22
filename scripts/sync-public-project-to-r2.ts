/**
 * Վերբեռնում է `public/project/{id}/**` → R2 `projects/{id}/**` (`resolveProjectFolderMedia` R2 ռեժիմ)։
 * Գործարկում. `pnpm sync:project-r2`
 */
import { readdir } from "node:fs/promises";
import { readFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { uploadToR2 } from "../src/shared/lib/r2";
import { loadEnvFile } from "./loadEnvFile";

const MIME_BY_EXT: Record<string, string> = {
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".pdf": "application/pdf",
};

async function walkFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const out: string[] = [];
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) {
      out.push(...(await walkFiles(p)));
    } else if (e.isFile()) {
      out.push(p);
    }
  }
  return out;
}

function contentType(absPath: string): string {
  const lower = absPath.toLowerCase();
  const hit = Object.entries(MIME_BY_EXT).find(([ext]) => lower.endsWith(ext));
  return hit ? hit[1] : "application/octet-stream";
}

async function main(): Promise<void> {
  loadEnvFile();
  const cwd = process.cwd();
  const projectRoot = join(cwd, "public", "project");
  const files = await walkFiles(projectRoot);
  if (files.length === 0) {
    console.log("No files under public/project — nothing to upload.");
    return;
  }
  let ok = 0;
  for (const abs of files) {
    const rel = relative(projectRoot, abs).replace(/\\/g, "/");
    const key = `projects/${rel}`;
    const body = await readFile(abs);
    const url = await uploadToR2({
      key,
      body,
      contentType: contentType(abs),
    });
    if (!url) {
      console.error("Upload failed or R2 not configured:", key);
      process.exitCode = 1;
      return;
    }
    ok += 1;
    console.log(ok, key, "→", url);
  }
  console.log(`Done. ${ok} object(s).`);
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
