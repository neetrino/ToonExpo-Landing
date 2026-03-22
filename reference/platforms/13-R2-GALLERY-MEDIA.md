# R2 / static media — պատկերասրահի արագություն

> Խորհուրդներ նախագծի պատկերների (լենդինգի գալերեա, լայթբոքս) վրա՝ ցածր latency և փոքր բեռնում։

**Վերջին թարմացում.** 2026-03-22

---

## Ձևաչափեր

- Նախընտրելի՝ **WebP** կամ **AVIF** (նույն տեսողական որակի համար փոքր ֆայլ, քան մաքուր JPEG)։
- Խուսափել միայն չափազանց մեծ **JPEG/PNG**-ներից որպես միակ աղբյուրից։

## Պիքսելներ (լիաէկրան)

- Լայթբոքսի համար բավարար է **երկար կողմը մոտ 1920–2560 px** (կախված արտադրանքից)։
- **6000×4000** և նման մեծ ֆայլերը ուղղակի URL-ով դանդաղեցնում են բեռնումը՝ անկախ frontend օպտիմիզացիայից։

## HTTP cache (R2 / CDN)

- Ստատիկ ակտիվների համար արժե **`Cache-Control: public, max-age=…, immutable`** (երբ ֆայլի անունը պարունակում է hash/տարբերակ)։
- Կրկնվող այցելություններից հետո բրաուզերը կօգտագործի cache, ոչ թե կրկնի ամբողջ բեռնումը։

## Կոդում՝ `galleryThumbUrls`

- [`ResolvedProjectFolderMedia`](../../src/features/landing/lib/projectFolderMedia.types.ts)-ում `galleryThumbUrls` դաշտը **ըստ ցուցակի ինդեքսի** համընկնում է `galleryUrls`-ի հետ (նույն հերթականություն, նույն քանակ)։
- Եթե բացակայում է, UI-ում նախադիտման և լիաէկրանի համար օգտագործվում է նույն `fullUrl`-ը։

## Մեկ անգամյա batch օպտիմիզացիա (տեղում, ապա R2)

1. **Պահուստ** — պատճենել `public/project` կամ առանձին branch։
2. **Չոր վազք** — տեսնել ցանկը.
   ```bash
   pnpm optimize:project-images -- --dry-run
   ```
3. **Գրել WebP** (`--max` լռելյայն 2560, `--quality` լռելյայն 82).
   ```bash
   pnpm optimize:project-images --
   ```
   Եթե նույն անունով `.webp` արդեն կա, սկրիպտը **բաց է թողնում** — `pnpm optimize:project-images -- --force`։
4. **Ջնջել սկզբնական JPEG/PNG** (ըստ ցանկության, երբ համոզված եք).
   ```bash
   pnpm optimize:project-images -- --replace
   ```
5. **Վերբեռնել R2** — [sync-public-project-to-r2.ts](../../scripts/sync-public-project-to-r2.ts), հրամանը `pnpm sync:project-r2`։

Սկրիպտը մշակում է միայն **`.jpg` / `.jpeg` / `.png`** ֆայլերը `public/project/**` ներքո (կամ `--dir` արմատ)։

## Next.js `/_next/image` և timeout

- Next.js-ը հեռավոր պատկերը նախ բեռնում է սերվերով (`/_next/image`)՝ **մոտ 7 վրկ** սահմանաչափով։ Եթե R2-ից պատասխանը դանդաղ է, ստանում եք `TimeoutError` և `500`։
- Նախագծում պատկերասրահի համար `RemoteAwareImage` (`src/shared/components/RemoteAwareImage.tsx`) օգտագործում է `unoptimized` հեռավոր `https` URL-ների համար՝ ուղղակի բրաուզերի բեռնում։

## Կապ

- R2 ընդհանուր կարգավորում՝ [03-CLOUDFLARE.md](./03-CLOUDFLARE.md)։
