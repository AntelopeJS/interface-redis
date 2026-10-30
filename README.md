# @antelopejs/interface-redis

<div align="center">
<a href="https://www.npmjs.com/package/@antelopejs/interface-redis"><img alt="npm" src="https://img.shields.io/npm/v/@antelopejs/interface-redis?style=for-the-badge&labelColor=000000&color=000000"></a>
<a href="./LICENSE"><img alt="License" src="https://img.shields.io/npm/l/@antelopejs/interface-redis?style=for-the-badge&labelColor=000000&color=000000"></a>
<a href="https://discord.gg/sjK28QHrA7"><img alt="Discord" src="https://img.shields.io/badge/Discord-18181B?logo=discord&style=for-the-badge&color=000000"></a>
<a href="https://interfaces.antelopejs.com/docs/redis"><img alt="Docs" src="https://img.shields.io/badge/Docs-18181B?style=for-the-badge&color=000000"></a>
</div>

Direct access to the Redis client of an AntelopeJS project: one shared connection for caching, counters, pub/sub and any other Redis command.

## What it offers

- `GetClient()` resolves to the project's shared [ioredis](https://github.com/redis/ioredis) client once the connection is up.
- The client exposes every Redis command, transactions and pipelines.
- Every module reuses the one connection that the implementing module opens and configures.

## Implementations

| Module                                                     | Notes                                                   |
| ---------------------------------------------------------- | ------------------------------------------------------- |
| [`@antelopejs/redis`](https://github.com/AntelopeJS/redis) | Also implements `@antelopejs/interface-redis-scheduler` |

## Install

Add the interface to the module that talks to Redis:

```bash
pnpm add @antelopejs/interface-redis
```

Then add the implementation to the project:

```bash
ajs project modules add @antelopejs/redis
```

## Quick start

```ts
import { GetClient } from "@antelopejs/interface-redis";

const CACHE_TTL_SECONDS = 60;

export async function cachePage(path: string, html: string) {
  const client = await GetClient();
  await client.set(`page:${path}`, html, "EX", CACHE_TTL_SECONDS);
}

export async function readCachedPage(path: string) {
  const client = await GetClient();
  return await client.get(`page:${path}`);
}
```

## Documentation

- [Introduction and client reference](./docs/1.introduction.md)

## Compatibility

Requires AntelopeJS core `1.x` and the following peer dependency:

<!-- antelopejs-docs-compat:start -->

| Package                      | Supported        | Tested with |
| ---------------------------- | ---------------- | ----------- |
| `@antelopejs/interface-core` | `>=0.2.4 <1.0.0` | `0.2.4`     |

<!-- antelopejs-docs-compat:end -->

Driver dependency:

## Contributing

Read [CONTRIBUTING.md](./CONTRIBUTING.md) before you open a pull request. The local checks are:

```bash
pnpm install
pnpm run checks
```

## License

[Apache-2.0](./LICENSE)
