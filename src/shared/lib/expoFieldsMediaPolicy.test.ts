import { describe, expect, it } from "vitest";
import {
  isDriveOrDocsUrl,
  sanitizeExpoFieldsFromCsvForMediaPolicy,
  sanitizeMediaSingleUrlField,
  sanitizeMediaUrlList,
} from "@/shared/lib/expoFieldsMediaPolicy";
import { emptyExpoFields } from "@/shared/lib/expoFields";

describe("isDriveOrDocsUrl", () => {
  it("detects drive and docs hosts", () => {
    expect(isDriveOrDocsUrl("https://drive.google.com/file/x")).toBe(true);
    expect(isDriveOrDocsUrl("https://docs.google.com/spreadsheets/x")).toBe(true);
    expect(isDriveOrDocsUrl("https://cdn.example.com/a.png")).toBe(false);
  });
});

describe("sanitizeMediaUrlList", () => {
  it("removes only drive urls from list", () => {
    const raw =
      "https://r2.example.com/a.webp\nhttps://drive.google.com/x\nhttps://r2.example.com/b.webp";
    expect(sanitizeMediaUrlList(raw)).toBe(
      "https://r2.example.com/a.webp\nhttps://r2.example.com/b.webp",
    );
  });
});

describe("sanitizeMediaSingleUrlField", () => {
  it("clears drive url", () => {
    expect(sanitizeMediaSingleUrlField("https://drive.google.com/open?id=1")).toBe("");
  });
  it("keeps youtube", () => {
    expect(sanitizeMediaSingleUrlField("https://www.youtube.com/watch?v=1")).toBe(
      "https://www.youtube.com/watch?v=1",
    );
  });
});

describe("sanitizeExpoFieldsFromCsvForMediaPolicy", () => {
  it("clears 47-50 and filters lists", () => {
    const base = emptyExpoFields();
    base.expo_field_43 = "https://drive.google.com/a\nhttps://ok.com/b";
    base.expo_field_45 = "https://youtu.be/x";
    base.expo_field_47 = "https://example.com/tour";
    base.expo_field_50 = "https://x.com/logo.png";
    const out = sanitizeExpoFieldsFromCsvForMediaPolicy(base);
    expect(out.expo_field_43).toBe("https://ok.com/b");
    expect(out.expo_field_45).toBe("https://youtu.be/x");
    expect(out.expo_field_47).toBe("");
    expect(out.expo_field_50).toBe("");
  });
});
