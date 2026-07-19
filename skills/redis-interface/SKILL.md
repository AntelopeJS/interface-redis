---
name: redis-interface
description: Provides AntelopeJS modules a shared ioredis Redis client through a single async GetClient() entry point exported by @antelopejs/interface-redis. Use when module code imports @antelopejs/interface-redis or calls GetClient, or when a task needs Redis from an AntelopeJS module - key-value storage, caching with TTL/expiration, pub/sub messaging, hashes, lists, sets, sorted sets, or MULTI transactions.
category: antelopejs-interface
tags: [redis, ioredis, cache, pubsub, antelopejs]
---

# Redis interface

This interface hands consumers the raw [ioredis](https://github.com/redis/ioredis) client of the providing module - it does not wrap individual Redis commands in proxy points. The whole contract is one function, `GetClient()`, backed by a promise latch: the provider resolves it with a connected client in its `start()` lifecycle and re-latches it in `stop()`. Everything after `await GetClient()` is plain ioredis.

## Import

```ts
import { GetClient } from "@antelopejs/interface-redis";
```

That root subpath is the only consumer-facing entry point. `GetClient(): Promise<Redis>` (the `Redis` type comes from ioredis).

## Consuming

Add `@antelopejs/interface-redis` to the module's `dependencies`, and make sure a provider module (e.g. `@antelopejs/redis`, which declares this interface under `antelopeJs.implements`) is loaded in the project's `antelope.config`.

```ts
import { GetClient } from "@antelopejs/interface-redis";

export async function cacheResponse(key: string, data: string, ttlSeconds: number) {
  const client = await GetClient();
  await client.set(key, data, "EX", ttlSeconds);
}

export async function getCached(key: string): Promise<string | null> {
  const client = await GetClient();
  return client.get(key);
}
```

## Providing

Providers do not use `ImplementInterface` for this interface - there are no `InterfaceFunction` proxy points. Instead, a provider module resolves/resets the internal client latch from its lifecycle hooks:

```ts
import { internal } from "@antelopejs/interface-redis";
import Redis from "ioredis";

let client: Redis;

export async function start() {
  client = new Redis(/* connection options */);
  internal.SetClient(client); // resolves every pending/future GetClient()
}

export async function stop() {
  await client.quit();
  // Re-latch: next GetClient() waits for the next start(). UnsetClient() returns
  // the new pending internal.client; `void` discards it on purpose (same pattern
  // as the package's own initialization).
  void internal.UnsetClient();
}
```

Declare `"antelopeJs": { "implements": ["@antelopejs/interface-redis"] }` in the provider's `package.json`.

## Gotchas

- **Always `await GetClient()` fresh; never cache the client across calls.** `UnsetClient()` swaps in a new pending promise on provider stop/hot-reload, so a stashed client can be a dead connection while `GetClient()` already points at the next one.
- **`GetClient()` never rejects - it waits.** With no provider started it stays pending, so treat the interface as a required dependency (a provider must be wired in the project config) rather than probing it with try/catch.
- **Pub/sub needs a duplicated connection.** A subscribed ioredis connection cannot issue other commands; create subscribers with `client.duplicate()` and `subscribe`/`psubscribe` on that copy (quit the duplicate yourself when done).
- **Do not `quit()`/`disconnect()` the shared client.** The provider owns its lifecycle; consumers only issue commands.
- **No command typing lives in this package.** The full command surface and its types are ioredis's own - consult ioredis docs for command signatures.

## Deeper reference

See `dist/index.d.ts` in this package for the exact typed surface, and the repository's `docs/1.introduction.md` (https://github.com/AntelopeJS/interface-redis - not shipped in the npm package) for usage guides: Overview, Getting Started, GetClient, Key-Value Operations, Pub/Sub Messaging, Additional Operations - do not duplicate them here.
