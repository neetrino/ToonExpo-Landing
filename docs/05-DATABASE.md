# Բազային տվյալներ — Toon Expo Landing

**ՍՈՒԲԴ.** PostgreSQL (Neon)  
**ORM.** Prisma  
**Վերջին թարմացում.** 2026-03-17

---

## Էնտիտիներ (v1)

### `User` (ադմին)
- `id`, `email`, `passwordHash` (argon2), `createdAt`, …
- Կապ Auth.js session table-ի հետ։

### `Project` (մասնակից / նախագիծ)
- `id` (uuid կամ cuid)
- `slug` — unique, URL
- `participantName` — արագ որոնման համար (`expo_field_01` հայելի, կամ միայն JSON-ից)
- `expoFields` — **Json** — `{ "expo_field_01": "...", ... "expo_field_53": "..." }`
- `createdAt`, `updatedAt`
- `published` — boolean (ըստ ցանկության)

**Հիմնավորում Json-ի համար.** Excel-ը 53 տարբեր տիպի տողային/URL դաշտեր; սխեմայի փոփոխություն առանց 53 սյունակ migration-ի։ Zod-ով վալիդացիա հավելվածում։

### `Session` / Auth.js աղյուսակներ
- Auth.js Prisma adapter սխեմա։

---

## Ինդեքսներ

- `Project.slug` — unique
- `Project.participantName` — index (optional, որոնում)
- Full-text որոնում — v2 կամ `pg_trgm` եթե անհրաժեշտ

---

## ժամանակային սահմաններ (Neon)

| Պարամետր | Արժեք |
|----------|-------|
| statement_timeout | 15s (serverless, տե՛ս TECH_CARD) |

Connection string — `DATABASE_URL` + `DIRECT_URL` (migrations)։

---

## Seed

- 1 admin user (dev)
- 1–2 նախագիծ `docs/data` CSV-ից կրճատված
