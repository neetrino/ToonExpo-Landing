import { describe, expect, it } from "vitest";
import { sanitizeMediaFolderId } from "@/shared/lib/mediaFolderId";

describe("sanitizeMediaFolderId", () => {
  it("accepts alphanumeric, dash, underscore", () => {
    expect(sanitizeMediaFolderId("abc123")).toBe("abc123");
    expect(sanitizeMediaFolderId("project-1")).toBe("project-1");
    expect(sanitizeMediaFolderId("a_b")).toBe("a_b");
  });

  it("trims whitespace", () => {
    expect(sanitizeMediaFolderId("  42  ")).toBe("42");
  });

  it("rejects empty and unsafe characters", () => {
    expect(sanitizeMediaFolderId("")).toBeNull();
    expect(sanitizeMediaFolderId("   ")).toBeNull();
    expect(sanitizeMediaFolderId(undefined)).toBeNull();
    expect(sanitizeMediaFolderId(null)).toBeNull();
    expect(sanitizeMediaFolderId("../etc")).toBeNull();
    expect(sanitizeMediaFolderId("a/b")).toBeNull();
    expect(sanitizeMediaFolderId("a b")).toBeNull();
  });

  it("rejects strings longer than 120", () => {
    expect(sanitizeMediaFolderId("a".repeat(121))).toBeNull();
    expect(sanitizeMediaFolderId("a".repeat(120))).toBe("a".repeat(120));
  });
});
