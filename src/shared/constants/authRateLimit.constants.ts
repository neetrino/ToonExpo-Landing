/** Պարզ IP-հիմքով սահմանափակում `/api/auth`-ի համար (մեկ Edge ինստանս)։ */
export const AUTH_RATE_LIMIT_WINDOW_MS = 60_000 as const;
export const AUTH_RATE_LIMIT_MAX_REQUESTS = 40 as const;
