# Ճարտարապետություն — Toon Expo Landing

> Կենտրոնացված հարթակ՝ մասնակիցների (նախագծերի) լենդինգների, գլխավոր էջի (քարտեզ + ցանկ) և ադմին պանելի համար։

**Չափ.** B  
**Վերջին թարմացում.** 2026-03-17

---

## Ամբողջակ

### Նշանակություն
- Պահել մինչև 100–300+ **նախագծի** տվյալները (`expo_field_01` … `expo_field_53`՝ Excel-ի համարժեք)։
- **Դինամիկ լենդինգ** `/p/[slug]` — Figma մակետ, պայմանական բլոկներ։
- **Գլխավոր** — բոլոր նախագծերը քարտեզի և ցանկի վրա։
- **Ադմին** — CRUD, ֆայլերի բեռնում (R2), CSV ներմուծում։

### Օգտատերեր
- **Այցելու.** Գլխավոր, լենդինգ, որոնում։
- **Ադմին.** Միայն ավտորիզացված — բոլոր դաշտերի խմբագրում։

---

## Բարձր մակարդակ

```
                    ┌─────────────────────────────────┐
                    │         Vercel (Edge/Node)       │
                    │  Next.js App Router + Actions   │
└──────────┬────────┴──────────┬──────────────────────┘
           │                   │
           ▼                   ▼
    ┌──────────────┐    ┌──────────────┐
    │ Neon         │    │ Cloudflare   │
    │ PostgreSQL   │    │ R2 (S3 API)  │
    └──────────────┘    └──────────────┘
```

### Ճարտարապետական ոճ
**Modular monolith** (մեկ Next.js հավելված) — առանձին NestJS backend-ի v1-ում։

**Հիմնավորում.** Պարզ դեպլոյ, մեկ repo, բավարար B չափի համար; API-ն Route Handlers + Server Actions։

---

## Կոմպոնենտներ

| Մաս | Տեխնոլոգիա | Տեղ |
|-----|------------|-----|
| Public UI | Next.js Server/Client Components | `src/app/(public)/`, `src/features/landing/` |
| Admin UI | Next.js, shadcn | `src/app/(admin)/`, `src/features/admin/` |
| API | Route Handlers | `src/app/api/` |
| ԲԴ | Prisma | `prisma/` |
| Ֆայլեր | AWS SDK → R2 | `src/features/storage/` կամ `lib/r2.ts` |

---

## Տվյալների հոսք

1. **Լենդինգ.** SSR/SSG — `slug` → Prisma `Project` → `expoFields` JSON → բլոկների ֆիլտր (դատարկ = թաքնված)։
2. **Ադմին.** Server Action → Zod → Prisma update → revalidatePath/Tag։
3. **Upload.** Action → presigned POST կամ direct upload → URL պահպանվում է համապատասխան `expo_field_XX`-ում։

---

## Անվտանգություն

- Ադմին route group — middleware + Auth.js session։
- Բոլոր մուտքային տվյալներ — Zod։
- R2 — ոչ public write; միայն սերվերից կամ կարճաժամկետ presigned։
- CORS — հիմնականում նույն origin (Next)։

---

## Կապված փաստաթղթեր

- `TECH_CARD.md`, `02-TECH_STACK.md`, `03-STRUCTURE.md`, `04-API.md`, `05-DATABASE.md`, `DATA_FIELDS_SCHEMA.md`, `LANDING_FIGMA_SPEC.md`
