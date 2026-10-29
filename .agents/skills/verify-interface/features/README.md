# Feature map

One file per feature. `covers:` lists the source globs it owns, `docs:` the pages a verdict judges, `journeys:` the journeys it runs, and `seeded-breaks/<feature>.patch` the break its journeys must catch. `pnpm exec antelopejs-verify map` checks that every user-facing file is covered.

| Feature | What the user does | Journeys |
|---|---|---|
| [client](client.md) | A module author calls `GetClient()` and gets the client the Redis module provides. | every-function, minor-bump |
| [smoke](smoke.md) | The fixed journey every verdict runs: load the packed interface with a stub provider and call every function. | every-function |
