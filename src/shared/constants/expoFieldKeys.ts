/** 53 դաշտերի բանալիներ (Excel սյունակների հերթականություն) */
export const EXPO_FIELD_COUNT = 53;

export function getExpoFieldKey(indexOneBased: number): string {
  if (indexOneBased < 1 || indexOneBased > EXPO_FIELD_COUNT) {
    throw new RangeError(`expo field index out of range: ${indexOneBased}`);
  }
  return `expo_field_${String(indexOneBased).padStart(2, "0")}`;
}

export const EXPO_FIELD_KEYS: readonly string[] = Array.from(
  { length: EXPO_FIELD_COUNT },
  (_, i) => getExpoFieldKey(i + 1),
);

export const EXPO_FIELD_LABELS_HY: Record<string, string> = {
  expo_field_01: "Մասնակցի անուն",
  expo_field_02: "1․ Նախագծի անվանումը",
  expo_field_03: "6․ Հասցե (երկիր, քաղաք)",
  expo_field_04: "8․ Շինաշխատանքների մեկնարկ",
  expo_field_05: "9․ Շինաշխատանքների ավարտ",
  expo_field_06: "15․ Բնակարանների մակերեսների տարբերակներ",
  expo_field_07: "11․ Միավոր մակերեսի նվազագույն արժեք (դրամ)",
  expo_field_08: "12․ Միավոր մակերեսի առավելագույն արժեք (դրամ)",
  expo_field_09: "17․ Եկամտային հարկի հետվերադարձ",
  expo_field_10: "10․ Գործընկեր բանկեր",
  expo_field_11: "2․ Կառուցապատող",
  expo_field_12: "3․ Նախագծող",
  expo_field_13: "4․ Շինարարական ընկերություն",
  expo_field_14: "5․ Կառավարող ընկերություն",
  expo_field_15: "7․ Տեղադիրք քարտեզի վրա",
  expo_field_16: "Կորդինատներ (lat,lng)",
  expo_field_17: "13․ Միավորի նվազագույն արժեք (դրամ)",
  expo_field_18: "14․ Միավորի առավելագույն արժեք (դրամ)",
  expo_field_19: "16․ Ձեռքբերման պայմաններ",
  expo_field_20: "18․ Կառուցապատման տեսակ",
  expo_field_21: "19․ Արտաքին երեսպատում",
  expo_field_22: "20․ Ջերմ/ձայնամեկուսացում",
  expo_field_23: "21․ Հողատարածքի մակերես",
  expo_field_24: "22․ Բնակելի հատվածի մակերես",
  expo_field_25: "23․ Հարկայնություն",
  expo_field_26: "24․ Բնակարանների ընդհանուր քանակ",
  expo_field_27: "25․ Առկա բնակարանների քանակ",
  expo_field_28: "26․ Բնակարաններ հարկում",
  expo_field_29: "27․ Առաստաղի բարձրություն",
  expo_field_30: "28․ Վերելակներ",
  expo_field_31: "29․ Հանձնման վիճակ",
  expo_field_32: "30․ Սպասարկման ամսական վճար",
  expo_field_33: "31․ Կանաչապատում / ժամանց",
  expo_field_34: "32․ Առավելություններ բնակիչների համար",
  expo_field_35: "33․ Ջեռուցում",
  expo_field_36: "34․ Հովացում",
  expo_field_37: "35․ Բաց կայանատեղի",
  expo_field_38: "36․ Փակ կայանատեղի",
  expo_field_39: "37․ Կայանատեղու չափ",
  expo_field_40: "38․ Կայանատեղու արժեք",
  expo_field_41: "39․ Կոմերցիոն տարածքներ",
  expo_field_42: "40․ Սուբսիդիա / պետական աջակցություն",
  expo_field_43: "41․ Արտաքին ռենդերներ (URL)",
  expo_field_44: "42․ Ներքին ռենդերներ (URL)",
  expo_field_45: "43․ Տիպային ինտերակտիվ տուր (URL)",
  expo_field_46: "44․ Տեսահոլովակ (URL)",
  expo_field_47: "45․ Արտաքին ինտերակտիվ տուր (URL)",
  expo_field_48: "46․ 2D հատակագծեր (URL)",
  expo_field_49: "47․ 3D / վիզուալիզացիա (URL)",
  expo_field_50: "48․ Լոգոտիպ (URL)",
  expo_field_51: "49․ Կայքէջ",
  expo_field_52: "50․ Instagram",
  expo_field_53: "51․ Facebook",
};

export type ExpoFieldGroupId =
  | "meta"
  | "companies"
  | "location"
  | "dates"
  | "pricing"
  | "purchase"
  | "construction"
  | "units"
  | "hvac"
  | "parking"
  | "commercial"
  | "media"
  | "social";

