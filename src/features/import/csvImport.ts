import { parse } from "csv-parse/sync";
import { normalizeExpoCsvHeader, EXPO_FIELD_KEYS, PROJECT_FIELD } from "@/shared/constants/expoFieldKeys";
import { emptyExpoFields, expoFieldsToJson, type ExpoFieldsFormValues } from "@/shared/lib/expoFields";
import { sanitizeExpoFieldsFromCsvForMediaPolicy } from "@/shared/lib/expoFieldsMediaPolicy";
import { extractVirtualTourUrl } from "@/shared/lib/extractVirtualTourUrl";
import { sanitizeMediaFolderId } from "@/shared/lib/mediaFolderId";
import { slugifyTitle } from "@/shared/lib/slug";

export type ParsedExpoRow = {
  expoFields: ExpoFieldsFormValues;
  titleForSlug: string;
  mediaFolderId: string | null;
};

function rowHasProjectIdColumn(header: string[]): boolean {
  return header.some((cell) => cell.includes("Project ID"));
}

function resolveCanonicalKey(normalizedHeader: string): string | null {
  if (!normalizedHeader) {
    return null;
  }
  const exact = EXPO_FIELD_KEYS.find((k) => k === normalizedHeader);
  if (exact) {
    return exact;
  }
  return EXPO_FIELD_KEYS.find((k) => normalizeExpoCsvHeader(k) === normalizedHeader) ?? null;
}

function assignSequentialProjectIds(rows: ParsedExpoRow[]): ParsedExpoRow[] {
  let nextAuto = 0;

  for (const row of rows) {
    const raw = row.mediaFolderId?.trim() ?? "";
    const sanitized = sanitizeMediaFolderId(raw || undefined);

    if (sanitized) {
      if (/^\d+$/.test(sanitized)) {
        const n = parseInt(sanitized, 10);
        if (!Number.isNaN(n)) {
          nextAuto = Math.max(nextAuto, n);
        }
      }
      row.mediaFolderId = sanitized.toLowerCase();
    } else {
      nextAuto += 1;
      row.mediaFolderId = String(nextAuto);
    }
  }

  return rows;
}

function mapRowToExpoFields(header: string[], row: string[]): ExpoFieldsFormValues {
  const values = emptyExpoFields();
  const record = values as Record<string, string>;

  for (let i = 0; i < header.length; i += 1) {
    const h = header[i] ?? "";
    const key = resolveCanonicalKey(h);
    if (!key) {
      continue;
    }
    const cell = row[i] != null ? String(row[i]).trim() : "";
    record[key] = cell;
  }

  if (record[PROJECT_FIELD.virtualTour]) {
    record[PROJECT_FIELD.virtualTour] = extractVirtualTourUrl(record[PROJECT_FIELD.virtualTour]);
  }

  return values;
}

/**
 * CSV առաջին տողը՝ վերնագրեր, `;` բաժանարար, UTF-8
 * Սյունակների անունները համընկնում են CorrectedToonExpoData2026.csv-ին։
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

  const header = records[0].map((h) => normalizeExpoCsvHeader(h != null ? String(h) : ""));
  const dataRows = records.slice(1);
  const useProjectIdColumn = rowHasProjectIdColumn(header);
  const projectIdColIndex = header.findIndex((h) => h.includes("Project ID"));

  const out: ParsedExpoRow[] = [];

  for (const row of dataRows) {
    if (row.every((c) => !String(c ?? "").trim())) {
      continue;
    }

    let expoFields: ExpoFieldsFormValues;
    let mediaFolderId: string | null = null;

    if (useProjectIdColumn && projectIdColIndex >= 0) {
      expoFields = mapRowToExpoFields(header, row);
      const rawId = row[projectIdColIndex]?.trim() ?? "";
      mediaFolderId = rawId || null;
    } else {
      return [];
    }

    expoFields = sanitizeExpoFieldsFromCsvForMediaPolicy(expoFields);

    const titleForSlug =
      expoFields[PROJECT_FIELD.titleExhibition]?.trim() ||
      expoFields[PROJECT_FIELD.participantName]?.trim() ||
      "project";

    out.push({
      expoFields,
      titleForSlug,
      mediaFolderId,
    });
  }

  return assignSequentialProjectIds(out);
}

export function rowToExpoJson(row: ParsedExpoRow): Record<string, string> {
  return expoFieldsToJson(row.expoFields);
}

export function slugFromRow(row: ParsedExpoRow, index: number): string {
  const fromCsvId = sanitizeMediaFolderId(row.mediaFolderId ?? undefined);
  if (fromCsvId) {
    return fromCsvId.toLowerCase();
  }
  return slugifyTitle(row.titleForSlug, `project-${index}`);
}
