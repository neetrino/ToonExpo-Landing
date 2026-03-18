# API — Toon Expo Landing

**Մոտեցում.** Next.js Route Handlers + Server Actions (հիմնականում JSON REST-անալոգ)։

**Վերջին թարմացում.** 2026-03-17

---

## Հանրային (անանուն)

| Մեթոդ | Path | Նկարագրություն |
|-------|------|----------------|
| GET | `/api/public/projects` | Ցանկ (քարտեզ + գլխավոր) — slug, անուն, կորդինատներ, կարճ դաշտեր |
| GET | `/api/public/projects/[slug]` | Մեկ նախագիծ լենդինգի համար (կամ միայն Server Component fetch) |

> Հանրային read-ը կարող է լինել միայն Prisma-ով Server Component-ից — API-ն ընտրովի, եթե պետք լինի արտաքին հաճախորդ։

---

## Ադմին (session պարտադիր)

| Մեթոդ | Path | Նկարագրություն |
|-------|------|----------------|
| GET/POST | Server Actions | Ստեղծում, թարմացում, ջնջում նախագծի |
| POST | `/api/admin/upload` կամ Action | R2 upload, վերադարձ URL |
| POST | `/api/admin/import` | CSV ներմուծում (բաժանարար `;`, UTF-8) |

---

## Վալիդացիա և սխալներ

- Մուտք — Zod սխեմաներ։
- Սխալներ — `{ error: string, code?: string }`, HTTP 4xx/5xx։
- Rate limit — upload և import endpoints։

---

## Տարբերակավորում

v1-ում versioning պարտադիր չէ; ապագայում `v1` prefix եթե հայտնվի mobile client։
