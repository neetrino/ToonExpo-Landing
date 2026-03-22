import { describe, expect, it } from "vitest";
import { parseDmsLatLng, parseLatLng, resolveLatLngForMap } from "./latLng";

describe("parseLatLng", () => {
  it("parses decimal pair with comma", () => {
    expect(parseLatLng("40.26819077681235, 44.638453402335806")).toEqual({
      lat: 40.26819077681235,
      lng: 44.638453402335806,
    });
  });

  it("rejects price-like garbage", () => {
    expect(parseLatLng("46 500,00")).toBeNull();
  });

  it("rejects out-of-range lng", () => {
    expect(parseLatLng("46, 500")).toBeNull();
  });
});

describe("parseDmsLatLng", () => {
  it("parses DMS pair", () => {
    const r = parseDmsLatLng(`40°16'05.6"N 44°38'18.4"E`);
    expect(r).not.toBeNull();
    expect(r!.lat).toBeCloseTo(40.2682, 3);
    expect(r!.lng).toBeCloseTo(44.6384, 3);
  });
});

describe("resolveLatLngForMap", () => {
  it("prefers expo_field_16", () => {
    const r = resolveLatLngForMap({
      expo_field_15: `40°16'05.6"N 44°38'18.4"E`,
      expo_field_16: "40.1, 44.2",
    });
    expect(r).toEqual({ lat: 40.1, lng: 44.2 });
  });

  it("falls back to DMS in expo_field_15", () => {
    const r = resolveLatLngForMap({
      expo_field_15: `40°16'05.6"N 44°38'18.4"E`,
      expo_field_16: "",
    });
    expect(r).not.toBeNull();
  });
});
