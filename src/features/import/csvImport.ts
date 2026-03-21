import { parse } from "csv-parse/sync";
import { EXPO_FIELD_COUNT, getExpoFieldKey } from "@/shared/constants/expoFieldKeys";
import { expoFieldsToJson, type ExpoFieldsFormValues } from "@/shared/lib/expoFields";
import { slugifyTitle } from "@/shared/lib/slug";

export type ParsedExpoRow = {
  expoFields: ExpoFieldsFormValues;
  titleForSlug: string;
  mediaFolderId: string | null;
};

function rowHasProjectIdColumn(header: string[]): boolean {
  return header.some((cell) => cell.includes("Project ID"));
}

function mapOldLayoutRow(row: string[]): ExpoFieldsFormValues {
  const values: Record<string, string> = {};
  for (let i = 0; i < EXPO_FIELD_COUNT; i += 1) {
    const key = getExpoFieldKey(i + 1);
    const cell = row[i];
    values[key] = cell != null ? String(cell).trim() : "";
  }
  return values as ExpoFieldsFormValues;
}

/**
 * Նոր CSV՝ 3-րդ սյունակը Project ID, 4-ից՝ expo_field_02 …
 */
function mapNewLayoutRow(row: string[], projectIdColIndex: number): ExpoFieldsFormValues {
  const values: Record<string, string> = {};
  values.expo_field_01 = row[0] != null ? String(row[0]).trim() : "";
  for (let k = 2; k <= EXPO_FIELD_COUNT; k += 1) {
    const key = getExpoFieldKey(k);
    const col = projectIdColIndex + (k - 1);
    const cell = row[col];
    values[key] = cell != null ? String(cell).trim() : "";
  }
  return values as ExpoFieldsFormValues;
}

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

  const header = records[0].map((h) => (h != null ? String(h) : ""));
  const dataRows = records.slice(1);
  const useProjectIdColumn = rowHasProjectIdColumn(header);
  const projectIdColIndex = header.findIndex((h) => h.includes("Project ID"));

  const out: ParsedExpoRow[] = [];

  for (const row of dataRows) {
    let expoFields: ExpoFieldsFormValues;
    let mediaFolderId: string | null = null;

    if (useProjectIdColumn && projectIdColIndex >= 0) {
      expoFields = mapNewLayoutRow(row, projectIdColIndex);
      const rawId = row[projectIdColIndex]?.trim() ?? "";
      mediaFolderId = rawId || null;
    } else {
      expoFields = mapOldLayoutRow(row);
    }

    const titleForSlug =
      expoFields.expo_field_02?.trim() ||
      expoFields.expo_field_01?.trim() ||
      "project";

    out.push({
      expoFields,
      titleForSlug,
      mediaFolderId,
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
