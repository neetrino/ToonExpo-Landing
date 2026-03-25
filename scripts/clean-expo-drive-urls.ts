/**
 * Մեկանգամյա — Project.expoFields-ից հանում է Google Drive / Docs հղումները (չեն համապատասխանում R2 քաղաքականությանը)։
 *
 * Օրինակ. `pnpm exec tsx --tsconfig tsconfig.json scripts/clean-expo-drive-urls.ts`
 * Dry-run. `pnpm exec tsx --tsconfig tsconfig.json scripts/clean-expo-drive-urls.ts --dry-run`
 */
import { PrismaClient } from "@prisma/client";
import {
  sanitizeMediaSingleUrlField,
  sanitizeMediaUrlList,
} from "../src/shared/lib/expoFieldsMediaPolicy";
import { PROJECT_FIELD } from "../src/shared/constants/expoFieldKeys";
import { loadEnvFile } from "./loadEnvFile";

loadEnvFile();

const prisma = new PrismaClient();

const DRY_RUN = process.argv.includes("--dry-run");

function cleanListField(raw: string): { next: string; changed: boolean } {
  const next = sanitizeMediaUrlList(raw);
  const changed = next !== raw.trim();
  return { next, changed };
}

function cleanSingleField(raw: string): { next: string; changed: boolean } {
  const next = sanitizeMediaSingleUrlField(raw);
  const changed = next !== raw.trim();
  return { next, changed };
}

const LIST_KEYS = [] as const;
const SINGLE_KEYS = [
  PROJECT_FIELD.video,
  PROJECT_FIELD.virtualTour,
  PROJECT_FIELD.website,
  PROJECT_FIELD.instagram,
  PROJECT_FIELD.facebook,
] as const;

function stripEmptyStrings(obj: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === "string" && v.trim()) {
      out[k] = v.trim();
    }
  }
  return out;
}

async function main(): Promise<void> {
  const projects = await prisma.project.findMany({
    select: { id: true, slug: true, expoFields: true },
  });

  let updatedCount = 0;

  for (const p of projects) {
    const raw = p.expoFields;
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
      continue;
    }
    const expo = { ...(raw as Record<string, unknown>) };
    let anyChange = false;
    const changes: string[] = [];

    for (const key of LIST_KEYS) {
      const v = expo[key];
      if (typeof v !== "string" || !v.trim()) {
        continue;
      }
      const { next, changed } = cleanListField(v);
      if (changed) {
        expo[key] = next;
        anyChange = true;
        changes.push(`${key}: list filtered`);
      }
    }


    for (const key of SINGLE_KEYS) {
      const v = expo[key];
      if (typeof v !== "string" || !v.trim()) {
        continue;
      }
      const { next, changed } = cleanSingleField(v);
      if (changed) {
        expo[key] = next;
        anyChange = true;
        changes.push(`${key}: cleared drive/docs url`);
      }
    }

    if (!anyChange) {
      continue;
    }

    const stringRecord: Record<string, string> = {};
    for (const [k, val] of Object.entries(expo)) {
      if (typeof val === "string") {
        stringRecord[k] = val;
      }
    }
    const expoFields = stripEmptyStrings(stringRecord);

    console.log(
      `[${DRY_RUN ? "DRY-RUN" : "UPDATE"}] ${p.slug} (${p.id}): ${changes.join("; ")}`,
    );

    if (!DRY_RUN) {
      await prisma.project.update({
        where: { id: p.id },
        data: { expoFields },
      });
    }
    updatedCount += 1;
  }

  console.log(
    `Done. Projects ${DRY_RUN ? "would be " : ""}updated: ${updatedCount} (total scanned: ${projects.length}).`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
