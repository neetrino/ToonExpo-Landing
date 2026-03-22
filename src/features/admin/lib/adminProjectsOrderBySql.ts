import { Prisma } from "@prisma/client";
import { MAX_PROJECT_SORT_ORDER } from "@/shared/constants/sortOrder.constants";

/**
 * Նույն տրամաբանությունը, ինչ `getPublishedProjects`-ում client-side sort-ը
 * (դրական `sortOrder` → առաջ, 0 → վերջում՝ `updatedAt`-ով)։
 */
export function adminProjectsOrderBySql(): Prisma.Sql {
  return Prisma.sql`
    ORDER BY
      CASE WHEN "sortOrder" > 0 THEN 0 ELSE 1 END,
      CASE WHEN "sortOrder" > 0 THEN "sortOrder" ELSE ${MAX_PROJECT_SORT_ORDER} END,
      "updatedAt" DESC,
      id ASC
  `;
}
