/**
 * One-off: rewrite Project.expoFields from legacy expo_field_XX keys to Corrected CSV keys.
 * Run: pnpm exec tsx scripts/migrate-expo-fields-to-corrected.ts
 */
import { PrismaClient } from "@prisma/client";
import { normalizeExpoFields, expoFieldsToJson } from "../src/shared/lib/expoFields";

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const projects = await prisma.project.findMany({ select: { id: true, expoFields: true } });
  let updated = 0;
  for (const p of projects) {
    const raw = p.expoFields as object;
    const normalized = normalizeExpoFields(raw);
    const json = expoFieldsToJson(normalized);
    await prisma.project.update({
      where: { id: p.id },
      data: { expoFields: json },
    });
    updated += 1;
  }
  console.info(`migrate-expo-fields: updated ${updated} projects`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
