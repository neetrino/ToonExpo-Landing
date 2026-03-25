import { HY_UI } from "@/shared/i18n/hyUi.constants";

/**
 * Գլխավոր էջի քարտ — «Եկամտահարկի վերադարձ» դաշտը → Կա / Չկա / տեքստ / Հայցով
 */
export function formatTaxRefundForHomeCard(raw: string | undefined): string {
  const v = raw?.trim() ?? "";
  if (!v) {
    return HY_UI.ON_REQUEST;
  }

  const lower = v
    .toLowerCase()
    .replace(/[.:;]+$/u, "")
    .trim();
  const yesTokens = new Set(["այո", "yes", "y", "да", "1", "true"]);
  const noTokens = new Set(["ոչ", "no", "n", "0", "false"]);

  if (v === "Այո" || yesTokens.has(lower)) {
    return HY_UI.TAX_REFUND_PRESENT;
  }
  if (v === "Ոչ" || noTokens.has(lower)) {
    return HY_UI.TAX_REFUND_ABSENT;
  }

  return v;
}
