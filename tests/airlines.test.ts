import { describe, expect, it } from "vitest";
import { airline } from "../src/airlines.js";

describe("airline", () => {
  describe("iata.isFormat", () => {
    it("returns true for valid 2-char codes", () => {
      expect(airline.iata.isFormat("AA")).toBe(true);
      expect(airline.iata.isFormat("ua")).toBe(true);
      expect(airline.iata.isFormat("2A")).toBe(true);
    });

    it("returns false for invalid formats", () => {
      expect(airline.iata.isFormat("A")).toBe(false);
      expect(airline.iata.isFormat("AAL")).toBe(false);
      expect(airline.iata.isFormat("")).toBe(false);
    });
  });

  describe("icao.isFormat", () => {
    it("returns true for valid 3-letter codes", () => {
      expect(airline.icao.isFormat("AAL")).toBe(true);
      expect(airline.icao.isFormat("ual")).toBe(true);
      expect(airline.icao.isFormat("BAW")).toBe(true);
    });

    it("returns false for invalid formats", () => {
      expect(airline.icao.isFormat("AA")).toBe(false);
      expect(airline.icao.isFormat("AALL")).toBe(false);
      expect(airline.icao.isFormat("A1L")).toBe(false);
      expect(airline.icao.isFormat("")).toBe(false);
    });
  });

  describe("iata.is", () => {
    it("returns true for known IATA codes", () => {
      expect(airline.iata.is("AA")).toBe(true);
      expect(airline.iata.is("aa")).toBe(true);
      expect(airline.iata.is("UA")).toBe(true);
    });

    it("returns false for truly invalid codes", () => {
      expect(airline.iata.is("")).toBe(false);
      expect(airline.iata.is("X")).toBe(false);
    });
  });

  describe("icao.is", () => {
    it("returns true for known ICAO codes", () => {
      expect(airline.icao.is("AAL")).toBe(true);
      expect(airline.icao.is("aal")).toBe(true);
      expect(airline.icao.is("BAW")).toBe(true);
    });

    it("returns false for truly invalid codes", () => {
      expect(airline.icao.is("")).toBe(false);
      expect(airline.icao.is("XX")).toBe(false);
    });
  });

  describe("is (auto-detect)", () => {
    it("auto-detects IATA (2 chars) vs ICAO (3 chars)", () => {
      expect(airline.is("AA")).toBe(true);
      expect(airline.is("AAL")).toBe(true);
      expect(airline.is("X")).toBe(false);
      expect(airline.is("XXXX")).toBe(false);
    });
  });

  describe("iata.parse", () => {
    it("returns ok with data for known codes", () => {
      const result = airline.iata.parse("AA");
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data.name).toContain("American");
        expect(result.data.icao).toBe("AAL");
        expect(result.data.active).toBe(true);
      }
    });

    it("returns not ok for invalid codes", () => {
      const result = airline.iata.parse("X");
      expect(result.ok).toBe(false);
    });
  });

  describe("icao.parse", () => {
    it("returns ok with data for known codes", () => {
      const result = airline.icao.parse("BAW");
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data.name).toContain("British");
        expect(result.data.iata).toBe("BA");
      }
    });

    it("returns not ok for invalid codes", () => {
      const result = airline.icao.parse("XX");
      expect(result.ok).toBe(false);
    });
  });

  describe("parse (auto-detect)", () => {
    it("auto-detects and parses", () => {
      const iataResult = airline.parse("UA");
      const icaoResult = airline.parse("UAL");
      expect(iataResult.ok).toBe(true);
      expect(icaoResult.ok).toBe(true);
      if (iataResult.ok && icaoResult.ok) {
        expect(iataResult.data.icao).toBe("UAL");
        expect(icaoResult.data.iata).toBe("UA");
      }
    });
  });

  describe("iata.get", () => {
    it("returns airline for valid code", () => {
      const data = airline.iata.get("UA");
      expect(data).toBeDefined();
      expect(data?.name).toContain("United");
      expect(data?.icao).toBe("UAL");
    });

    it("returns undefined for invalid code", () => {
      expect(airline.iata.get("X")).toBeUndefined();
    });

    it("is case-insensitive", () => {
      expect(airline.iata.get("ua")).toEqual(airline.iata.get("UA"));
    });
  });

  describe("icao.get", () => {
    it("returns airline for valid code", () => {
      const data = airline.icao.get("DLH");
      expect(data).toBeDefined();
      expect(data?.name).toContain("Lufthansa");
      expect(data?.iata).toBe("LH");
    });

    it("returns undefined for invalid code", () => {
      expect(airline.icao.get("XX")).toBeUndefined();
    });
  });

  describe("get (auto-detect)", () => {
    it("auto-detects and gets", () => {
      expect(airline.get("AA")?.icao).toBe("AAL");
      expect(airline.get("AAL")?.iata).toBe("AA");
    });
  });

  describe("search", () => {
    it("finds airlines by name", () => {
      const results = airline.search("American");
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((a) => a.iata === "AA")).toBe(true);
    });

    it("finds airlines by country code", () => {
      const results = airline.search("US");
      expect(results.length).toBeGreaterThan(0);
    });

    it("respects limit option", () => {
      const results = airline.search("air", { limit: 3 });
      expect(results.length).toBeLessThanOrEqual(3);
    });

    it("respects activeOnly option", () => {
      const results = airline.search("air", { activeOnly: true });
      expect(results.every((a) => a.active)).toBe(true);
    });
  });

  describe("iata.codes", () => {
    it("returns array of all IATA codes", () => {
      const codes = airline.iata.codes();
      expect(codes.length).toBeGreaterThan(1000);
      expect(codes.includes("AA")).toBe(true);
    });
  });

  describe("icao.codes", () => {
    it("returns array of all ICAO codes", () => {
      const codes = airline.icao.codes();
      expect(codes.length).toBeGreaterThan(5000);
      expect(codes.includes("AAL")).toBe(true);
    });
  });

  describe("count", () => {
    it("iata.count returns correct count", () => {
      expect(airline.iata.count()).toBeGreaterThan(1000);
    });

    it("icao.count returns correct count", () => {
      expect(airline.icao.count()).toBeGreaterThan(5000);
    });
  });
});
