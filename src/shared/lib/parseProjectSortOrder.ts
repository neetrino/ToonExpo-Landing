import { MAX_PROJECT_SORT_ORDER } from "@/shared/constants/sortOrder.constants";

/**
 * Գլխավոր էջի / ադմին ցանկի հերթականություն — 1 = առաջինը, 0 = ավտոմատ (վերջում)։
 */
export function parseProjectSortOrder(raw: unknown): number {
  if (raw === null || raw === undefined) {
    return 0;
  }
  const s = typeof raw === "string" ? raw.trim() : String(raw);
  if (s === "") {
    return 0;
  }
  const n = Number.parseInt(s, 10);
  if (!Number.isFinite(n) || n < 0) {
    return 0;
  }
  return Math.min(n, MAX_PROJECT_SORT_ORDER);
}
