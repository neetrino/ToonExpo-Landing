"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export type MapMarker = {
  lat: number;
  lng: number;
  label: string;
  href?: string;
};

type Props = {
  markers: MapMarker[];
  className?: string;
};

const DEFAULT_CENTER: [number, number] = [44.5152, 40.1792];

export function HomeMapPreview({ markers, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    const valid = markers.filter((m) => Number.isFinite(m.lat) && Number.isFinite(m.lng));
    const center: [number, number] =
      valid.length > 0 ? [valid[0].lng, valid[0].lat] : DEFAULT_CENTER;

    const map = new maplibregl.Map({
      container: ref.current,
      style: "https://tiles.openfreemap.org/styles/liberty",
      center,
      zoom: valid.length ? 12 : 8,
    });
    map.addControl(new maplibregl.NavigationControl(), "top-right");
    mapRef.current = map;

    for (const m of valid) {
      const el = document.createElement("div");
      el.className = "h-4 w-4 rounded-full border-2 border-white bg-[#2ba8b0] shadow-md";
      const popup = new maplibregl.Popup({ offset: 12 }).setHTML(
        m.href
          ? `<a href="${m.href}" class="text-[#2ba8b0] underline">${escapeHtml(m.label)}</a>`
          : escapeHtml(m.label),
      );
      new maplibregl.Marker({ element: el })
        .setLngLat([m.lng, m.lat])
        .setPopup(popup)
        .addTo(map);
    }

    if (valid.length > 1) {
      const b = new maplibregl.LngLatBounds(valid[0], valid[0]);
      for (const m of valid.slice(1)) {
        b.extend([m.lng, m.lat]);
      }
      map.fitBounds(b, { padding: 48, maxZoom: 14 });
    }

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [markers]);

  return <div ref={ref} className={className ?? "h-[420px] w-full rounded-xl"} />;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/"/g, "&quot;");
}
