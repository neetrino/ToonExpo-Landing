const CYRILLIC_TO_LATIN: Record<string, string> = {
  а: "a",
  б: "b",
  в: "v",
  г: "g",
  д: "d",
  е: "e",
  ё: "yo",
  ж: "zh",
  з: "z",
  и: "i",
  й: "y",
  к: "k",
  л: "l",
  м: "m",
  н: "n",
  о: "o",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ф: "f",
  х: "h",
  ц: "ts",
  ч: "ch",
  ш: "sh",
  щ: "sch",
  ъ: "",
  ы: "y",
  ь: "",
  э: "e",
  ю: "yu",
  я: "ya",
};

/** Միապարզ slug՝ անգլերեն տառեր, թվեր, գծիկ */
export function slugifyTitle(title: string, fallback: string): string {
  const raw = title.trim() || fallback;
  let s = "";
  for (const ch of raw.toLowerCase()) {
    if (/[a-z0-9]/.test(ch)) {
      s += ch;
    } else if (ch === " " || ch === "-" || ch === "_") {
      s += "-";
    } else if (CYRILLIC_TO_LATIN[ch]) {
      s += CYRILLIC_TO_LATIN[ch];
    } else if (/[\u0530-\u058F]/.test(ch)) {
      s += "-";
    }
  }
  s = s.replace(/-+/g, "-").replace(/^-|-$/g, "");
  if (!s) {
    s = "project";
  }
  return s.slice(0, 80);
}
