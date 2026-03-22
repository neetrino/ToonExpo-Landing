/**
 * Tailwind `lg` — դեսքտոպային լեյաութը սկսվում է այս լայնությունից (min-width).
 * `/p/.../mobile` — միայն նեղ էկրանների համար՝ ստորև այս արժեքից։
 */
export const TAILWIND_LG_MIN_WIDTH_PX = 1024;

/** Լրիվ համընկնում Tailwind `lg`-ի հետ՝ առանց «1024px = և մոբայլ, և դեսքտոպ» շրջանցման։ */
export const MOBILE_LANDING_BREAKPOINT_QUERY = `(max-width: ${TAILWIND_LG_MIN_WIDTH_PX - 1}px)`;
