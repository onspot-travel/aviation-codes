import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    validate: "src/validate.ts",
    airports: "src/airports.ts",
    airlines: "src/airlines.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  splitting: true,
  treeshake: true,
  minify: false,
  sourcemap: true,
});
