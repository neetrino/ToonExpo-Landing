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
| 7 | Ադմին նախագիծ խմբագրել UI (ֆազա 2 front) | ✅ |

**Վերջին թարմացում.** 2026-03-18

### Ֆազա 2 front (նախագիծ խմբագրել)

- Վերտիկալ բաժիններ, մետա-քարտ (slug + հրապարակված + Lending + Պահպանել), Ջնջել՝ տաբերի տակ։

### Նշումներ

- Գաղտնաբառի հեշ — `bcryptjs` (Next middleware bundle-ի համատեղելիություն)։
- Production. Vercel + Neon env, `pnpm prisma migrate deploy`, seed մի անգամ։
