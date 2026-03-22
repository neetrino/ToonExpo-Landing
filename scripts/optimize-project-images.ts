/**
 * Մեկ անգամյա batch՝ `public/project/**` JPEG/PNG → WebP, երկար կողմի սահմանափակում։
 *
 * Օրինակներ.
 * - `pnpm optimize:project-images -- --dry-run`
 * - `pnpm optimize:project-images -- --replace` (հաջող WebP-ից հետո ջնջել PNG/JPEG)
 * Այնուհետև R2. `pnpm sync:project-r2`
 */
import { existsSync } from "node:fs";
import { readdir, unlink } from "node:fs/promises";
import { join, relative } from "node:path";
import sharp from "sharp";
import {
  OPTIMIZE_PROJECT_IMAGES_DEFAULT_MAX_LONG_EDGE,
  OPTIMIZE_PROJECT_IMAGES_DEFAULT_ROOT,
  OPTIMIZE_PROJECT_IMAGES_DEFAULT_WEBP_QUALITY,
} from "./optimize-project-images.constants";

const SOURCE_EXT_RE = /\.(jpe?g|png)$/i;

type CliOptions = {
  dryRun: boolean;
  replace: boolean;
  force: boolean;
  maxLongEdge: number;
  quality: number;
  rootAbs: string;
};

function parseArgs(argv: string[]): CliOptions {
  const dryRun = argv.includes("--dry-run");
  const replace = argv.includes("--replace");
  const force = argv.includes("--force");
  let maxLongEdge = OPTIMIZE_PROJECT_IMAGES_DEFAULT_MAX_LONG_EDGE;
  let quality = OPTIMIZE_PROJECT_IMAGES_DEFAULT_WEBP_QUALITY;
  let rootRel = OPTIMIZE_PROJECT_IMAGES_DEFAULT_ROOT;

  const maxIdx = argv.indexOf("--max");
  if (maxIdx !== -1 && argv[maxIdx + 1]) {
    maxLongEdge = Number.parseInt(argv[maxIdx + 1], 10);
  }
  const qIdx = argv.indexOf("--quality");
  if (qIdx !== -1 && argv[qIdx + 1]) {
    quality = Number.parseInt(argv[qIdx + 1], 10);
  }
  const dirIdx = argv.indexOf("--dir");
  if (dirIdx !== -1 && argv[dirIdx + 1]) {
    rootRel = argv[dirIdx + 1];
  }

  const cwd = process.cwd();
  const rootAbs = join(cwd, rootRel);

  if (Number.isNaN(maxLongEdge) || maxLongEdge < 320) {
    throw new Error("Invalid --max (expect number >= 320)");
  }
  if (Number.isNaN(quality) || quality < 40 || quality > 100) {
    throw new Error("Invalid --quality (expect 40–100)");
  }

  return { dryRun, replace, force, maxLongEdge, quality, rootAbs };
}

async function walkFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const out: string[] = [];
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) {
      out.push(...(await walkFiles(p)));
    } else if (e.isFile() && SOURCE_EXT_RE.test(e.name)) {
      out.push(p);
    }
  }
  return out;
}

async function convertOne(
  absIn: string,
  projectRoot: string,
  opts: CliOptions,
): Promise<"ok" | "skipped" | "error"> {
  const outPath = absIn.replace(SOURCE_EXT_RE, ".webp");
  const rel = relative(projectRoot, absIn).replace(/\\/g, "/");

  if (!SOURCE_EXT_RE.test(absIn)) {
    return "skipped";
  }

  if (existsSync(outPath) && !opts.force) {
    console.log("[skip] webp already exists (use --force):", rel);
    return "skipped";
  }

  try {
    if (opts.dryRun) {
      const meta = await sharp(absIn).metadata();
      console.log("[dry-run]", rel, "→", `${meta.width}×${meta.height}`, "→", outPath.replace(projectRoot + "/", ""));
      return "ok";
    }

    await sharp(absIn)
      .rotate()
      .resize({
        width: opts.maxLongEdge,
        height: opts.maxLongEdge,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: opts.quality, effort: 6 })
      .toFile(outPath);

    console.log("[write]", rel, "→", relative(projectRoot, outPath).replace(/\\/g, "/"));

    if (opts.replace) {
      await unlink(absIn);
      console.log("[delete]", rel);
    }
    return "ok";
  } catch (err) {
    console.error("[error]", rel, err);
    return "error";
  }
}

async function main(): Promise<void> {
  const opts = parseArgs(process.argv.slice(2));
  if (!existsSync(opts.rootAbs)) {
    console.error("Directory not found:", opts.rootAbs);
    process.exitCode = 1;
    return;
  }

  const files = await walkFiles(opts.rootAbs);
  if (files.length === 0) {
    console.log("No JPEG/PNG files under", opts.rootAbs);
    return;
  }

  let ok = 0;
  let skipped = 0;
  let errors = 0;

  for (const abs of files) {
    const r = await convertOne(abs, opts.rootAbs, opts);
    if (r === "ok") {
      ok += 1;
    } else if (r === "skipped") {
      skipped += 1;
    } else {
      errors += 1;
    }
  }

  console.log(`Done. ok=${ok}, skipped=${skipped}, errors=${errors}`);
  if (errors > 0) {
    process.exitCode = 1;
  }
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