export const EXPO_FIELD_GROUPS: {
  id: ExpoFieldGroupId;
  titleHy: string;
  keys: readonly string[];
}[] = [
  { id: "meta", titleHy: "Ընդհանուր", keys: ["expo_field_01", "expo_field_02"] },
  {
    id: "companies",
    titleHy: "Ընկերություններ",
    keys: [
      "expo_field_11",
      "expo_field_12",
      "expo_field_13",
      "expo_field_14",
    ],
  },
  {
    id: "location",
    titleHy: "Տեղադիրք",
    keys: ["expo_field_03", "expo_field_15", "expo_field_16"],
  },
  { id: "dates", titleHy: "Ժամկետներ", keys: ["expo_field_04", "expo_field_05"] },
  {
    id: "pricing",
    titleHy: "Գներ և բանկեր",
    keys: [
      "expo_field_06",
      "expo_field_07",
      "expo_field_08",
      "expo_field_09",
      "expo_field_10",
      "expo_field_17",
      "expo_field_18",
    ],
  },
  { id: "purchase", titleHy: "Ձեռքբերման պայմաններ", keys: ["expo_field_19"] },
  {
    id: "construction",
    titleHy: "Շինարարություն",
    keys: [
      "expo_field_20",
      "expo_field_21",
      "expo_field_22",
      "expo_field_23",
      "expo_field_24",
      "expo_field_25",
      "expo_field_31",
      "expo_field_32",
      "expo_field_33",
      "expo_field_34",
    ],
  },
  {
    id: "units",
    titleHy: "Բնակարաններ / հարկեր",
    keys: [
      "expo_field_26",
      "expo_field_27",
      "expo_field_28",
      "expo_field_29",
      "expo_field_30",
    ],
  },
  { id: "hvac", titleHy: "Ջեռուցում / հովացում", keys: ["expo_field_35", "expo_field_36"] },
  {
    id: "parking",
    titleHy: "Կայանատեղի",
    keys: ["expo_field_37", "expo_field_38", "expo_field_39", "expo_field_40"],
  },
  {
    id: "commercial",
    titleHy: "Կոմերցիոն / սուբսիդիա",
    keys: ["expo_field_41", "expo_field_42"],
  },
  {
    id: "media",
    titleHy: "Մեդիա և ֆայլեր",
    keys: [
      "expo_field_43",
      "expo_field_44",
      "expo_field_45",
      "expo_field_46",
      "expo_field_47",
      "expo_field_48",
      "expo_field_49",
      "expo_field_50",
    ],
  },
  {
    id: "social",
    titleHy: "Կայք և սոցցանցեր",
    keys: ["expo_field_51", "expo_field_52", "expo_field_53"],
  },
];

/** Խմբագրման նավիգացիա — միավորված բաժիններ (<10) */
export type ExpoEditSectionId =
  | "overview"
  | "place_time"
  | "finance"
  | "building"
  | "comfort"
  | "media"
  | "online";

export const EXPO_EDIT_SECTIONS: readonly {
  id: ExpoEditSectionId;
  titleHy: string;
  descriptionHy: string;
  groupIds: readonly ExpoFieldGroupId[];
}[] = [
  {
    id: "overview",
    titleHy: "Անուն և ընկերություններ",
    descriptionHy: "Նախագիծ, մասնակից, կառուցապատողներ",
    groupIds: ["meta", "companies"],
  },
  {
    id: "place_time",
    titleHy: "Տեղադիրք և ժամկետներ",
    descriptionHy: "Հասցե, քարտեզ, շինաշխատանքներ",
    groupIds: ["location", "dates"],
  },
  {
    id: "finance",
    titleHy: "Գներ և ձեռքբերում",
    descriptionHy: "Արժեքներ, բանկեր, պայմաններ",
    groupIds: ["pricing", "purchase"],
  },
  {
    id: "building",
    titleHy: "Շինարարություն և բնակարաններ",
    descriptionHy: "Շենք, հարկեր, մակերեսներ, վերելակ",
    groupIds: ["construction", "units"],
  },
  {
    id: "comfort",
    titleHy: "Ջեռուցում, կայան, կոմերցիա",
    descriptionHy: "HVAC, կայանատեղի, սուբսիդիա",
    groupIds: ["hvac", "parking", "commercial"],
  },
  {
    id: "media",
    titleHy: "Մեդիա և ֆայլեր",
    descriptionHy: "Ռենդերներ, տուրեր, լոգո",
    groupIds: ["media"],
  },
  {
    id: "online",
    titleHy: "Կայք և սոցցանցեր",
    descriptionHy: "Հղումներ և հասարակական ցանցեր",
    groupIds: ["social"],
  },
] as const;
