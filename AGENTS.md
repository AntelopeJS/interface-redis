# interface-redis

The AntelopeJS interface that hands modules the project's shared ioredis client, published as `@antelopejs/interface-redis`. The whole contract lives in `src/index.ts`: `GetClient()` for consumers, and the `@internal` `internal` namespace (`client`, `SetClient`, `UnsetClient`) that the implementing module, `@antelopejs/redis` (AntelopeJS/redis), uses to latch the client in `start()` and reset it with `UnsetClient()` in `stop()`. Renaming or changing any of these breaks that provider.

## Versioning

- Every 0.x `@antelopejs/*` range stops below the next minor (`>=0.5.1 <0.6.0`), and every 1.x range uses `~`. The `dependency:ranges` step of `pnpm run checks` rejects any other range.
- `@antelopejs/interface-core` is a peer dependency, and the devDependency uses the same range. When you raise it, raise both and the compatibility table in `README.md` together.
- The `README.md` compatibility tables carry `docs-compat` markers that point at `package.json#peerDependencies` and `#dependencies` (`ioredis`). The docs check fails when a table and `package.json` disagree.

## Tests

- `pnpm test` builds `dist`, then runs `ajs module test .`. `src/antelope.test.ts` (`antelopeJs.test` in `package.json`) describes the test project: it loads `@antelopejs/redis` (a devDependency on a `~` range) as a local module with `useMock: true`, so no Redis server is needed, and runs the compiled suites in `dist/tests`. The suites are written in `src/tests`. The `pnpm.overrides` entry in `package.json` links the `@antelopejs/interface-redis` dependency of `@antelopejs/redis` to this package, and core takes the copy the provider resolves as the one every module and suite gets. The suites import the code under test from `..`. Without the override, the provider would attach to the published copy it installs, and the suites would test that copy instead of `src`.
- `knip.config.ts` lists `src/tests/**/*.test.ts` and `src/antelope.test.ts` as entries, because only `ajs module test` loads them.
- `ajs module test` installs the modules with `corepack <packageManager>` (`corepack pnpm@10.6.5`) when corepack is on `PATH`, and with the `pnpm` on `PATH` otherwise. Node 25 and later do not bundle corepack, so there install pnpm 10.6.5 another way.
- `pnpm run checks` does not run the documentation check (Markdown links and the `docs-compat` tables in `README.md` and `docs/`). CI runs it through the `docs-files` input in `.github/workflows/ci.yml`. To run it locally, clone `AntelopeJS/tooling-configs` at `v0.0.9` (the ref ci-node pins), run `npm ci --prefix actions/docs --omit=dev`, then run `node <clone>/actions/docs/check.mjs --files "$(printf 'README.md\ndocs')"` from this repository.

## Shipped files

- `docs/` and `skills/` ship in the npm package. `docs/` holds the guide the package `homepage` (interfaces.antelopejs.com/docs/redis) points to. `skills/` reaches users through `antelopeJs.skills`; when the contract changes, update `skills/redis-interface/SKILL.md`.

<!-- antelopejs-guardrails:start -->
<!-- Managed by @antelopejs/tooling-configs. `antelopejs-sync` rewrites everything between these markers; write repository-specific guidance outside them. -->

## Guardrails

CI runs `pnpm run checks` in full on every pull request and reports what failed. The commit hook formats and lints the staged files. Locally, check only what you touched, one test file and not the suite, as the [`verify-changes`](.agents/skills/verify-changes/SKILL.md) skill says.

### Comments

Say it in code: a constraint in a type, a lint rule or a test, a public item's contract in TSDoc. Other comments are lint directives naming their rules, `@ts-expect-error <reason>`, `SAFETY: <reason>` above a type assertion, and license or tool directives. A reason states what the code does now.

### Tests

Each test names the wrong implementation it fails on, or is deleted. Drive behaviour through the public interface. An invariant over many files is a lint rule.

### Review

No tool checks these:

- A type guard checks the nested elements and values it claims.
- A no-upward import rule rejects same-tier peers; probe it with an import.
- A finding only an evasion or a patched internal can trigger goes under Attention and never blocks.

### Suppressions

`guardrails.suppressions.json` caps lint directives, `@ts-expect-error`, `SAFETY:` comments and rules a lint config turns off. Over a cap, fix the code or remove another suppression of that kind; only the operator raises a number. After removing suppressions, run `pnpm run suppressions:update` and commit the file.

<!-- antelopejs-guardrails:end -->
