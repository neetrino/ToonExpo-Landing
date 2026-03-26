/**
 * Скрипт: обновляет phone и specialOffer в expoFields для всех проектов
 * Матчинг по mediaFolderId = Project ID из CSV
 * Запуск: node scripts/updatePhoneAndOffer.mjs
 */
import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";

const prisma = new PrismaClient();

async function main() {
  const raw = readFileSync("/tmp/toon_update_data.json", "utf-8");
  const { phoneKey, offerKey, data } = JSON.parse(raw);

  console.log(`Phone key: "${phoneKey}"`);
  console.log(`Offer key: "${offerKey}"`);
  console.log(`Records from CSV: ${Object.keys(data).length}`);

  const projects = await prisma.project.findMany({
    select: { id: true, slug: true, mediaFolderId: true, expoFields: true },
  });

  console.log(`Projects in DB: ${projects.length}`);

  let updated = 0;
  let skipped = 0;

  for (const project of projects) {
    const folderId = project.mediaFolderId?.trim() ?? "";
    const csvEntry = data[folderId];

    if (!csvEntry) {
      skipped++;
      continue;
    }

    const fields = { ...(project.expoFields ?? {}) };
    let changed = false;

    if (csvEntry.phone && !fields[phoneKey]) {
      fields[phoneKey] = csvEntry.phone;
      changed = true;
    }

    if (csvEntry.specialOffer) {
      fields[offerKey] = csvEntry.specialOffer;
      changed = true;
    }

    if (changed) {
      await prisma.project.update({
        where: { id: project.id },
        data: { expoFields: fields },
      });
      updated++;
      console.log(
        `  ✓ slug=${project.slug} folderId=${folderId}` +
          (csvEntry.phone ? ` phone=${csvEntry.phone.slice(0, 20)}` : "") +
          (csvEntry.specialOffer ? ` offer=${csvEntry.specialOffer.slice(0, 30)}…` : ""),
      );
    }
  }

  console.log(`\nDone: updated=${updated}, skipped=${skipped}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
