import { defineConfig } from "@antelopejs/interface-core/config";

export default defineConfig({
  name: "interface-redis-test",
  cacheFolder: ".antelope/cache",
  modules: {
    redis: {
      source: { type: "local", path: "node_modules/@antelopejs/redis" },
      config: { useMock: true },
    },
  },
  test: {
    folder: "dist/tests",
  },
});
