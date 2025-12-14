# aviation-codes

[![CI](https://github.com/onspot-travel/aviation-codes/actions/workflows/ci.yml/badge.svg)](https://github.com/onspot-travel/aviation-codes/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/aviation-codes)](https://www.npmjs.com/package/aviation-codes)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Type-safe, tree-shakeable validation and lookup for IATA/ICAO airport and airline codes.

## Features

- Elegant namespace API (`airport.is()`, `airline.get()`)
- Auto-detection by code length (3-char IATA vs 4-char ICAO for airports)
- Tree-shakeable — import only what you need
- ESM and CommonJS dual exports
- Lightweight validation-only module (~50KB)
- 6,000+ IATA airport codes, 7,600+ ICAO airport codes
- 1,100+ IATA airline codes, 5,800+ ICAO airline codes

## Installation

```bash
npm install aviation-codes
# or
pnpm add aviation-codes
```

## Usage

### Airports

```typescript
import { airport } from "aviation-codes";

// Auto-detect by length (3=IATA, 4=ICAO)
airport.is("LAX");      // true
airport.is("KLAX");     // true
airport.get("JFK");     // Airport data
airport.get("KJFK");    // Airport data

// Explicit IATA
airport.iata.is("LAX");           // true
airport.iata.get("LAX");          // Airport data
airport.iata.isFormat("ABC");     // true (valid format)

// Explicit ICAO
airport.icao.is("EGLL");          // true
airport.icao.get("EGLL");         // Airport data

// Parse with result object
const result = airport.parse("LAX");
if (result.ok) {
  console.log(result.data.name);    // "Los Angeles International Airport"
  console.log(result.data.city);    // "Los Angeles"
  console.log(result.data.country); // "US"
  console.log(result.data.icao);    // "KLAX"
}

// Search
airport.search("Los Angeles");              // Array of airports
airport.search("US", { limit: 5 });         // Limit results

// Utilities
airport.iata.codes();   // All IATA codes
airport.iata.count();   // 6072
airport.icao.codes();   // All ICAO codes
airport.icao.count();   // 7692
```

### Airlines

```typescript
import { airline } from "aviation-codes";

// Auto-detect by length (2=IATA, 3=ICAO)
airline.is("AA");       // true
airline.is("AAL");      // true
airline.get("UA");      // Airline data
airline.get("UAL");     // Airline data

// Explicit IATA
airline.iata.is("AA");           // true
airline.iata.get("AA");          // Airline data

// Explicit ICAO
airline.icao.is("BAW");          // true
airline.icao.get("BAW");         // Airline data

// Parse with result object
const result = airline.parse("AA");
if (result.ok) {
  console.log(result.data.name);    // "American Airlines"
  console.log(result.data.icao);    // "AAL"
  console.log(result.data.country); // "US"
  console.log(result.data.active);  // true
}

// Search with options
airline.search("United", { limit: 5, activeOnly: true });

// Utilities
airline.iata.codes();   // All IATA codes
airline.iata.count();   // 1118
airline.icao.codes();   // All ICAO codes
airline.icao.count();   // 5852
```

### Lightweight Validation

Import only the validation module for smaller bundles (~50KB vs ~4MB):

```typescript
import { airport, airline } from "aviation-codes/validate";

airport.is("LAX");              // true (auto-detect)
airport.iata.is("LAX");         // true
airport.icao.is("KLAX");        // true
airport.iata.isFormat("ABC");   // true (format only)

airline.is("AA");               // true (auto-detect)
airline.iata.is("AA");          // true
airline.icao.is("AAL");         // true
```

## API Reference

### `airport`

| Method | Description |
|--------|-------------|
| `airport.is(code)` | Check if valid (auto-detects IATA/ICAO) |
| `airport.get(code)` | Get data (auto-detects IATA/ICAO) |
| `airport.parse(code)` | Parse and validate, returns `{ ok, data }` |
| `airport.search(query, options?)` | Search by name/city/country |
| `airport.iata.is(code)` | Check if valid IATA code |
| `airport.iata.get(code)` | Get by IATA code |
| `airport.iata.parse(code)` | Parse IATA code |
| `airport.iata.isFormat(code)` | Check format only (3 letters) |
| `airport.iata.codes()` | All IATA codes |
| `airport.iata.count()` | Count of IATA codes |
| `airport.icao.*` | Same methods for ICAO |

### `airline`

| Method | Description |
|--------|-------------|
| `airline.is(code)` | Check if valid (auto-detects IATA/ICAO) |
| `airline.get(code)` | Get data (auto-detects IATA/ICAO) |
| `airline.parse(code)` | Parse and validate, returns `{ ok, data }` |
| `airline.search(query, options?)` | Search by name/callsign/country |
| `airline.iata.is(code)` | Check if valid IATA code |
| `airline.iata.get(code)` | Get by IATA code |
| `airline.iata.parse(code)` | Parse IATA code |
| `airline.iata.isFormat(code)` | Check format only (2 alphanumeric) |
| `airline.iata.codes()` | All IATA codes |
| `airline.iata.count()` | Count of IATA codes |
| `airline.icao.*` | Same methods for ICAO |

### Types

```typescript
type Airport = {
  iata: string;
  icao: string;
  name: string;
  city: string;
  country: string;    // ISO 3166-1 alpha-2 (e.g., "US", "GB")
  latitude: number;   // -90 to 90
  longitude: number;  // -180 to 180
  elevation: number;  // feet above sea level
  timezone: string;   // IANA timezone (e.g., "America/Los_Angeles")
};

type Airline = {
  iata: string;
  icao: string;
  name: string;
  callsign: string;
  country: string;    // ISO 3166-1 alpha-2 (e.g., "US", "GB")
  active: boolean;
};

type ParseResult<T> = { ok: true; data: T } | { ok: false };
```

## Data Sources

- Airport data: [OpenFlights airports.dat](https://github.com/jpatokal/openflights/blob/master/data/airports.dat)
- Airline data: [OpenFlights airlines.dat](https://github.com/jpatokal/openflights/blob/master/data/airlines.dat)

## Updating Data

To refresh data from the source:

```bash
pnpm build:data
pnpm build
```

## License

MIT
