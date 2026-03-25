# Անվտանգ դեպլոյ (Toon Expo Landing)

Դեմո/միջոցառման համար՝ նվազագույնը, որպեսզի կայքը և մուտքը աշխատեն կանխատեսելի։

## Պարտադիր env (production)

1. **`AUTH_SECRET`** — պատահական տող **առնվազն 32 նիշ** (օր. `openssl rand -base64 32`)։ Մի կիսվի՛ր repo-ով։
2. **`AUTH_URL`** — հանրային բազային URL-ը `https://your-domain.tld` (առանց վերջի `/`)։ Vercel-ում հաճախ համընկնում է `VERCEL_URL`-ի հետ, բայց հաստատի՛ր ձեռքով։
3. **`NEXT_PUBLIC_APP_URL`** — նույն հանրային URL-ը, եթե կոդը օգտագործում է։
4. **`DATABASE_URL` / `DIRECT_URL`** — Neon կամ այլ PostgreSQL, `sslmode=require` production-ում։

## Ադմին

- **Ուժեղ, եզակի գաղտնաբառ** միակ օգտատիրոջ համար։
- Seed-ից հետո փոխի՛ր գաղտնաբառը production DB-ում, եթե `SEED_ADMIN_PASSWORD`-ը թույլ էր։

## Ըստ ցանկության

- **`SECURITY_ENABLE_HSTS=true`** — միայն եթե կայքը **միշտ** բացվում է HTTPS-ով այդ դոմենում (հակառակ դեպքում մի միացնի՛ր)։
- **`NEXT_PUBLIC_EXTRA_IMAGE_HOSTNAMES`** — ստորակետով `hostname` ցանկ (առանց `https://`), եթե `next/image`-ով պետք է բեռնել արտաքին CDN-ից (լռելյայն թույլատրվում են միայն `R2_PUBLIC_URL`-ի հոսթը, `localhost`, `127.0.0.1`)։

## Perimeter (ոչ կոդ)

- Cloudflare / Vercel firewall, rate limit edge-ում — ըստ հոսթինգի փաստաթղթերի։
- `pnpm audit` — տես CI workflow։
