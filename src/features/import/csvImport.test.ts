import { describe, expect, it } from "vitest";
import { parseExpoCsvBuffer, slugFromRow } from "@/features/import/csvImport";

describe("parseExpoCsvBuffer", () => {
  it("parses old layout: 53 columns without Project ID", () => {
    const cells = Array.from({ length: 53 }, (_, i) => `v${i + 1}`);
    const csv = `h1;h2;h3\n${cells.join(";")}\n`;
    const rows = parseExpoCsvBuffer(Buffer.from(csv, "utf-8"));
    expect(rows.length).toBe(1);
    expect(rows[0].mediaFolderId).toBe("1");
    expect(rows[0].expoFields.expo_field_01).toBe("v1");
    expect(rows[0].expoFields.expo_field_02).toBe("v2");
    expect(rows[0].expoFields.expo_field_53).toBe("v53");
    expect(rows[0].expoFields.expo_field_47).toBe("");
    expect(rows[0].expoFields.expo_field_50).toBe("");
    expect(rows[0].titleForSlug).toBe("v2");
  });

  it("parses new layout: Project ID column shifts expo_field_02+", () => {
    const header =
      "Name;Extra;Project ID;Title;Addr;" +
      Array.from({ length: 51 }, (_, i) => `h${i + 6}`).join(";");
    const row1 = "Participant;;99;My Title;Yerevan;" + Array.from({ length: 51 }, () => "x").join(";");
    const csv = `${header}\n${row1}\n`;
    const rows = parseExpoCsvBuffer(Buffer.from(csv, "utf-8"));
    expect(rows.length).toBe(1);
    expect(rows[0].mediaFolderId).toBe("99");
    expect(rows[0].expoFields.expo_field_01).toBe("Participant");
    expect(rows[0].expoFields.expo_field_02).toBe("My Title");
    expect(rows[0].expoFields.expo_field_03).toBe("Yerevan");
    expect(rows[0].titleForSlug).toBe("My Title");
  });

  it("returns empty array when only header", () => {
    expect(parseExpoCsvBuffer(Buffer.from("a;b\n", "utf-8"))).toEqual([]);
  });

  it("strips Drive from gallery URLs and omits 47-50 from CSV", () => {
    const header =
      "Name;Extra;Project ID;Title;Addr;" +
      Array.from({ length: 51 }, (_, i) => `h${i + 6}`).join(";");
    /** Սյուն 5+j → expo_field_(4+j) — j=39 → 43, j=41 → 45 */
    const rest = Array.from({ length: 51 }, (_, j) => {
      if (j === 39) {
        return "https://drive.google.com/x";
      }
      if (j === 41) {
        return "https://youtu.be/abc";
      }
      return "x";
    }).join(";");
    const row1 = `Participant;;1;T;Addr;${rest}`;
    const csv = `${header}\n${row1}\n`;
    const rows = parseExpoCsvBuffer(Buffer.from(csv, "utf-8"));
    expect(rows.length).toBe(1);
    expect(rows[0].expoFields.expo_field_43).toBe("");
    expect(rows[0].expoFields.expo_field_45).toBe("https://youtu.be/abc");
    expect(rows[0].expoFields.expo_field_47).toBe("");
  });

  it("fills missing Project ID with next number after max explicit id", () => {
    const header =
      "Name;Extra;Project ID;Title;Addr;" +
      Array.from({ length: 51 }, (_, i) => `h${i + 6}`).join(";");
    const row1 =
      "A;;10;T1;Addr;" + Array.from({ length: 51 }, () => "x").join(";");
    const row2 =
      "B;;;T2;Addr;" + Array.from({ length: 51 }, () => "x").join(";");
    const csv = `${header}\n${row1}\n${row2}\n`;
    const rows = parseExpoCsvBuffer(Buffer.from(csv, "utf-8"));
    expect(rows.length).toBe(2);
    expect(rows[0].mediaFolderId).toBe("10");
    expect(rows[1].mediaFolderId).toBe("11");
  });
});

describe("slugFromRow", () => {
  it("uses sequential Project ID as slug for old layout rows", () => {
    const rows = parseExpoCsvBuffer(
      Buffer.from("a;b;c\nv1;v2;v3\n", "utf-8"),
    );
    expect(slugFromRow(rows[0], 0)).toBe("1");
  });

  it("uses CSV Project ID as slug when column exists", () => {
    const header =
      "Name;Extra;Project ID;Title;Addr;" +
      Array.from({ length: 51 }, (_, i) => `h${i + 6}`).join(";");
    const row1 = "Participant;;99;My Title;Yerevan;" + Array.from({ length: 51 }, () => "x").join(";");
    const csv = `${header}\n${row1}\n`;
    const rows = parseExpoCsvBuffer(Buffer.from(csv, "utf-8"));
    expect(slugFromRow(rows[0], 0)).toBe("99");
  });
});
