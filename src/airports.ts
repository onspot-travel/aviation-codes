import {
  airportsByIata,
  airportsByIcao,
  validIataAirportCodes,
  validIcaoAirportCodes,
} from "./data/airports.js";
import type { Airport, ParseResult } from "./types.js";

// ─── IATA Namespace ─────────────────────────────────────────────────────────

const iata = {
  /** Check if code matches IATA format (3 letters, no database lookup) */
  isFormat: (code: string): boolean => /^[A-Z]{3}$/i.test(code),

  /** Check if code exists in database */
  is: (code: string): boolean => validIataAirportCodes.has(code.toUpperCase()),

  /** Get airport data or undefined */
  get: (code: string): Airport | undefined => airportsByIata[code.toUpperCase()],

  /** Parse and validate, returning result object */
  parse: (code: string): ParseResult<Airport> => {
    const normalized = code.toUpperCase();
    const data = airportsByIata[normalized];
    return data ? { ok: true, data } : { ok: false };
  },

  /** All IATA codes */
  codes: (): string[] => [...validIataAirportCodes],

  /** Count of IATA codes */
  count: (): number => validIataAirportCodes.size,
};

// ─── ICAO Namespace ─────────────────────────────────────────────────────────

const icao = {
  /** Check if code matches ICAO format (4 letters, no database lookup) */
  isFormat: (code: string): boolean => /^[A-Z]{4}$/i.test(code),

  /** Check if code exists in database */
  is: (code: string): boolean => validIcaoAirportCodes.has(code.toUpperCase()),

  /** Get airport data or undefined */
  get: (code: string): Airport | undefined => airportsByIcao[code.toUpperCase()],

  /** Parse and validate, returning result object */
  parse: (code: string): ParseResult<Airport> => {
    const normalized = code.toUpperCase();
    const data = airportsByIcao[normalized];
    return data ? { ok: true, data } : { ok: false };
  },

  /** All ICAO codes */
  codes: (): string[] => [...validIcaoAirportCodes],

  /** Count of ICAO codes */
  count: (): number => validIcaoAirportCodes.size,
};

// ─── Auto-detect Functions ──────────────────────────────────────────────────

/**
 * Check if code is a valid airport (auto-detects IATA/ICAO by length)
 * @example
 * airport.is("LAX")   // true (IATA - 3 chars)
 * airport.is("KLAX")  // true (ICAO - 4 chars)
 */
function is(code: string): boolean {
  const len = code.length;
  if (len === 3) return iata.is(code);
  if (len === 4) return icao.is(code);
  return false;
}

/**
 * Get airport data (auto-detects IATA/ICAO by length)
 * @example
 * airport.get("LAX")   // Airport data
 * airport.get("KLAX")  // Airport data
 */
function get(code: string): Airport | undefined {
  const len = code.length;
  if (len === 3) return iata.get(code);
  if (len === 4) return icao.get(code);
  return undefined;
}

/**
 * Parse and validate (auto-detects IATA/ICAO by length)
 * @example
 * const result = airport.parse("LAX");
 * if (result.ok) console.log(result.data.name);
 */
function parse(code: string): ParseResult<Airport> {
  const len = code.length;
  if (len === 3) return iata.parse(code);
  if (len === 4) return icao.parse(code);
  return { ok: false };
}

/**
 * Search airports by name, city, country code, or airport code
 * @example
 * airport.search("Los Angeles")
 * airport.search("US", { limit: 5 })
 */
function search(query: string, options: { limit?: number } = {}): Airport[] {
  const { limit = 10 } = options;
  const q = query.toLowerCase();
  const results: Airport[] = [];

  for (const a of Object.values(airportsByIata)) {
    if (results.length >= limit) break;
    if (
      a.name.toLowerCase().includes(q) ||
      a.city.toLowerCase().includes(q) ||
      a.country.toLowerCase().includes(q) ||
      a.iata.toLowerCase() === q ||
      a.icao.toLowerCase() === q
    ) {
      results.push(a);
    }
  }

  return results;
}

// ─── Export ─────────────────────────────────────────────────────────────────

export const airport = {
  is,
  get,
  parse,
  search,
  iata,
  icao,
};

export type { Airport } from "./types.js";
