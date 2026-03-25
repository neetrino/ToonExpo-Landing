# Ստորաբաժանումների և դաշտերի սխեմա (Toon Expo)

> **Աղբյուր.** `docs/data/CorrectedToonExpoData2026.csv` — առաջին տողը = սյունակների անվանումները (հայերեն)։  
> **Ակտիվ դաշտեր.** 28 սյունակ (A–AB)։  
> **Կոդի բանալի.** JSON-ում պահվում է **նույն տեքստը**, ինչ CSV վերնագրում է (տե՛ս `PROJECT_FIELD` / `EXPO_FIELD_KEYS` — [`src/shared/constants/expoFieldKeys.ts`](../src/shared/constants/expoFieldKeys.ts))։

---

## Ցուցահանդեսի մեկ մասնակից = մեկ նախագիծ

Ադմինում և լենդինգում **նույն** դաշտերի բանալիները։ Տվյալների աղբյուրը — Corrected CSV։

---

## Ցուցադրման կանոն

1. **Դաշտ դատարկ է** → համապատասխան տողը/քարտը չենք ցուցադրում։  
2. **Բլոկի բոլոր կապված դաշտերը դատարկ են** → ամբողջ բլոկը չենք ցուցադրում (ներառյալ նավիգացիան, եթե կիրառելի է)։  
3. **Վիրտուալ տուր** — CSV-ում կարող է լինել iframe HTML; ներմուծման ժամանակ հանվում է `src` URL-ը (`extractVirtualTourUrl`)։

---

## Դաշտերի աղյուսակ (սյունակ → նշանակություն)

| Սյունակ | Բանալի (PROJECT_FIELD) | Նշում |
|---------|------------------------|--------|
| A | participantName | |
| B | projectId | Slug / mediaFolderId, JSON-ում էլ է պահվում |
| C | titleExhibition | Hero վերնագիր |
| D | shortName | Հասցե (տող) |
| E | completion | Շին ավարտ |
| F | areas | Մակերեսներ |
| G,H | priceMin, priceMax | Գին ք/մ |
| I | taxRefund | |
| J | bank | |
| K | developer | |
| L | locationCoords | lat,lng քարտեզի համար |
| M | paymentOptions | |
| N–R | structure … handover | Կառուցվածք — «Կառուցվածք» (N) լենդինգի քարտերում չի ցուցադրվում |
| S,T | parkingOpen, parkingClosed | |
| U | video | |
| V,W | email, phone | |
| X–Z | website, instagram, facebook | |
| AA | description | Նկարագրություն |
| AB | virtualTour | Matterport / URL (iframe → URL) |

---

## Հետ համատեղելիություն

Հին `expo_field_01`…`53` JSON-ը `normalizeExpoFields`-ում միգրացվում է նոր բանալիներով ([`expoFieldsLegacyMigration.ts`](../src/shared/lib/expoFieldsLegacyMigration.ts))։ Միանգամյա DB թարմացման համար՝ [`scripts/migrate-expo-fields-to-corrected.ts`](../scripts/migrate-expo-fields-to-corrected.ts)։

---

**Վերջին թարմացում.** 2026-03-25
