import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import countries from "i18n-iso-countries";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC_DATA_DIR = join(__dirname, "..", "src", "data");

// OpenFlights uses some non-standard country names
const COUNTRY_NAME_OVERRIDES: Record<string, string> = {
  Burma: "MM",
  "Congo (Brazzaville)": "CG",
  "Congo (Kinshasa)": "CD",
  "Cote d'Ivoire": "CI",
  "East Timor": "TL",
  "Falkland Islands": "FK",
  "Faroe Islands": "FO",
  "French Guiana": "GF",
  "French Polynesia": "PF",
  Guadeloupe: "GP",
  "Hong Kong": "HK",
  Iran: "IR",
  "Johnston Atoll": "UM",
  Korea: "KR",
  Laos: "LA",
  Macau: "MO",
  Martinique: "MQ",
  Mayotte: "YT",
  "Midway Islands": "UM",
  Moldova: "MD",
  "Netherlands Antilles": "AN",
  "North Korea": "KP",
  Palestine: "PS",
  Reunion: "RE",
  Russia: "RU",
  "Saint Helena": "SH",
  "Saint Kitts and Nevis": "KN",
  "Saint Lucia": "LC",
  "Saint Pierre and Miquelon": "PM",
  "Saint Vincent and the Grenadines": "VC",
  "Sao Tome and Principe": "ST",
  "South Korea": "KR",
  Syria: "SY",
  Taiwan: "TW",
  Tanzania: "TZ",
  "Trinidad and Tobago": "TT",
  "Turks and Caicos Islands": "TC",
  Venezuela: "VE",
  Vietnam: "VN",
  "Virgin Islands": "VI",
  "Wake Island": "UM",
  "Wallis and Futuna": "WF",
  "Western Sahara": "EH",
};

function getCountryCode(countryName: string): string {
  if (!countryName) return "";
  if (COUNTRY_NAME_OVERRIDES[countryName]) return COUNTRY_NAME_OVERRIDES[countryName];
  return countries.getAlpha2Code(countryName, "en") || "";
}

const AIRPORTS_URL =
  "https://raw.githubusercontent.com/jpatokal/openflights/master/data/airports.dat";
const AIRLINES_URL =
  "https://raw.githubusercontent.com/jpatokal/openflights/master/data/airlines.dat";

interface ProcessedAirport {
  iata: string;
  icao: string;
  name: string;
  city: string;
  country: string; // ISO 3166-1 alpha-2
  latitude: number;
  longitude: number;
  elevation: number;
  timezone: string;
}

interface ProcessedAirline {
  iata: string;
  icao: string;
  name: string;
  callsign: string;
  country: string; // ISO 3166-1 alpha-2
  active: boolean;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());

  return result.map((field) =>
    field === "\\N" || field === "" ? "" : field.replace(/^"|"$/g, "")
  );
}

async function fetchData(url: string): Promise<string> {
  console.log(`Fetching: ${url}`);
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  return response.text();
}

async function processAirports() {
  const data = await fetchData(AIRPORTS_URL);
  const lines = data.trim().split("\n");

  const byIata: Record<string, ProcessedAirport> = {};
  const byIcao: Record<string, ProcessedAirport> = {};
  const iataSet = new Set<string>();
  const icaoSet = new Set<string>();

  for (const line of lines) {
    const fields = parseCSVLine(line);
    if (fields.length < 14) continue;

    const [, name, city, country, iata, icao, latitude, longitude, altitude, , , tzDatabase] =
      fields;
    if (!icao && !iata) continue;

    const airport: ProcessedAirport = {
      iata: iata || "",
      icao: icao || "",
      name,
      city,
      country: getCountryCode(country),
      latitude: parseFloat(latitude) || 0,
      longitude: parseFloat(longitude) || 0,
      elevation: parseFloat(altitude) || 0,
      timezone: tzDatabase || "",
    };

    if (iata && iata.length === 3) {
      byIata[iata.toUpperCase()] = airport;
      iataSet.add(iata.toUpperCase());
    }
    if (icao && icao.length === 4) {
      byIcao[icao.toUpperCase()] = airport;
      icaoSet.add(icao.toUpperCase());
    }
  }

  console.log(`Processed ${iataSet.size} IATA airport codes, ${icaoSet.size} ICAO airport codes`);
  return { byIata, byIcao, iataSet, icaoSet };
}

