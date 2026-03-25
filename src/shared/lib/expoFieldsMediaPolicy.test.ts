import { describe, expect, it } from "vitest";
import { PROJECT_FIELD } from "@/shared/constants/expoFieldKeys";
import {
  isDriveOrDocsUrl,
  sanitizeExpoFieldsFromCsvForMediaPolicy,
  sanitizeMediaSingleUrlField,
  sanitizeMediaUrlList,
} from "@/shared/lib/expoFieldsMediaPolicy";
import { emptyExpoFields } from "@/shared/lib/expoFields";

const F = PROJECT_FIELD;

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
  it("sanitizes video and virtual tour", () => {
    const base = emptyExpoFields();
    base[F.video] = "https://youtu.be/x";
    base[F.virtualTour] =
      '<iframe src="https://my.matterport.com/show/?m=abc" width="1" height="1"></iframe>';
    const out = sanitizeExpoFieldsFromCsvForMediaPolicy(base);
    expect(out[F.video]).toBe("https://youtu.be/x");
    expect(out[F.virtualTour]).toBe("https://my.matterport.com/show/?m=abc");
  });
});
