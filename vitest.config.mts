import { defineConfig } from "vitest/config";

export default defineConfig({
  root: import.meta.dirname,
  test: {
    clearMocks: true,
    coverage: {
      include: ["src/**/*.ts"],
      reportsDirectory: "coverage",
    },
    environment: "node",
    globals: true,
    include: ["test/**/*.test.ts"],
    name: "ts-japi",
    pool: "threads",
    setupFiles: ["./test/setup/per-test.ts"],
  },
});
