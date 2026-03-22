"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

import {
  MAP_FIT_BOUNDS_MAX_ZOOM,
  MAP_LABELS_VISIBLE_MIN_ZOOM,
  MAP_ZOOM_LABELS_VISIBLE_CONTAINER_CLASS,
} from "@/features/map/mapView.constants";

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

/** Հեռավորություն կետից մինչև hover-քարտ (px) — նախկին 18px-ի կրկնապատիկ */
const MAP_MARKER_POPUP_GAP_PX = 36;

const MAP_MARKER_ACTIVE_CLASS = "map-marker-active";

/** MapLibre-ի `.maplibregl-marker` — բարձր z-index, որ hover-քարտը ծածկի մյուս կետերը */
const MAP_MARKER_Z_INDEX_ACTIVE = "10000";

/**
 * MapLibre-ը `z-index: 1 !important` է տալիս — z-index առանց important-ի չի աշխատում։
 * Պետք է `important` կամ ավելի ուժեղ CSS selector (տե՛ս globals.css)։
 */
function setMaplibreMarkerStacking(markerRoot: HTMLElement, active: boolean): void {
  if (active) {
    markerRoot.style.setProperty("z-index", MAP_MARKER_Z_INDEX_ACTIVE, "important");
  } else {
    markerRoot.style.removeProperty("z-index");
  }
}

function syncZoomLabelsVisibility(
  map: maplibregl.Map,
  container: HTMLElement,
  minZoom: number,
  labelsClass: string,
): void {
  const show = map.getZoom() >= minZoom;
  container.classList.toggle(labelsClass, show);
}

function bindMarkerPointerHover(wrap: HTMLElement): void {
  const setActive = () => {
    wrap.classList.add(MAP_MARKER_ACTIVE_CLASS);
    setMaplibreMarkerStacking(wrap, true);
  };
  const setInactive = () => {
    wrap.classList.remove(MAP_MARKER_ACTIVE_CLASS);
    setMaplibreMarkerStacking(wrap, false);
  };
  wrap.addEventListener("mouseenter", setActive);
  wrap.addEventListener("mouseleave", setInactive);
}

function createMapMarkerElement(m: MapMarker): HTMLElement {
  const wrap = document.createElement("div");
  wrap.className = "map-marker-wrap relative flex flex-col items-center";

  const hover = document.createElement("div");
  hover.className =
    "map-marker-hovercard pointer-events-none absolute left-1/2 z-[100] w-max max-w-[min(240px,calc(100vw-2rem))] -translate-x-1/2 rounded-xl border border-slate-200/90 bg-white px-3 py-2.5 shadow-[0_8px_28px_rgba(0,0,0,0.18)]";
  hover.style.bottom = `calc(100% + ${MAP_MARKER_POPUP_GAP_PX}px)`;

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

  const gapHitbox = document.createElement("div");
  gapHitbox.className =
    "map-marker-gap-hitbox pointer-events-auto absolute left-1/2 z-[8] w-3 -translate-x-1/2 cursor-default";
  gapHitbox.style.bottom = "16px";
  gapHitbox.style.height = `${MAP_MARKER_POPUP_GAP_PX}px`;
  gapHitbox.setAttribute("aria-hidden", "true");
  wrap.appendChild(gapHitbox);

  const connector = document.createElement("div");
  connector.className =
    "map-marker-connector pointer-events-none absolute left-1/2 z-[15] w-3 -translate-x-1/2";
  connector.setAttribute("aria-hidden", "true");
  connector.style.bottom = "16px";
  connector.style.height = `${MAP_MARKER_POPUP_GAP_PX}px`;

  const svgNs = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNs, "svg");
  svg.setAttribute("viewBox", "0 0 12 36");
  svg.setAttribute("class", "map-marker-connector-svg h-full w-full overflow-visible");
  svg.setAttribute("aria-hidden", "true");

  const path = document.createElementNS(svgNs, "path");
  path.setAttribute("d", "M6 0.5V33");
  path.setAttribute("stroke", "currentColor");
  path.setAttribute("stroke-width", "2");
  path.setAttribute("stroke-linecap", "round");
  path.setAttribute("fill", "none");

  const joint = document.createElementNS(svgNs, "circle");
  joint.setAttribute("cx", "6");
  joint.setAttribute("cy", "33");
  joint.setAttribute("r", "3");
  joint.setAttribute("fill", "currentColor");
  joint.setAttribute("stroke", "white");
  joint.setAttribute("stroke-width", "1.5");

  svg.appendChild(path);
  svg.appendChild(joint);
  connector.appendChild(svg);
  wrap.appendChild(connector);

  const dot = document.createElement("div");
  dot.className =
    "map-marker-dot relative z-10 h-4 w-4 shrink-0 cursor-pointer rounded-full border-2 border-white shadow-md";
  dot.setAttribute("aria-hidden", "true");
  wrap.appendChild(dot);

  wrap.setAttribute("aria-label", `${m.title}, ${m.priceDisplay}`);

  bindMarkerPointerHover(wrap);

  return wrap;
}

export function HomeMapPreview({ markers, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    const containerEl = ref.current;
    if (!containerEl) {
      return;
    }
    const valid = markers.filter((m) => Number.isFinite(m.lat) && Number.isFinite(m.lng));
    const center: [number, number] =
      valid.length > 0 ? [valid[0].lng, valid[0].lat] : DEFAULT_CENTER;

    const map = new maplibregl.Map({
      container: containerEl,
      style: "https://tiles.openfreemap.org/styles/liberty",
      center,
      zoom: valid.length ? 12 : 8,
    });
    map.addControl(new maplibregl.NavigationControl(), "top-right");
    mapRef.current = map;

    const clearActiveMarkers = () => {
      containerEl.querySelectorAll(`.map-marker-wrap.${MAP_MARKER_ACTIVE_CLASS}`).forEach((node) => {
        node.classList.remove(MAP_MARKER_ACTIVE_CLASS);
        if (node instanceof HTMLElement) {
          setMaplibreMarkerStacking(node, false);
        }
      });
    };
    map.on("dragstart", clearActiveMarkers);

    const syncLabels = () => {
      syncZoomLabelsVisibility(
        map,
        containerEl,
        MAP_LABELS_VISIBLE_MIN_ZOOM,
        MAP_ZOOM_LABELS_VISIBLE_CONTAINER_CLASS,
      );
    };
    map.on("zoom", syncLabels);
    map.on("zoomend", syncLabels);
    map.on("idle", syncLabels);
    syncLabels();

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
      map.fitBounds(b, { padding: 48, maxZoom: MAP_FIT_BOUNDS_MAX_ZOOM });
    }

    return () => {
      map.off("zoom", syncLabels);
      map.off("zoomend", syncLabels);
      map.off("idle", syncLabels);
      map.off("dragstart", clearActiveMarkers);
      containerEl.classList.remove(MAP_ZOOM_LABELS_VISIBLE_CONTAINER_CLASS);
      map.remove();
      mapRef.current = null;
    };
  }, [markers]);

  return <div ref={ref} className={className ?? "h-[420px] w-full rounded-xl"} />;
}
