import {
  airlinesByIata,
  airlinesByIcao,
  validIataAirlineCodes,
  validIcaoAirlineCodes,
} from "./data/airlines.js";
import type { Airline, ParseResult } from "./types.js";

// ─── IATA Namespace ─────────────────────────────────────────────────────────

const iata = {
  /** Check if code matches IATA format (2 alphanumeric chars, no database lookup) */
  isFormat: (code: string): boolean => /^[A-Z0-9]{2}$/i.test(code),

  /** Check if code exists in database */
  is: (code: string): boolean => validIataAirlineCodes.has(code.toUpperCase()),

  /** Get airline data or undefined */
  get: (code: string): Airline | undefined => airlinesByIata[code.toUpperCase()],

  /** Parse and validate, returning result object */
  parse: (code: string): ParseResult<Airline> => {
    const normalized = code.toUpperCase();
    const data = airlinesByIata[normalized];
    return data ? { ok: true, data } : { ok: false };
  },

  /** All IATA codes */
  codes: (): string[] => [...validIataAirlineCodes],

  /** Count of IATA codes */
  count: (): number => validIataAirlineCodes.size,
};

// ─── ICAO Namespace ─────────────────────────────────────────────────────────

const icao = {
  /** Check if code matches ICAO format (3 letters, no database lookup) */
  isFormat: (code: string): boolean => /^[A-Z]{3}$/i.test(code),

  /** Check if code exists in database */
  is: (code: string): boolean => validIcaoAirlineCodes.has(code.toUpperCase()),

  /** Get airline data or undefined */
  get: (code: string): Airline | undefined => airlinesByIcao[code.toUpperCase()],

  /** Parse and validate, returning result object */
  parse: (code: string): ParseResult<Airline> => {
    const normalized = code.toUpperCase();
    const data = airlinesByIcao[normalized];
    return data ? { ok: true, data } : { ok: false };
  },

  /** All ICAO codes */
  codes: (): string[] => [...validIcaoAirlineCodes],

  /** Count of ICAO codes */
  count: (): number => validIcaoAirlineCodes.size,
};

// ─── Auto-detect Functions ──────────────────────────────────────────────────

/**
 * Check if code is a valid airline (auto-detects IATA/ICAO by length)
 * @example
 * airline.is("AA")   // true (IATA - 2 chars)
 * airline.is("AAL")  // true (ICAO - 3 chars)
 */
function is(code: string): boolean {
  const len = code.length;
  if (len === 2) return iata.is(code);
  if (len === 3) return icao.is(code);
  return false;
}

/**
 * Get airline data (auto-detects IATA/ICAO by length)
 * @example
 * airline.get("AA")   // Airline data
 * airline.get("AAL")  // Airline data
 */
function get(code: string): Airline | undefined {
  const len = code.length;
  if (len === 2) return iata.get(code);
  if (len === 3) return icao.get(code);
  return undefined;
}

/**
 * Parse and validate (auto-detects IATA/ICAO by length)
 * @example
 * const result = airline.parse("AA");
 * if (result.ok) console.log(result.data.name);
 */
function parse(code: string): ParseResult<Airline> {
  const len = code.length;
  if (len === 2) return iata.parse(code);
  if (len === 3) return icao.parse(code);
  return { ok: false };
}

/**
 * Search airlines by name, callsign, country code, or airline code
 * @example
 * airline.search("American")
 * airline.search("US", { limit: 5, activeOnly: true })
 */
function search(query: string, options: { limit?: number; activeOnly?: boolean } = {}): Airline[] {
  const { limit = 10, activeOnly = false } = options;
  const q = query.toLowerCase();
  const results: Airline[] = [];

  for (const a of Object.values(airlinesByIata)) {
    if (results.length >= limit) break;
    if (activeOnly && !a.active) continue;
    if (
      a.name.toLowerCase().includes(q) ||
      a.callsign.toLowerCase().includes(q) ||
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

export const airline = {
  is,
  get,
  parse,
  search,
  iata,
  icao,
};

export type { Airline } from "./types.js";
