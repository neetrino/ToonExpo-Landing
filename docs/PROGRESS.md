# Զարգացման առաջընթաց — Toon Expo Landing

| Փուլ | Նկարագրություն | Ստատուս |
|------|----------------|---------|
| 0 | BRIEF, DATA_FIELDS_SCHEMA, LANDING_FIGMA_SPEC | ✅ |
| 1 | Չափ B, TECH_CARD, 01–05, DECISIONS | ✅ |
| 2 | Next.js, Prisma, Auth.js, R2 util, `.env.example` | ✅ |
| 3 | Ադմին CRUD 53 դաշտ, upload API, CSV ներմուծում | ✅ |
| 4 | Լենդինգ `/p/[slug]`, պայմանական բլոկներ | ✅ |
| 5 | Գլխավոր — MapLibre + ցանկ + որոնում | ✅ |
| 6 | Vitest, GitHub Actions CI, README | ✅ |

**Վերջին թարմացում.** 2026-03-18

### Նշումներ

- Գաղտնաբառի հեշ — `bcryptjs` (Next middleware bundle-ի համատեղելիություն)։
- Production. Vercel + Neon env, `pnpm prisma migrate deploy`, seed մի անգամ։
