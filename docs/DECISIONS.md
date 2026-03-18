# Կայացված որոշումներ — Toon Expo Landing

---

## D-001 — Նախագծի չափ

**Ամսաթիվ.** 2026-03-17  
**Որոշում.** Չափ **B**, կառուցվածք **feature-based** (`src/features/*`, `src/shared/*`)։  
**Հիմնավորում.** 53 դաշտ, ադմին, լենդինգ, քարտեզ, ներմուծում — A-ից ավելի է, C (monorepo) — ավելորդ v1-ում։

---

## D-002 — Stack

**Որոշում.** Next.js full-stack, Prisma, Neon, R2, Vercel, Auth.js։  
**Հիմնավորում.** Անհամապատասխանություն reference stack-ին; մեկ դեպլոյ, TypeScript end-to-end։

---

## D-003 — Auth

**Որոշում.** **Auth.js 5** (ադմին), ոչ Clerk v1-ում։  
**Հիմնավորում.** Ներքին կանոններ (00-core), argon2, database sessions։  
**Նշում.** `.env.example`-ում Clerk placeholder-ները կարող են մնալ այլ նախագծից — Toon Expo-ի համար ավելացնել `AUTH_SECRET`, `AUTH_URL`, DATABASE adapter։

---

## D-004 — Expo դաշտերի պահպանում

**Որոշում.** `Project.expoFields` JSON օբյեկտ, բանալիներ `expo_field_01` … `expo_field_53`։  
**Հիմնավորում.** Excel-ի 1:1 map, ճկունություն, Zod վալիդացիա։

---

## D-005 — Քարտեզ

**Որոշում.** MapLibre + OSM (առանց պարտադիր վճարովի Mapbox)։  
**Հիմնավորում.** `expo_field_16` lat,lng; բավարար է հանրային tile-ներով։

---

## D-006 — Գաղտնաբառի հեշ

**Ամսաթիվ.** 2026-03-18  
**Որոշում.** `bcryptjs` (ոչ argon2) ադմին Credentials-ի համար։  
**Հիմնավորում.** Next.js middleware bundle-ը չի տանելու argon2 / edge-ին համատեղելի։
