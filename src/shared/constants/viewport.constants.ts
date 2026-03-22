/**
 * Հեռախոս և թաբլետ — մինչև այս լայնությունը ներառյալ → `/p/.../mobile`։
 * (1024px՝ iPad և նման preset-ների լայնություն։)
 *
 * Դեսքտոպ միայն `1025px`-ից վեր — `/p/...` (առանց `/mobile`)։
 */
export const LANDING_MOBILE_TABLET_MAX_WIDTH_PX = 1024;

export const MOBILE_LANDING_BREAKPOINT_QUERY = `(max-width: ${LANDING_MOBILE_TABLET_MAX_WIDTH_PX}px)`;
