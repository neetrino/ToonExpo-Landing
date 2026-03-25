import { describe, expect, it } from "vitest";
import { PROJECT_FIELD } from "@/shared/constants/expoFieldKeys";
import { emptyExpoFields } from "@/shared/lib/expoFields";
import { parseExpoCsvBuffer, slugFromRow } from "@/features/import/csvImport";

const F = PROJECT_FIELD;

describe("parseExpoCsvBuffer", () => {
  it("normalizes virtual tour column to https URL after import", () => {
    const header = [
      "Մասնակցի անուն",
      "Project ID",
      F.titleExhibition,
      F.shortName,
      F.completion,
      F.areas,
      F.priceMin,
      F.priceMax,
      F.taxRefund,
      F.bank,
      F.developer,
      F.locationCoords,
      F.paymentOptions,
      F.structure,
      F.floors,
      F.ceiling,
      F.elevators,
      F.handover,
      F.parkingOpen,
      F.parkingClosed,
      F.video,
      F.email,
      F.phone,
      F.website,
      F.instagram,
      F.facebook,
      F.description,
      F.virtualTour,
    ].join(";");
    const cells = Array.from({ length: 28 }, (_, i) =>
      i === 1 ? "99" : i === 27 ? "https://my.matterport.com/show/?m=xx" : "x",
    );
    const csv = `${header}\n${cells.join(";")}\n`;
    const rows = parseExpoCsvBuffer(Buffer.from(csv, "utf-8"));
    expect(rows).toHaveLength(1);
    expect(rows[0].expoFields[F.virtualTour]).toBe("https://my.matterport.com/show/?m=xx");
  });

  it("returns empty array when only header", () => {
    expect(parseExpoCsvBuffer(Buffer.from("a;b\n", "utf-8"))).toEqual([]);
  });
});

describe("slugFromRow", () => {
  it("uses mediaFolderId when set", () => {
    const row = {
      expoFields: emptyExpoFields(),
      titleForSlug: "T",
      mediaFolderId: "my-id",
    };
    expect(slugFromRow(row, 0)).toBe("my-id");
  });
});
