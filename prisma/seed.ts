import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  parseExpoCsvBuffer,
  rowToExpoJson,
  slugFromRow,
} from "../src/features/import/csvImport";
import { sanitizeMediaFolderId } from "../src/shared/lib/mediaFolderId";

const prisma = new PrismaClient();

function resolveSeedCsvPath(): string | null {
  const candidates = [
    join(process.cwd(), "docs/data/ToonExpoData2026.csv"),
    join(process.cwd(), "public/data/ToonExpoData2026.csv"),
  ];
  for (const p of candidates) {
    if (existsSync(p)) {
      return p;
    }
  }
  return null;
}

async function ensureUniqueSlug(base: string): Promise<string> {
  let slug = base.slice(0, 100);
  let n = 0;
  while (await prisma.project.findUnique({ where: { slug } })) {
    n += 1;
    slug = `${base.slice(0, 80)}-${n}`;
  }
  return slug;
}

async function main(): Promise<void> {
  const email = process.env.SEED_ADMIN_EMAIL ?? "admin@toonexpo.local";
  const password = process.env.SEED_ADMIN_PASSWORD ?? "change-me-in-production";

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    create: {
      email,
      name: "Admin",
      passwordHash,
    },
    update: {
      passwordHash,
    },
  });

  console.info("Seed: admin user", email);

  const csvPath = resolveSeedCsvPath();
  if (!csvPath) {
    console.info(
      "Seed: CSV not found (docs/data or public/data ToonExpoData2026.csv), skip projects",
    );
    return;
  }
  console.info("Seed: using CSV", csvPath);

  const replace = process.env.SEED_REPLACE_PROJECTS === "true";
  const count = await prisma.project.count();

  if (count > 0 && !replace) {
    console.info(
      "Seed: projects already exist. Run SEED_REPLACE_PROJECTS=true pnpm db:seed to reload from CSV.",
    );
    return;
  }

  if (replace) {
    await prisma.project.deleteMany({});
    console.info("Seed: cleared projects");
  }

  const buf = readFileSync(csvPath);
  const rows = parseExpoCsvBuffer(buf);
  let created = 0;

  for (let i = 0; i < rows.length; i += 1) {
    const row = rows[i];
    const expoJson = rowToExpoJson(row);
    if (Object.keys(expoJson).length === 0) {
      continue;
    }
    const base = slugFromRow(row, i);
    const slug = await ensureUniqueSlug(base);
    const folderId = sanitizeMediaFolderId(row.mediaFolderId ?? undefined);
    const mediaFolderId = folderId ? folderId.toLowerCase() : null;

    await prisma.project.create({
      data: {
        slug,
        published: true,
        expoFields: expoJson,
        mediaFolderId,
      },
    });
    created += 1;
    if (created % 100 === 0) {
      console.info("Seed: ...", created);
    }
  }

  console.info("Seed: imported projects from CSV", created);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    void prisma.$disconnect();
    process.exit(1);
  });
