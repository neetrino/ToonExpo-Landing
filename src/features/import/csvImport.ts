import { parse } from "csv-parse/sync";
import { EXPO_FIELD_COUNT, getExpoFieldKey } from "@/shared/constants/expoFieldKeys";
import { expoFieldsToJson, type ExpoFieldsFormValues } from "@/shared/lib/expoFields";
import { slugifyTitle } from "@/shared/lib/slug";

export type ParsedExpoRow = {
  expoFields: ExpoFieldsFormValues;
  titleForSlug: string;
};

/**
 * CSV առաջին տողը՝ վերնագրեր, `;` բաժանարար, UTF-8
 */
export function parseExpoCsvBuffer(buffer: Buffer): ParsedExpoRow[] {
  const text = buffer.toString("utf-8");
  const records = parse(text, {
    delimiter: ";",
    relax_column_count: true,
    skip_empty_lines: true,
    bom: true,
  }) as string[][];

  if (records.length < 2) {
    return [];
  }

  const dataRows = records.slice(1);
  const out: ParsedExpoRow[] = [];

  for (const row of dataRows) {
    const values: Record<string, string> = {};
    for (let i = 0; i < EXPO_FIELD_COUNT; i += 1) {
      const key = getExpoFieldKey(i + 1);
      const cell = row[i];
      values[key] = cell != null ? String(cell).trim() : "";
    }
    const titleForSlug =
      values.expo_field_02?.trim() ||
      values.expo_field_01?.trim() ||
      "project";
    out.push({
      expoFields: values as ExpoFieldsFormValues,
      titleForSlug,
    });
  }

  return out;
}

export function rowToExpoJson(row: ParsedExpoRow): Record<string, string> {
  return expoFieldsToJson(row.expoFields);
}

export function slugFromRow(row: ParsedExpoRow, index: number): string {
  return slugifyTitle(row.titleForSlug, `project-${index}`);
}
