# Տեխնոլոգիական stack — Toon Expo Landing

**Ամսաթիվ.** 2026-03-17  
**Մանրամասն քարտ.** `docs/TECH_CARD.md`

---

## Հիմնական

| Շերտ | Տեխնոլոգիա |
|------|------------|
| Runtime | Node.js 22 LTS |
| Package manager | pnpm |
| Framework | Next.js (App Router), React 19 |
| Լեզու | TypeScript strict |
| Ոճեր | Tailwind CSS 4, shadcn/ui |
| Ձևեր + վալիդացիա | React Hook Form, Zod |
| ԲԴ | PostgreSQL (Neon), Prisma |
| Auth | Auth.js 5, Prisma adapter |
| Ֆայլեր | Cloudflare R2 (S3 API) |
| Hosting | Vercel |
| Քարտեզ | MapLibre + OSM tiles |

---

## Գործիքներ

| Նպատակ | Գործիք |
|--------|--------|
| Lint / format | ESLint, Prettier |
| Unit tests | Vitest |
| CI | GitHub Actions |
| Logs | Pino |

---

## Չի օգտագործվում v1-ում

- NestJS (առանձին backend)
- Redis / BullMQ
- Clerk (նախընտրած է Auth.js — տե՛ս DECISIONS.md)
