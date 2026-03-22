# Նախագծի մեդիա — `public/project/{Project ID}/` կամ R2 `projects/{Project ID}/`

Մեկ աղբյուր՝ `resolveProjectFolderMedia()` (`src/features/landing/lib/resolveProjectFolderMedia.ts`) — **կամ** տեղական `public/project/`, **կամ** Cloudflare R2 bucket-ում `projects/` նախածանցով (տե՛ս ներքև)։

## 1. Կառուցվածք և URL

### Տեղական ֆայլեր (`public/`)

- **Ճանապարհ.** `public/project/{mediaFolderId}/` — `{mediaFolderId}`-ը CSV-ի «Project ID»-ն է (նույնը՝ DB `Project.mediaFolderId`)։
- **Լենդինգի URL.** ` /p/{slug}` — `Project.slug`-ը հնարավորինս **նույն տողն է**, ինչ Project ID-ն (օր. `37` → `/p/37`)։ Ներմուծումից CSV-ից slug-ը ստացվում է «Project ID» սյունակից (`slugFromRow`); `mediaFolderId`-ը նույն արժեքն է (lowercase)։
- **Բացակայող Project ID CSV-ում.** Եթե բջիջը դատարկ է կամ անվավեր է՝ **ավտոմատ** տրվում է հաջորդ թվային id-ն՝ նախորդ տողերի առավելագույն թվից հետո (օր. վերջինը `50` էր → `51`)։ Հին ձևաչափում (առանց սյունակի)՝ `1`, `2`, `3` … հերթականությամբ։
- **Ադմին** — մեկ դաշտ `Project ID` թարմացնում է **և** slug-ը, **և** `mediaFolderId`-ը։
- **Թույլատրելի նիշեր id-ում.** `a-zA-Z0-9_-` (`sanitizeMediaFolderId`)։
- **Պատկերի ֆորմատներ.** `jpg`, `jpeg`, `png`, `webp`, `gif` (ըստ կոդի regex-ի)։

### R2 (Cloudflare bucket)

Տեղական `public/project/`-ից տարբերվում է **միայն վերին նախածանցը**. Bucket-ում նախագծերի արմատը **`projects/`** է (բազմական `s` — ոչ թե `public`-ի `project/`)։

| Տեղ | Նախածանց / path |
|-----|------------------|
| Տեղական | `public/project/{mediaFolderId}/…` |
| R2 object key | `projects/{mediaFolderId}/…` |

- **Նույն ենթածառը.** `Logo/`, `Exterior/`, `Interior/`, `3DFloorplan/`, `2Dfloorplan/` — հարաբերական ճանապարհը նույնն է, ինչ աղյուսակներում ներքև։
- **Հանրային URL.** `{R2_PUBLIC_URL}/projects/{mediaFolderId}/Logo/Logo.png` և այլն (`R2_PUBLIC_URL`-ը առանց վերջի `/`)։
- **Ընտրություն.** Եթե `projects/{id}/` ներքևում R2-ում օբյեկտներ կան — օգտագործվում է R2-ն։ Հակառակ դեպքում — fallback `public/project/{id}/` (`resolveProjectFolderMedia`)։

## 2. Լոգո (նախագծի բրենդ)

| Ֆայլ (հարաբերական) | Նշում |
|---------------------|--------|
| `Logo/Logo.png` | Գերակշռող |
| `Logo/Logo.webp`, `Logo/Logo.jpg`, `Logo/Logo.jpeg`, `Logo/logo.png` | Եթե նախորդը չկա — հերթական փորձ |

**Օգտագործում.** `logoUrl` — **միայն hero** բլոկում (և fallback `expo_field_50`)։ Sticky header-ը և մոբայլ menu-ի վերևի պատկերը՝ **կայքի** լոգոն (`/figma/home/footerLogo.svg`, ինչպես գլխավոր էջը)։

**Linux / տեղական deploy.** Պանակի/ֆայլի անունը case-sensitive է — նախընտրել `Logo/Logo.png`։ R2-ում նույնպես խորհուրդ է տրվում նույն հարաբերական ճանապարհները։

## 3. Hero, About, Infrastructure (նույնացված անուններ)

Ֆայլի **բազային անունը** պետք է լինի `1`, `2` կամ `3` + ընդլայնում (օր. `1.webp`, `2.jpg`)։

| Բլոկ | Պանակ | Բազային անուն | Կոդի դաշտ |
|------|--------|---------------|-----------|
| Hero ֆոն | `Exterior` | `1` | `heroUrl` |
| About — մեծ | `Exterior` | `2` | `aboutLargeUrl` |
| About — փոքր | `Interior` | `1` | `aboutSmallUrl` |
| Infrastructure — ձախ | `Exterior` | `2` | `infrastructureLeftUrl` |
| Infrastructure — աջ | `Exterior` | `3` | `infrastructureRightUrl` |

**Նշում.** `Exterior/2` միաժամանակ կարող է օգտագործվել About մեծ պատկերի և Infrastructure ձախի համար (նույն ֆայլը)։

## 4. Գալերեա

Ենթապանակների **հերթականություն.** `Exterior` → `Interior` → `3DFloorplan` → `2Dfloorplan`։

Յուրաքանչյուրում՝ բոլոր պատկերային ֆայլերը, **տեսակավորված** ֆայլի անունով (թվային տեսակավորում)։ Չկա պանակ — բաց է թողնվում։

## 5. CSV և DB

- Բաժանարար `;`, UTF-8։
- **Նոր ձևաչափ** (կա «Project ID» վերնագիր). սյուն 3 → `Project.mediaFolderId`։
- Սյունակների քարտեզ՝ `src/features/import/csvImport.ts`, դաշտերի ցանկ՝ `src/shared/constants/expoFieldKeys.ts`։

## 6. Fallback (եթե ֆայլ չկա)

- Պատկերներ URL-ներով՝ `expo_field_43` … (նախագծի մեդիա դաշտեր)։
- Figma ակտիվներ՝ `landingPage.constants` / `mobile/landingPage.constants`։

## 7. Տեխնիկական

- Server-only.resolve — R2-ի դեպքում `ListObjectsV2` `projects/{id}/` նախածանցով (`src/shared/lib/r2.ts`), հակառակ դեպքում `fs.existsSync` / `readdirSync` `public/project/{id}/`։
- Լենդինգ `page.tsx` — բեռնում է `folderMedia` և փոխանցում `LandingPage` / `LandingPageLower`։
