import { describe, expect, it } from "vitest";
import {
  buildProjectMediaObjectKey,
  validateProjectMediaObjectKey,
} from "@/shared/lib/projectMediaR2Key";

describe("validateProjectMediaObjectKey", () => {
  it("accepts key under allowed subfolder", () => {
    expect(
      validateProjectMediaObjectKey("37", "projects/37/Exterior/1.webp"),
    ).toEqual({ ok: true });
    expect(
      validateProjectMediaObjectKey("ab-c", "projects/ab-c/Logo/Logo.png"),
    ).toEqual({ ok: true });
  });

  it("rejects wrong prefix or traversal", () => {
    expect(validateProjectMediaObjectKey("37", "other/37/Exterior/1.webp").ok).toBe(
      false,
    );
    expect(
      validateProjectMediaObjectKey("37", "projects/37/Exterior/../x").ok,
    ).toBe(false);
    expect(validateProjectMediaObjectKey("37", "projects/37/Unknown/a.png").ok).toBe(
      false,
    );
  });
});

describe("buildProjectMediaObjectKey", () => {
  it("builds key for valid inputs", () => {
    expect(buildProjectMediaObjectKey("2", "Interior", "a.webp")).toBe(
      "projects/2/Interior/a.webp",
    );
  });

  it("returns null for bad file name", () => {
    expect(buildProjectMediaObjectKey("2", "Interior", "../../../x")).toBe(null);
  });
});
