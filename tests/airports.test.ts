import { describe, expect, it } from "vitest";
import { airport } from "../src/airports.js";

describe("airport", () => {
  describe("iata.isFormat", () => {
    it("returns true for valid 3-letter codes", () => {
      expect(airport.iata.isFormat("LAX")).toBe(true);
      expect(airport.iata.isFormat("jfk")).toBe(true);
      expect(airport.iata.isFormat("LHR")).toBe(true);
    });

    it("returns false for invalid formats", () => {
      expect(airport.iata.isFormat("LA")).toBe(false);
      expect(airport.iata.isFormat("LAXS")).toBe(false);
      expect(airport.iata.isFormat("L1X")).toBe(false);
      expect(airport.iata.isFormat("")).toBe(false);
    });
  });

  describe("icao.isFormat", () => {
    it("returns true for valid 4-letter codes", () => {
      expect(airport.icao.isFormat("KLAX")).toBe(true);
      expect(airport.icao.isFormat("kjfk")).toBe(true);
      expect(airport.icao.isFormat("EGLL")).toBe(true);
    });

    it("returns false for invalid formats", () => {
      expect(airport.icao.isFormat("KLA")).toBe(false);
      expect(airport.icao.isFormat("KLAXS")).toBe(false);
      expect(airport.icao.isFormat("K1AX")).toBe(false);
      expect(airport.icao.isFormat("")).toBe(false);
    });
  });

  describe("iata.is", () => {
    it("returns true for known IATA codes", () => {
      expect(airport.iata.is("LAX")).toBe(true);
      expect(airport.iata.is("lax")).toBe(true);
      expect(airport.iata.is("JFK")).toBe(true);
    });

    it("returns false for unknown codes", () => {
      expect(airport.iata.is("XXX")).toBe(false);
      expect(airport.iata.is("ZZZ")).toBe(false);
    });
  });

  describe("icao.is", () => {
    it("returns true for known ICAO codes", () => {
      expect(airport.icao.is("KLAX")).toBe(true);
      expect(airport.icao.is("klax")).toBe(true);
      expect(airport.icao.is("EGLL")).toBe(true);
    });

    it("returns false for unknown codes", () => {
      expect(airport.icao.is("QQQQ")).toBe(false);
      expect(airport.icao.is("YYYY")).toBe(false);
    });
  });

  describe("is (auto-detect)", () => {
    it("auto-detects IATA (3 chars) vs ICAO (4 chars)", () => {
      expect(airport.is("LAX")).toBe(true);
      expect(airport.is("KLAX")).toBe(true);
      expect(airport.is("XX")).toBe(false);
      expect(airport.is("XXXXX")).toBe(false);
    });
  });

  describe("iata.parse", () => {
    it("returns ok with data for known codes", () => {
      const result = airport.iata.parse("LAX");
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data.name).toContain("Los Angeles");
        expect(result.data.icao).toBe("KLAX");
        expect(result.data.city).toBe("Los Angeles");
      }
    });

    it("returns not ok for unknown codes", () => {
      const result = airport.iata.parse("XXX");
      expect(result.ok).toBe(false);
    });
  });

  describe("icao.parse", () => {
    it("returns ok with data for known codes", () => {
      const result = airport.icao.parse("EGLL");
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data.name).toContain("Heathrow");
        expect(result.data.iata).toBe("LHR");
      }
    });

    it("returns not ok for unknown codes", () => {
      const result = airport.icao.parse("QQQQ");
      expect(result.ok).toBe(false);
    });
  });

  describe("parse (auto-detect)", () => {
    it("auto-detects and parses", () => {
      const iataResult = airport.parse("JFK");
      const icaoResult = airport.parse("KJFK");
      expect(iataResult.ok).toBe(true);
      expect(icaoResult.ok).toBe(true);
      if (iataResult.ok && icaoResult.ok) {
        expect(iataResult.data.icao).toBe("KJFK");
        expect(icaoResult.data.iata).toBe("JFK");
      }
    });
  });

  describe("iata.get", () => {
    it("returns airport for valid code", () => {
      const data = airport.iata.get("JFK");
      expect(data).toBeDefined();
      expect(data?.city).toBe("New York");
      expect(data?.icao).toBe("KJFK");
    });

    it("returns undefined for unknown code", () => {
      expect(airport.iata.get("XXX")).toBeUndefined();
    });

    it("is case-insensitive", () => {
      expect(airport.iata.get("jfk")).toEqual(airport.iata.get("JFK"));
    });
  });

  describe("icao.get", () => {
    it("returns airport for valid code", () => {
      const data = airport.icao.get("KSFO");
      expect(data).toBeDefined();
      expect(data?.iata).toBe("SFO");
      expect(data?.city).toBe("San Francisco");
    });

    it("returns undefined for unknown code", () => {
      expect(airport.icao.get("QQQQ")).toBeUndefined();
    });
  });

  describe("get (auto-detect)", () => {
    it("auto-detects and gets", () => {
      expect(airport.get("LAX")?.icao).toBe("KLAX");
      expect(airport.get("KLAX")?.iata).toBe("LAX");
    });
  });

  describe("search", () => {
    it("finds airports by city name", () => {
      const results = airport.search("Los Angeles");
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((a) => a.iata === "LAX")).toBe(true);
    });

    it("finds airports by IATA code", () => {
      const results = airport.search("lax");
      expect(results.some((a) => a.iata === "LAX")).toBe(true);
    });

    it("respects limit option", () => {
      const results = airport.search("air", { limit: 3 });
      expect(results.length).toBeLessThanOrEqual(3);
    });
  });

  describe("iata.codes", () => {
    it("returns array of all IATA codes", () => {
      const codes = airport.iata.codes();
      expect(codes.length).toBeGreaterThan(5000);
      expect(codes.includes("LAX")).toBe(true);
    });
  });

  describe("icao.codes", () => {
    it("returns array of all ICAO codes", () => {
      const codes = airport.icao.codes();
      expect(codes.length).toBeGreaterThan(7000);
      expect(codes.includes("KLAX")).toBe(true);
    });
  });

  describe("count", () => {
    it("iata.count returns correct count", () => {
      expect(airport.iata.count()).toBeGreaterThan(5000);
    });

    it("icao.count returns correct count", () => {
      expect(airport.icao.count()).toBeGreaterThan(7000);
    });
  });
});
