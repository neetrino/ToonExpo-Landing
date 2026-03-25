/** Հայաստանի դրամի նշան (֏, U+058F) */
const DRAM_SIGN = "\u058F";

/** Հայերեն UI — հազարական բաժանիչ (օր. 550 000)։ */
const AMD_INTEGER_FORMAT = new Intl.NumberFormat("hy-AM", {
  maximumFractionDigits: 0,
  useGrouping: true,
});

/**
 * Տողից հանում է ամբողջ թիվը (CSV-ում կարող են լինել բացատներ, ստորակետներ)։
 */
function parseWholeNumberFromPriceField(raw: string): number | null {
  const trimmed = raw.trim();
  if (!trimmed) {
    return null;
  }
  const digits = trimmed.replace(/\D/g, "");
  if (!digits) {
    return null;
  }
  const n = Number.parseInt(digits, 10);
  return Number.isFinite(n) ? n : null;
}

/**
 * «Մինիմում արժեք» (Excel G) ցուցադրություն՝ միայն նվազագույնը, հազարական բաժանիչներով։
 *
 * @returns ձևաչափված թիվ + «֏» կամ դատարկ տող, եթե թիվ չի ճանաչվել
 */
export function formatPriceMinForDisplay(raw: string | undefined): string {
  const n = parseWholeNumberFromPriceField(raw?.trim() ?? "");
  if (n === null) {
    return "";
  }
  return `${AMD_INTEGER_FORMAT.format(n)}\u00A0${DRAM_SIGN}`;
}
