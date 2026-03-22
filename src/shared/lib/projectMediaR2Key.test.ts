import { describe, expect, it } from "vitest";
import {
  buildProjectMediaObjectKey,
  buildProjectMediaObjectKeyFromRelativePath,
  buildProjectPrefixFromRelativePath,
  relativePathFromAbsolutePrefix,
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

describe("buildProjectPrefixFromRelativePath", () => {
  it("returns project root for empty path", () => {
    expect(buildProjectPrefixFromRelativePath("37", "")).toBe("projects/37/");
  });

  it("returns nested prefix for valid relative path", () => {
    expect(buildProjectPrefixFromRelativePath("37", "Exterior")).toBe("projects/37/Exterior/");
    expect(buildProjectPrefixFromRelativePath("37", "Exterior/sub")).toBe(
      "projects/37/Exterior/sub/",
    );
  });

  it("returns null when first segment is not allowed", () => {
    expect(buildProjectPrefixFromRelativePath("37", "Unknown/x")).toBe(null);
  });
});

describe("relativePathFromAbsolutePrefix", () => {
  it("maps common prefix to relative path", () => {
    expect(relativePathFromAbsolutePrefix("37", "projects/37/Exterior/")).toBe("Exterior");
    expect(relativePathFromAbsolutePrefix("37", "projects/37/Exterior/nested/")).toBe(
      "Exterior/nested",
    );
  });
});

describe("buildProjectMediaObjectKeyFromRelativePath", () => {
  it("builds key with nested path", () => {
    expect(buildProjectMediaObjectKeyFromRelativePath("2", "Logo", "a.png")).toBe(
      "projects/2/Logo/a.png",
    );
    expect(buildProjectMediaObjectKeyFromRelativePath("2", "Interior/room", "b.webp")).toBe(
      "projects/2/Interior/room/b.webp",
    );
  });
});
