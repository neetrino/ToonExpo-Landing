/** Հայաստանի դրամի նշան (֏, U+058F) */
const DRAM_SIGN = "\u058F";

/**
 * Հազարական խմբավորում՝ NBSP-ով (օր. 550 000)։
 * Չի օգտագործում `Intl` — Node-ի և բրաուզերի ICU տարբերությունները SSR hydration չեն խախտում։
 */
function formatGroupedInteger(n: number): string {
  const s = String(Math.trunc(Math.abs(n)));
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, "\u00A0");
}

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
  return `${formatGroupedInteger(n)}\u00A0${DRAM_SIGN}`;
}
