import { describe, expect, it } from "vitest";
import { parseExpoCsvBuffer } from "@/features/import/csvImport";

describe("parseExpoCsvBuffer", () => {
  it("parses header and one row", () => {
    const csv = "h1;h2;h3\na;b;c\n";
    const rows = parseExpoCsvBuffer(Buffer.from(csv, "utf-8"));
    expect(rows.length).toBe(1);
    expect((rows[0].expoFields as Record<string, string>).expo_field_01).toBe("a");
    expect((rows[0].expoFields as Record<string, string>).expo_field_02).toBe("b");
  });
});
