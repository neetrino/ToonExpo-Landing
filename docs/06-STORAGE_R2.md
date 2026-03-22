# Ֆայլերի պահոց (R2)

**Վերջին թարմացում.** 2026-03-22

## Սկզբունք

- Բոլոր **մեդիա ֆայլերը** (լոգո, ռենդերներ, PDF, հատակագծեր) պահվում են **Cloudflare R2**-ում։
- Բազայում (`Project.expoFields`) պահվում են միայն **հանրային URL-ներ** կամ **R2-ում օբյեկտի key** + հանրային base (`R2_PUBLIC_URL`)։

## Ներմուծում

1. **Ադմին** — դաշտում «Վերբեռնել» → սերվերը բեռնում է R2 → դաշտում գրում է **ամբողջ URL** (`https://...r2.dev/...`)։
2. **CSV/Excel** — բջիջում կարող է լինել նույն **URL**-ը (ֆայլն արդեն R2-ում է) կամ արտաքին հղում։

## Key-երի ձևաչափ

| Նպատակ | Key-ի օրինակ |
|--------|----------------|
| Ադմին upload (փաստաթղթավորված) | `uploads/{random}.{ext}` |
| Ստատիկ Figma (`public/figma`) | `static/figma/...` (նույն հարաբերական ճանապարհը, ինչ `public/`-ում) |
| Նախագծի պանակ (`public/project/{id}`) | `projects/{mediaFolderId}/Exterior/1.webp`, `Logo/Logo.png`, … |

Հանրային URL. `R2_PUBLIC_URL` + `/` + key (առանց կրկնակի սլեշի)։

## Սինք սկրիպտներ (տեղական մեքենա)

- `pnpm sync:figma-r2` — `public/figma/**` → `static/figma/**`
- `pnpm sync:project-r2` — `public/project/**` → `projects/**`

Պահանջում են լրացված R2 env (տե՛ս `.env.example`)։ Լենդինգի ստատիկ URL-ների համար prod-ում `NEXT_PUBLIC_ASSET_BASE_URL`-ը սովորաբար հավասար է `R2_PUBLIC_URL`-ին (`publicAssetUrl`)։

## Նախագծի մեդիա (լենդինգ)

`resolveProjectFolderMedia` նախ փորձում է **R2**-ում `projects/{id}/` նախածանցով օբյեկտներ list անել. եթե դատարկ է — fallback **`public/project/{id}/`** ֆայլային համակարգին։

## Env

- `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_PUBLIC_URL`
- `NEXT_PUBLIC_ASSET_BASE_URL` — (ընտրովի) Figma ստատիկ URL-ների base prod-ում

## CORS

Եթե բրաուզերը ուղղակի հարցում է անում R2 հանրային URL-ին — Cloudflare R2 բակետի **CORS**-ում ավելացրու՛ հավելվածի origin-ը (`NEXT_PUBLIC_APP_URL`)։
