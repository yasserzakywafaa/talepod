import { defineConfig } from "vitest/config";

// Vitest suites live in __tests__ folders; other *.test.ts files are standalone scripts run with ts-node or node:test.
export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/__tests__/**/*.test.ts"],
  },
});
