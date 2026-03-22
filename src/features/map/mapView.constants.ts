/**
 * Minimum map zoom at which project label cards are shown for all markers without hover.
 * Use ~12 for city/district views; 14 often never appears after fitBounds across all projects.
 */
export const MAP_LABELS_VISIBLE_MIN_ZOOM = 12;

/** Upper bound for zoom when fitting bounds to all markers (separate from label threshold). */
export const MAP_FIT_BOUNDS_MAX_ZOOM = 14;

/** Applied to the MapLibre container div when zoom >= MAP_LABELS_VISIBLE_MIN_ZOOM. */
export const MAP_ZOOM_LABELS_VISIBLE_CONTAINER_CLASS = "map-zoom-labels-visible";
