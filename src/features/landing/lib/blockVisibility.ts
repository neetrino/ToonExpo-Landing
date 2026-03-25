import { PROJECT_FIELD } from "@/shared/constants/expoFieldKeys";
import { isFieldNonEmpty } from "@/shared/lib/expoFields";

export type ExpoMap = Record<string, string>;

export function anyFilled(keys: readonly string[], f: ExpoMap): boolean {
  return keys.some((k) => isFieldNonEmpty(f[k]));
}

const F = PROJECT_FIELD;

const KEYS = {
  hero: [F.titleExhibition, F.participantName, F.shortName, F.description],
  about: [F.description, F.developer, F.shortName],
  investment: [F.completion, F.areas, F.priceMin, F.priceMax, F.bank, F.taxRefund],
  gallery: [] as string[],
  payment: [F.paymentOptions, F.bank, F.taxRefund],
  infrastructure: [] as string[],
  construction: [F.structure, F.floors, F.ceiling, F.elevators, F.handover],
  parking: [F.parkingOpen, F.parkingClosed],
  tours: [F.virtualTour, F.video],
  location: [F.locationCoords, F.shortName],
  footer: [F.website, F.instagram, F.facebook, F.developer],
} as const;

export type LandingBlockId = keyof typeof KEYS;

export function visibleBlocks(f: ExpoMap): Record<LandingBlockId, boolean> {
  const out = {} as Record<LandingBlockId, boolean>;
  for (const id of Object.keys(KEYS) as LandingBlockId[]) {
    const keys = KEYS[id];
    out[id] = keys.length === 0 ? false : anyFilled(keys, f);
  }
  return out;
}
