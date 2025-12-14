import { describe, expect, it } from "vitest";
import { airline, airport } from "../src/validate.js";

describe("validate module", () => {
  describe("airport", () => {
    it("is() auto-detects by length", () => {
      expect(airport.is("LAX")).toBe(true);
      expect(airport.is("KLAX")).toBe(true);
      expect(airport.is("XX")).toBe(false);
      expect(airport.is("XXXXX")).toBe(false);
    });

    it("iata.is() validates IATA codes", () => {
      expect(airport.iata.is("LAX")).toBe(true);
      expect(airport.iata.is("")).toBe(false);
    });

    it("icao.is() validates ICAO codes", () => {
      expect(airport.icao.is("KLAX")).toBe(true);
      expect(airport.icao.is("")).toBe(false);
    });

    it("iata.isFormat() checks format only", () => {
      expect(airport.iata.isFormat("ABC")).toBe(true);
      expect(airport.iata.isFormat("AB1")).toBe(false);
      expect(airport.iata.isFormat("AB")).toBe(false);
    });

    it("icao.isFormat() checks format only", () => {
      expect(airport.icao.isFormat("ABCD")).toBe(true);
      expect(airport.icao.isFormat("ABC1")).toBe(false);
      expect(airport.icao.isFormat("ABC")).toBe(false);
    });
  });

  describe("airline", () => {
    it("is() auto-detects by length", () => {
      expect(airline.is("AA")).toBe(true);
      expect(airline.is("AAL")).toBe(true);
      expect(airline.is("A")).toBe(false);
      expect(airline.is("AAAA")).toBe(false);
    });

    it("iata.is() validates IATA codes", () => {
      expect(airline.iata.is("AA")).toBe(true);
      expect(airline.iata.is("")).toBe(false);
    });

    it("icao.is() validates ICAO codes", () => {
      expect(airline.icao.is("AAL")).toBe(true);
      expect(airline.icao.is("")).toBe(false);
    });

    it("iata.isFormat() checks format only", () => {
      expect(airline.iata.isFormat("AA")).toBe(true);
      expect(airline.iata.isFormat("2A")).toBe(true);
      expect(airline.iata.isFormat("A")).toBe(false);
    });

    it("icao.isFormat() checks format only", () => {
      expect(airline.icao.isFormat("AAL")).toBe(true);
      expect(airline.icao.isFormat("AA1")).toBe(false);
      expect(airline.icao.isFormat("AA")).toBe(false);
    });
  });
});
