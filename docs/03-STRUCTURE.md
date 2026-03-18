# Ֆայլերի կառուցվածք (չափ B, feature-based)

**Վերջին թարմացում.** 2026-03-17

Նախատեսված կառուցվածք `pnpm create next-app` + feature թղթապանակներից հետո։

```
ToonExpo-Landing/
├── docs/                    # Փաստաթղթավորում
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── public/
├── src/
│   ├── app/
│   │   ├── (public)/        # Գլխավոր, լենդինգ
│   │   ├── (admin)/         # Ադմին — auth guard
│   │   ├── api/             # Route handlers
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── features/
│   │   ├── builders/        # Նախագծի CRUD, expoFields
│   │   ├── landing/         # Լենդինգի բլոկներ (Figma)
│   │   ├── map/             # Քարտեզ (գլխավոր + լենդինգ)
│   │   ├── import/          # CSV/Excel ներմուծում
│   │   └── admin/           # Ադմին UI-ի խտացում
│   ├── shared/
│   │   ├── components/ui/   # shadcn
│   │   ├── lib/             # db, auth, logger
│   │   └── constants/       # expo field keys, routes
│   └── types/
├── .env.example
├── package.json
└── README.md
```

### Նշումներ

- **`expo_field_01` … `expo_field_53`** — տիպեր և Zod սխեմա `shared/constants` կամ `features/builders`։
- **Լենդինգ** — `features/landing`-ում բլոկ-կոմպոնենտներ; յուրաքանչյուրը ստուգում է իր դաշտերը։
