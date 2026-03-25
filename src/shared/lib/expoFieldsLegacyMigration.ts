import { extractVirtualTourUrl } from "@/shared/lib/extractVirtualTourUrl";
import { PROJECT_FIELD } from "@/shared/constants/expoFieldKeys";

function nonEmpty(s: string | undefined): boolean {
  return Boolean(s?.trim());
}

function mergeDeveloper(
  k: string | undefined,
  a: string | undefined,
  b: string | undefined,
  c: string | undefined,
): string {
  const parts: string[] = [];
  if (nonEmpty(k)) {
    parts.push(k!.trim());
  }
  const sub: string[] = [];
  if (nonEmpty(a)) {
    sub.push(`Architect: ${a!.trim()}`);
  }
  if (nonEmpty(b)) {
    sub.push(`Construction: ${b!.trim()}`);
  }
  if (nonEmpty(c)) {
    sub.push(`Management: ${c!.trim()}`);
  }
  if (sub.length > 0) {
    parts.push(sub.join(" / "));
  }
  return parts.join(" — ");
}

function mergeStructure(n: string | undefined, m: string | undefined, q: string | undefined): string {
  const parts: string[] = [];
  if (nonEmpty(n)) {
    parts.push(n!.trim());
  }
  if (nonEmpty(m)) {
    parts.push(`Materials: ${m!.trim()}`);
  }
  if (nonEmpty(q)) {
    parts.push(`Insulation: ${q!.trim()}`);
  }
  return parts.join("; ");
}

/**
 * Converts legacy `expo_field_01`…`53` JSON into Corrected CSV keyed object.
 */
export function migrateLegacyExpoFieldsJson(raw: Record<string, unknown>): Record<string, string> {
  const g = (n: number): string => {
    const v = raw[`expo_field_${String(n).padStart(2, "0")}`];
    return typeof v === "string" ? v.trim() : "";
  };

  const hasLegacy = Object.keys(raw).some((k) => k.startsWith("expo_field_"));
  if (!hasLegacy) {
    return {};
  }

  const out: Record<string, string> = {};

  const set = (key: string, value: string) => {
    if (value.trim()) {
      out[key] = value.trim();
    }
  };

  set(PROJECT_FIELD.participantName, g(1));
  set(PROJECT_FIELD.projectId, "");
  set(PROJECT_FIELD.titleExhibition, g(2));
  set(PROJECT_FIELD.shortName, g(3));
  set(PROJECT_FIELD.completion, g(5));
  set(PROJECT_FIELD.areas, g(6));
  set(PROJECT_FIELD.priceMin, g(7));
  set(PROJECT_FIELD.priceMax, g(8));
  set(PROJECT_FIELD.taxRefund, g(9));
  set(PROJECT_FIELD.bank, g(10));
  set(
    PROJECT_FIELD.developer,
    mergeDeveloper(g(11), g(12), g(13), g(14)),
  );
  set(PROJECT_FIELD.locationCoords, g(16));
  set(PROJECT_FIELD.paymentOptions, g(19));
  set(PROJECT_FIELD.structure, mergeStructure(g(20), g(21), g(22)));
  set(PROJECT_FIELD.floors, g(25));
  set(PROJECT_FIELD.ceiling, g(29));
  set(PROJECT_FIELD.elevators, g(30));
  set(PROJECT_FIELD.handover, g(31));
  set(PROJECT_FIELD.parkingOpen, g(37));
  set(PROJECT_FIELD.parkingClosed, g(38));
  set(PROJECT_FIELD.video, g(46));
  set(PROJECT_FIELD.email, "");
  set(PROJECT_FIELD.phone, "");
  set(PROJECT_FIELD.website, g(51));
  set(PROJECT_FIELD.instagram, g(52));
  set(PROJECT_FIELD.facebook, g(53));
  set(PROJECT_FIELD.description, g(34));
  set(PROJECT_FIELD.virtualTour, extractVirtualTourUrl(g(45)));

  return out;
}
