const SQM_SUFFIX = " - ք/մ" as const;

/** Հայաստանի դրամի նշան (֏, U+058F) */
const DRAM_SIGN = "\u058F";

/**
 * Նորմալացնում է գնի տողը (բացատներ, ստորակետ որպես տասնորդական բաժանիչ)։
 */
function normalizePriceNumericToken(raw: string): { value: number; fractionDigits: number } | null {
  const trimmed = raw.trim();
  if (!trimmed) {
    return null;
  }
  const noSpaces = trimmed.replace(/\s/g, "");
  const withDotDecimal = noSpaces.includes(",") && !noSpaces.includes(".")
    ? noSpaces.replace(",", ".")
    : noSpaces.replace(/,/g, "");
  const dotIdx = withDotDecimal.indexOf(".");
  const fracRaw = dotIdx >= 0 ? withDotDecimal.slice(dotIdx + 1) : "";
  const fractionDigits = Math.min(fracRaw.replace(/\D/g, "").length, 10);
  const n = Number(withDotDecimal);
  if (!Number.isFinite(n)) {
    return null;
  }
  return { value: n, fractionDigits };
}

/**
 * Քարտեզի մարկեր — միայն «Մինիմում արժեք» (ք/մ), առանց «մին — մաքս»։
 * Թիվը ձևաչափվում է hy-AM խմբավորմամբ և ֏-ով, տասնորդականները պահվում են ըստ աղբյուրային տողի
 * (ոչ թե կլորացվում են մինչև ամբողջ թիվ)։
 *
 * @returns null, եթե դաշտը դատարկ է
 */
export function formatMapMinPricePerSqm(minValue: string | undefined): string | null {
  const raw = minValue?.trim();
  if (!raw) {
    return null;
  }
  const parsed = normalizePriceNumericToken(raw);
  if (!parsed) {
    return `${raw}${SQM_SUFFIX}`;
  }
  const { value, fractionDigits } = parsed;
  const formatted = new Intl.NumberFormat("hy-AM", {
    useGrouping: true,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
  return `${formatted}\u00A0${DRAM_SIGN}${SQM_SUFFIX}`;
}
