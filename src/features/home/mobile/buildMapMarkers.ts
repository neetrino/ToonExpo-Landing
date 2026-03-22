import { resolveLatLngForMap } from "@/shared/lib/latLng";
import type { MapMarker } from "@/features/home/mobile/HomeMapPreview";
import type { HomeProject } from "@/features/home/mobile/homeProject.types";

function projectTitle(f: Record<string, string>): string {
  return f.expo_field_02?.trim() || f.expo_field_01?.trim() || "—";
}

export function buildMapMarkersFromProjects(list: HomeProject[]): MapMarker[] {
  const markers: MapMarker[] = [];
  for (const p of list) {
    const f = p.expoFields;
    const ll = resolveLatLngForMap(f);
    if (ll) {
      markers.push({
        lat: ll.lat,
        lng: ll.lng,
        label: projectTitle(f),
        href: `/p/${p.slug}`,
      });
    }
  }
  return markers;
}
