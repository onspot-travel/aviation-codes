import { bench, describe } from "vitest";
import {
  getAirportByIata,
  getAirportByIcao,
  isValidIataAirport,
  isValidIcaoAirport,
  searchAirports,
  validateIataAirport,
} from "../src/airports.js";

describe("Airport validation benchmarks", () => {
  bench("isValidIataAirport - valid code", () => {
    isValidIataAirport("LAX");
  });

  bench("isValidIataAirport - invalid code", () => {
    isValidIataAirport("XXX");
  });

  bench("isValidIcaoAirport - valid code", () => {
    isValidIcaoAirport("KLAX");
  });

  bench("validateIataAirport - valid code", () => {
    validateIataAirport("JFK");
  });

  bench("getAirportByIata", () => {
    getAirportByIata("SFO");
  });

  bench("getAirportByIcao", () => {
    getAirportByIcao("EGLL");
  });

  bench("searchAirports - city name", () => {
    searchAirports("New York", { limit: 5 });
  });

  bench("searchAirports - partial match", () => {
    searchAirports("International", { limit: 10 });
  });
});
