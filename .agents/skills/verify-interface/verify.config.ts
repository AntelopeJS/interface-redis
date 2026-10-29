import type { VerifyConfig } from "@antelopejs/tooling-configs/verify";

import type * as RedisInterface from "../../../src/index.ts";

/** What the stub provider hands to `internal.SetClient`: the one command the consumer journey sends. */
const stubClient = { ping: async () => "PONG" };

const config: VerifyConfig<typeof RedisInterface> = {
  doors: {
    data: null,
    format: null,
    contract: {
      globs: ["src/index.ts", "package.json"],
      funnels: [],
      containments: [],
      why: "GetClient and the exports map are what every Redis consumer imports",
    },
    outbound: null,
    exposure: null,
    publish: {
      globs: ["package.json", ".release-it.json", "changelogen.config.json", ".github/workflows/release.yml"],
      funnels: [],
      containments: [],
      why: "the package name and release workflow claim @antelopejs/interface-redis on npm",
    },
  },
  interface: {
    provide(api) {
      // SAFETY: the consumer journey sends only ping, the one command the stub client implements.
      api.internal.SetClient(stubClient as never);
    },
    calls: {
      ".:GetClient": { call: async (api) => (await api.GetClient()).ping(), expect: "PONG" },
    },
    providerSide: {
      ".:internal.SetClient": "the redis module calls it once its ioredis client is ready; consumers only call GetClient",
      ".:internal.UnsetClient": "the redis module calls it when it stops; consumers never do",
    },
  },
};

export default config;
