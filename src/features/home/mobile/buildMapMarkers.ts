import { resolveLatLngForMap } from "@/shared/lib/latLng";
import { formatMapMinPricePerSqm } from "@/shared/lib/formatMapPricePerSqm";
import type { MapMarker } from "@/features/map/components/HomeMapPreview";
import type { HomeProject } from "@/features/home/mobile/homeProject.types";
import { HY_UI } from "@/shared/i18n/hyUi.constants";
import { PROJECT_FIELD } from "@/shared/constants/expoFieldKeys";

const F = PROJECT_FIELD;

function projectTitle(f: Record<string, string>): string {
  return f[F.titleExhibition]?.trim() || f[F.participantName]?.trim() || "—";
}

export function buildMapMarkersFromProjects(list: HomeProject[]): MapMarker[] {
  const markers: MapMarker[] = [];
  for (const p of list) {
    const f = p.expoFields;
    const ll = resolveLatLngForMap(f);
    if (ll) {
      const priceLine = formatMapMinPricePerSqm(f[F.priceMin]);
      markers.push({
        lat: ll.lat,
        lng: ll.lng,
        title: projectTitle(f),
        priceDisplay: priceLine ?? HY_UI.ON_REQUEST,
        logoUrl: p.cardLogoUrl ?? undefined,
        href: `/p/${p.slug}`,
      });
    }
  }
  return markers;
}