async function processAirlines() {
  const data = await fetchData(AIRLINES_URL);
  const lines = data.trim().split("\n");

  const byIata: Record<string, ProcessedAirline> = {};
  const byIcao: Record<string, ProcessedAirline> = {};
  const iataSet = new Set<string>();
  const icaoSet = new Set<string>();

  for (const line of lines) {
    const fields = parseCSVLine(line);
    if (fields.length < 8) continue;

    const [, name, , iata, icao, callsign, country, active] = fields;
    if (!icao && !iata) continue;

    const airline: ProcessedAirline = {
      iata: iata || "",
      icao: icao || "",
      name,
      callsign: callsign || "",
      country: getCountryCode(country),
      active: active === "Y",
    };

    if (iata && iata.length === 2) {
      byIata[iata.toUpperCase()] = airline;
      iataSet.add(iata.toUpperCase());
    }
    if (icao && icao.length === 3) {
      byIcao[icao.toUpperCase()] = airline;
      icaoSet.add(icao.toUpperCase());
    }
  }

  console.log(`Processed ${iataSet.size} IATA airline codes, ${icaoSet.size} ICAO airline codes`);
  return { byIata, byIcao, iataSet, icaoSet };
}

async function main() {
  console.log("Building aviation data...\n");
  mkdirSync(SRC_DATA_DIR, { recursive: true });

  const [airports, airlines] = await Promise.all([processAirports(), processAirlines()]);

  // KEY INSIGHT: Separate validation codes from full data for tree-shaking
  // Users who only validate don't need to download full airport/airline objects

  // 1. Airport codes only (tiny ~50KB) - for validation
  writeFileSync(
    join(SRC_DATA_DIR, "airport-codes.ts"),
    `// Auto-generated - DO NOT EDIT
export const validIataAirportCodes = new Set<string>(${JSON.stringify([...airports.iataSet].sort())});
export const validIcaoAirportCodes = new Set<string>(${JSON.stringify([...airports.icaoSet].sort())});
`
  );

  // 2. Airline codes only (tiny ~100KB) - for validation
  writeFileSync(
    join(SRC_DATA_DIR, "airline-codes.ts"),
    `// Auto-generated - DO NOT EDIT
export const validIataAirlineCodes = new Set<string>(${JSON.stringify([...airlines.iataSet].sort())});
export const validIcaoAirlineCodes = new Set<string>(${JSON.stringify([...airlines.icaoSet].sort())});
`
  );

  // 3. Full airport data (large ~1MB) - for lookup
  writeFileSync(
    join(SRC_DATA_DIR, "airports.ts"),
    `// Auto-generated - DO NOT EDIT
import type { Airport } from "../types.js";
export { validIataAirportCodes, validIcaoAirportCodes } from "./airport-codes.js";
export const airportsByIata: Record<string, Airport> = ${JSON.stringify(airports.byIata)};
export const airportsByIcao: Record<string, Airport> = ${JSON.stringify(airports.byIcao)};
`
  );

  // 4. Full airline data (large ~4MB) - for lookup
  writeFileSync(
    join(SRC_DATA_DIR, "airlines.ts"),
    `// Auto-generated - DO NOT EDIT
import type { Airline } from "../types.js";
export { validIataAirlineCodes, validIcaoAirlineCodes } from "./airline-codes.js";
export const airlinesByIata: Record<string, Airline> = ${JSON.stringify(airlines.byIata)};
export const airlinesByIcao: Record<string, Airline> = ${JSON.stringify(airlines.byIcao)};
`
  );

  console.log("\nWrote:");
  console.log("  src/data/airport-codes.ts (validation only - small)");
  console.log("  src/data/airline-codes.ts (validation only - small)");
  console.log("  src/data/airports.ts (full data - large)");
  console.log("  src/data/airlines.ts (full data - large)");
  console.log("\nDone!");
}

main().catch((err) => {
  console.error("Build failed:", err);
  process.exit(1);
});
