/** Եթե CSV-ում արդեն կա միավոր — կրկին չենք ավելացնում։ */
const HAS_AREA_UNIT = /(?:m²|m2|ք\s*\/\s*մ|քմ|մ²)/i;

/**
 * «Մակերեսներ» դաշտի ցուցադրություն — արժեքից հետո քառակուսի մետր (m²)։
 */
export function formatAreasWithSqmSuffix(raw: string | undefined): string {
  const v = raw?.trim() ?? "";
  if (!v) {
    return "";
  }
  if (HAS_AREA_UNIT.test(v)) {
    return v;
  }
  return `${v}\u00a0m²`;
}
