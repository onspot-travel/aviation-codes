/**
 * IATA 3-letter airport code (e.g., "LAX", "JFK", "LHR")
 */
export type IATAAirportCode = string & { readonly __brand: "IATAAirportCode" };

/**
 * ICAO 4-letter airport code (e.g., "KLAX", "KJFK", "EGLL")
 */
export type ICAOAirportCode = string & { readonly __brand: "ICAOAirportCode" };

/**
 * IATA 2-letter airline code (e.g., "AA", "UA", "BA")
 */
export type IATAAirlineCode = string & { readonly __brand: "IATAAirlineCode" };

/**
 * ICAO 3-letter airline code (e.g., "AAL", "UAL", "BAW")
 */
export type ICAOAirlineCode = string & { readonly __brand: "ICAOAirlineCode" };

/**
 * Airport data structure
 */
export type Airport = {
  /** IATA 3-letter code (may be empty for smaller airports) */
  iata: string;
  /** ICAO 4-letter code */
  icao: string;
  /** Airport name */
  name: string;
  /** City name */
  city: string;
  /** ISO 3166-1 alpha-2 country code (e.g., "US", "GB", "JP") */
  country: string;
  /** Latitude in decimal degrees (-90 to 90) */
  latitude: number;
  /** Longitude in decimal degrees (-180 to 180) */
  longitude: number;
  /** Elevation in feet above sea level */
  elevation: number;
  /** IANA timezone identifier (e.g., "America/Los_Angeles") */
  timezone: string;
};

/**
 * Airline data structure
 */
export type Airline = {
  /** IATA 2-letter code (may be empty) */
  iata: string;
  /** ICAO 3-letter code (may be empty) */
  icao: string;
  /** Airline name */
  name: string;
  /** Airline callsign */
  callsign: string;
  /** ISO 3166-1 alpha-2 country code (e.g., "US", "GB", "JP") */
  country: string;
  /** Whether the airline is currently active */
  active: boolean;
};

/**
 * Result of parsing a code (Zod-style discriminated union)
 */
export type ParseResult<T> = { ok: true; data: T } | { ok: false };
