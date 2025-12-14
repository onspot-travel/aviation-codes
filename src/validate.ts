/**
 * Lightweight validation-only module.
 * Import from here when you only need to validate codes, not look up data.
 * Bundle size: ~50KB vs ~4MB for full library.
 *
 * @example
 * ```ts
 * import { airport, airline } from "aviation-codes/validate";
 *
 * airport.is("LAX");  // true
 * airline.is("AA");   // true
 * ```
 *
 * @module
 */

import { validIataAirlineCodes, validIcaoAirlineCodes } from "./data/airline-codes.js";
import { validIataAirportCodes, validIcaoAirportCodes } from "./data/airport-codes.js";

// ─── Airport Validation ─────────────────────────────────────────────────────

const airportIata = {
  isFormat: (code: string): boolean => /^[A-Z]{3}$/i.test(code),
  is: (code: string): boolean => validIataAirportCodes.has(code.toUpperCase()),
};

const airportIcao = {
  isFormat: (code: string): boolean => /^[A-Z]{4}$/i.test(code),
  is: (code: string): boolean => validIcaoAirportCodes.has(code.toUpperCase()),
};

export const airport = {
  /** Check if valid (auto-detects IATA/ICAO by length) */
  is: (code: string): boolean => {
    const len = code.length;
    if (len === 3) return airportIata.is(code);
    if (len === 4) return airportIcao.is(code);
    return false;
  },
  iata: airportIata,
  icao: airportIcao,
};

// ─── Airline Validation ─────────────────────────────────────────────────────

const airlineIata = {
  isFormat: (code: string): boolean => /^[A-Z0-9]{2}$/i.test(code),
  is: (code: string): boolean => validIataAirlineCodes.has(code.toUpperCase()),
};

const airlineIcao = {
  isFormat: (code: string): boolean => /^[A-Z]{3}$/i.test(code),
  is: (code: string): boolean => validIcaoAirlineCodes.has(code.toUpperCase()),
};

export const airline = {
  /** Check if valid (auto-detects IATA/ICAO by length) */
  is: (code: string): boolean => {
    const len = code.length;
    if (len === 2) return airlineIata.is(code);
    if (len === 3) return airlineIcao.is(code);
    return false;
  },
  iata: airlineIata,
  icao: airlineIcao,
};
