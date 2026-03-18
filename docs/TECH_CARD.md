# Toon Expo Landing — տեխնոլոգիական քարտ

**Նախագիծ.** Toon Expo — ցուցահանդեսի հարթակ (լենդինգներ + ադմին)  
**Չափ.** B  
**Ամսաթիվ.** 2026-03-17  
**Ստատուս.** հաստատված (մշակողի համաձայնություն)

---

## 1. Հիմք

| # | Պարամետր | Որոշում | Ստատուս |
|---|----------|---------|---------|
| 1.1 | Չափ | B | ✅ |
| 1.2 | Կառուցվածք | Feature-based | ✅ |
| 1.3 | Package manager | pnpm | ✅ |
| 1.4 | Node.js | 22.x LTS (նվազագույն 20.9+) | ✅ |
| 1.5 | TypeScript | 5.x, strict: true | ✅ |
| 1.6 | Monorepo | չի կիրառվում (մեկ Next.js հավելված) | ➖ |
| 1.7 | Git | feature branches → `dev` → `main` | ✅ |
| 1.8 | Commit | Conventional Commits | ✅ |

---

## 2. Frontend

| # | Պարամետր | Որոշում | Ստատուս |
|---|----------|---------|---------|
| 2.1 | Framework | Next.js (App Router), React 19 | ✅ |
| 2.2 | Ոճեր | Tailwind CSS 4.x | ✅ |
| 2.3 | UI | shadcn/ui | ✅ |
| 2.4 | State | Server Components + React state; Zustand — միայն անհրաժեշտության դեպքում | ✅ |
| 2.5 | Ձևեր | React Hook Form + Zod; Server Actions | ✅ |
| 2.6 | Data | Server Components + Server Actions; public revalidate | ✅ |
| 2.7 | i18n | Հիմնական UI — **հայերեն** (`hy`); next-intl կամ նման — եթե պետք լինի EN | 🔄 |
| 2.8 | SEO | Metadata API, Open Graph | ✅ |
| 2.9 | Մուգ թեմա | չի պլանավորվում (լենդինգ — լուսավոր/մուգ սեկցիաներ Figma-ով) | ➖ |
| 2.10 | Անիմացիա | CSS + հնարավոր է Framer Motion ընտրովի | 🔄 |
| 2.11 | PWA | չի պլանավորվում v1-ում | ➖ |

---

## 3. Backend

| # | Պարամետր | Որոշում | Ստատուս |
|---|----------|---------|---------|
| 3.1 | Տիպ | Next.js Route Handlers + Server Actions | ✅ |
| 3.2 | Վալիդացիա | Zod | ✅ |
| 3.3 | API | REST-անալոգ JSON (`/api/...`) | ✅ |
| 3.4 | Rate limiting | Middleware / Edge — ադմին և upload endpoints | ✅ |
| 3.5 | Swagger | v1-ում պարտադիր չէ | ➖ |
| 3.6 | CRON | չի պլանավորվում v1 | ➖ |
| 3.7 | Ֆայլեր | Server Action → S3-compatible upload → Cloudflare R2 | ✅ |

---

## 4. Բազային տվյալներ

| # | Պարամետր | Որոշում | Ստատուս |
|---|----------|---------|---------|
| 4.1 | ՍՈՒԲԴ | PostgreSQL (Neon) | ✅ |
| 4.2 | ORM | Prisma | ✅ |
| 4.3 | Դերեր | `app_user` (runtime), ոչ owner | ✅ |
| 4.4 | Connection pool | Neon serverless — լռելյայն; connection limit ըստ Neon պլանի | ✅ |
| 4.5 | statement_timeout | **15s** (առաջարկ serverless-ի համար; փոփոխելի production-ում) | ✅ |
| 4.6 | idle_in_transaction | Neon branch policy | ✅ |
| 4.7 | Seed | prisma db seed — dev | ✅ |
| 4.8 | Redis | v1-ում պարտադիր չէ | ➖ |

---

## 5. Ինքնություն

| # | Պարամետր | Որոշում | Ստատուս |
|---|----------|---------|---------|
| 5.1 | Լուծում | **Auth.js 5.x** — միայն ադմին (Credentials կամ Email) | ✅ |
| 5.2 | Դերեր | ADMIN | ✅ |
| 5.3 | Սեսիա | Database sessions (Prisma adapter) | ✅ |

> **Նշում.** `.env.example`-ում կարող են մնալ Clerk-ի placeholder-ներ — v1-ում նախատեսված է Auth.js։ Տե՛ս `DECISIONS.md`։

---

## 6. Պահոց և CDN

| # | Պարամետր | Որոշում | Ստատուս |
|---|----------|---------|---------|
| 6.1 | R2 | Cloudflare R2 — լոգո, ռենդերներ, PDF | ✅ |
| 6.2 | CDN | R2 public URL / Vercel | ✅ |
| 6.3 | Պատկերներ | next/image + արտաքին domain config | ✅ |

---

## 7. Քարտեզ

| # | Պարամետր | Որոշում | Ստատուս |
|---|----------|---------|---------|
| 7.1 | Գրադարան | **MapLibre GL** + OSM (կամ Leaflet) — առանց պարտադիր Mapbox billable | ✅ |

---

## 8. DevOps

| # | Պարամետր | Որոշում | Ստատուս |
|---|----------|---------|---------|
| 8.1 | Hosting | Vercel | ✅ |
| 8.2 | CI | GitHub Actions (lint, typecheck, build) | ✅ |
| 8.3 | Լոգեր | Pino (prod), structured | ✅ |

---

## 9. Թեստավորում

| # | Պարամետր | Որոշում | Ստատուս |
|---|----------|---------|---------|
| 9.1 | Unit | Vitest | ✅ |
| 9.2 | E2E | Playwright — ընտրովի փուլ 2 | 🔄 |
| 9.3 | Ծածկույթ | բիզնես-լոգիկա ≥70% նպատակ | 🔄 |

---

## 10. Փաստաթղթեր

| Ֆայլ | Ստատուս |
|------|---------|
| BRIEF.md | ✅ |
| DATA_FIELDS_SCHEMA.md | ✅ |
| LANDING_FIGMA_SPEC.md | ✅ |
| 01-ARCHITECTURE.md | ✅ |
| 02-TECH_STACK.md | ✅ |
| 03-STRUCTURE.md | ✅ |
| 04-API.md | ✅ |
| 05-DATABASE.md | ✅ |
| DECISIONS.md | ✅ |
| PROGRESS.md | ✅ |
