import { describe, expect, it } from "vitest";
import { formatAreasWithSqmSuffix } from "@/shared/lib/formatAreasDisplay";

describe("formatAreasWithSqmSuffix", () => {
  it("appends narrow space and m² when no unit", () => {
    expect(formatAreasWithSqmSuffix("53 - 188")).toBe("53 - 188\u00a0m²");
  });

  it("does not duplicate when m² already present", () => {
    expect(formatAreasWithSqmSuffix("40 m²")).toBe("40 m²");
  });

  it("returns empty for empty input", () => {
    expect(formatAreasWithSqmSuffix("")).toBe("");
    expect(formatAreasWithSqmSuffix(undefined)).toBe("");
  });
});
