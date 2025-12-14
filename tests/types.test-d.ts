import { describe, expectTypeOf, it } from "vitest";
import { airline, airport } from "../src/index.js";
import type { Airline, Airport, ParseResult } from "../src/types.js";

describe("airport types", () => {
  it("is() returns boolean", () => {
    expectTypeOf(airport.is("LAX")).toEqualTypeOf<boolean>();
    expectTypeOf(airport.iata.is("LAX")).toEqualTypeOf<boolean>();
    expectTypeOf(airport.icao.is("KLAX")).toEqualTypeOf<boolean>();
  });

  it("isFormat() returns boolean", () => {
    expectTypeOf(airport.iata.isFormat("LAX")).toEqualTypeOf<boolean>();
    expectTypeOf(airport.icao.isFormat("KLAX")).toEqualTypeOf<boolean>();
  });

  it("get() returns Airport | undefined", () => {
    expectTypeOf(airport.get("LAX")).toEqualTypeOf<Airport | undefined>();
    expectTypeOf(airport.iata.get("LAX")).toEqualTypeOf<Airport | undefined>();
    expectTypeOf(airport.icao.get("KLAX")).toEqualTypeOf<Airport | undefined>();
  });

  it("parse() returns ParseResult<Airport>", () => {
    const result = airport.parse("LAX");
    expectTypeOf(result).toEqualTypeOf<ParseResult<Airport>>();

    if (result.ok) {
      expectTypeOf(result.data).toEqualTypeOf<Airport>();
    }
  });

  it("search() returns Airport[]", () => {
    expectTypeOf(airport.search("los angeles")).toEqualTypeOf<Airport[]>();
    expectTypeOf(airport.search("LA", { limit: 5 })).toEqualTypeOf<Airport[]>();
  });

  it("codes() returns string[]", () => {
    expectTypeOf(airport.iata.codes()).toEqualTypeOf<string[]>();
    expectTypeOf(airport.icao.codes()).toEqualTypeOf<string[]>();
  });

  it("count() returns number", () => {
    expectTypeOf(airport.iata.count()).toEqualTypeOf<number>();
    expectTypeOf(airport.icao.count()).toEqualTypeOf<number>();
  });
});

describe("airline types", () => {
  it("is() returns boolean", () => {
    expectTypeOf(airline.is("AA")).toEqualTypeOf<boolean>();
    expectTypeOf(airline.iata.is("AA")).toEqualTypeOf<boolean>();
    expectTypeOf(airline.icao.is("AAL")).toEqualTypeOf<boolean>();
  });

  it("isFormat() returns boolean", () => {
    expectTypeOf(airline.iata.isFormat("AA")).toEqualTypeOf<boolean>();
    expectTypeOf(airline.icao.isFormat("AAL")).toEqualTypeOf<boolean>();
  });

  it("get() returns Airline | undefined", () => {
    expectTypeOf(airline.get("AA")).toEqualTypeOf<Airline | undefined>();
    expectTypeOf(airline.iata.get("AA")).toEqualTypeOf<Airline | undefined>();
    expectTypeOf(airline.icao.get("AAL")).toEqualTypeOf<Airline | undefined>();
  });

  it("parse() returns ParseResult<Airline>", () => {
    const result = airline.parse("AA");
    expectTypeOf(result).toEqualTypeOf<ParseResult<Airline>>();

    if (result.ok) {
      expectTypeOf(result.data).toEqualTypeOf<Airline>();
    }
  });

  it("search() returns Airline[]", () => {
    expectTypeOf(airline.search("american")).toEqualTypeOf<Airline[]>();
    expectTypeOf(airline.search("united", { limit: 5 })).toEqualTypeOf<Airline[]>();
    expectTypeOf(airline.search("delta", { activeOnly: true })).toEqualTypeOf<Airline[]>();
  });

  it("codes() returns string[]", () => {
    expectTypeOf(airline.iata.codes()).toEqualTypeOf<string[]>();
    expectTypeOf(airline.icao.codes()).toEqualTypeOf<string[]>();
  });

  it("count() returns number", () => {
    expectTypeOf(airline.iata.count()).toEqualTypeOf<number>();
    expectTypeOf(airline.icao.count()).toEqualTypeOf<number>();
  });
});

describe("Airport type structure", () => {
  it("has correct properties", () => {
    expectTypeOf<Airport>().toHaveProperty("iata").toBeString();
    expectTypeOf<Airport>().toHaveProperty("icao").toBeString();
    expectTypeOf<Airport>().toHaveProperty("name").toBeString();
    expectTypeOf<Airport>().toHaveProperty("city").toBeString();
    expectTypeOf<Airport>().toHaveProperty("country").toBeString();
    expectTypeOf<Airport>().toHaveProperty("latitude").toBeNumber();
    expectTypeOf<Airport>().toHaveProperty("longitude").toBeNumber();
    expectTypeOf<Airport>().toHaveProperty("elevation").toBeNumber();
    expectTypeOf<Airport>().toHaveProperty("timezone").toBeString();
  });
});

describe("Airline type structure", () => {
  it("has correct properties", () => {
    expectTypeOf<Airline>().toHaveProperty("iata").toBeString();
    expectTypeOf<Airline>().toHaveProperty("icao").toBeString();
    expectTypeOf<Airline>().toHaveProperty("name").toBeString();
    expectTypeOf<Airline>().toHaveProperty("callsign").toBeString();
    expectTypeOf<Airline>().toHaveProperty("country").toBeString();
    expectTypeOf<Airline>().toHaveProperty("active").toBeBoolean();
  });
});

describe("ParseResult discriminated union", () => {
  it("narrows correctly on ok: true", () => {
    const result: ParseResult<Airport> = {} as ParseResult<Airport>;

    if (result.ok) {
      expectTypeOf(result).toEqualTypeOf<{ ok: true; data: Airport }>();
      expectTypeOf(result.data).toEqualTypeOf<Airport>();
    } else {
      expectTypeOf(result).toEqualTypeOf<{ ok: false }>();
    }
  });
});
