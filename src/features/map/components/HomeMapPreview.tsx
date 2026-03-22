"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export type MapMarker = {
  lat: number;
  lng: number;
  title: string;
  /** Գին մ²-ի համար (ք/մ) կամ «Հայցով» */
  priceDisplay: string;
  logoUrl?: string | null;
  href?: string;
};

type Props = {
  markers: MapMarker[];
  className?: string;
};

const DEFAULT_CENTER: [number, number] = [44.5152, 40.1792];

function createMapMarkerElement(m: MapMarker): HTMLElement {
  const wrap = document.createElement("div");
  wrap.className = "map-marker-wrap relative flex flex-col items-center";

  const bridge = document.createElement("div");
  bridge.className =
    "pointer-events-auto absolute bottom-0 left-1/2 z-[5] h-24 w-14 -translate-x-1/2";
  bridge.setAttribute("aria-hidden", "true");
  wrap.appendChild(bridge);

  const hover = document.createElement("div");
  hover.className =
    "map-marker-hovercard pointer-events-none absolute bottom-[calc(100%+6px)] left-1/2 z-20 w-max max-w-[min(240px,calc(100vw-2rem))] -translate-x-1/2 rounded-xl border border-slate-200/90 bg-white px-3 py-2.5 shadow-[0_8px_28px_rgba(0,0,0,0.18)]";

  const inner = m.href ? document.createElement("a") : document.createElement("div");
  if (m.href) {
    const a = inner as HTMLAnchorElement;
    a.href = m.href;
    a.className = "flex items-start gap-2.5 no-underline outline-none";
  } else {
    inner.className = "flex items-start gap-2.5";
  }

  if (m.logoUrl) {
    const img = document.createElement("img");
    img.src = m.logoUrl;
    img.alt = "";
    img.className = "h-10 w-10 shrink-0 rounded-md object-contain";
    img.addEventListener("error", () => {
      img.remove();
    });
    inner.appendChild(img);
  }

  const textCol = document.createElement("div");
  textCol.className = "min-w-0 flex-1 text-left";

  const titleEl = document.createElement("p");
  titleEl.className = "text-[13px] font-bold leading-tight text-slate-900";
  titleEl.textContent = m.title;

  const priceEl = document.createElement("p");
  priceEl.className = "mt-0.5 text-[11px] font-semibold leading-snug text-slate-600";
  priceEl.textContent = m.priceDisplay;

  textCol.appendChild(titleEl);
  textCol.appendChild(priceEl);
  inner.appendChild(textCol);

  hover.appendChild(inner);
  wrap.appendChild(hover);

  const dot = document.createElement("div");
  dot.className =
    "relative z-10 h-4 w-4 shrink-0 cursor-pointer rounded-full border-2 border-white bg-[#2ba8b0] shadow-md";
  dot.setAttribute("aria-hidden", "true");
  wrap.appendChild(dot);

  wrap.setAttribute("aria-label", `${m.title}, ${m.priceDisplay}`);

  return wrap;
}

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
      const el = createMapMarkerElement(m);
      new maplibregl.Marker({ element: el, anchor: "center" })
        .setLngLat([m.lng, m.lat])
        .addTo(map);
    }

    if (valid.length > 1) {
      const b = new maplibregl.LngLatBounds();
      for (const item of valid) {
        b.extend([item.lng, item.lat]);
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
