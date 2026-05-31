---
name: TrainFlow db exports
description: Build order requirement for @workspace/db type declarations
---

`@workspace/db` is a composite TypeScript lib that must be built before artifact typechecks can import from it.

- Run `pnpm run typecheck:libs` (runs `tsc --build`) before `pnpm --filter @workspace/api-server run typecheck`
- If you skip this, you get "Module '@workspace/db' has no exported member 'profilesTable'" errors
- This is normal pnpm-workspace behavior for composite libs

**Why:** Composite libs emit `.d.ts` declarations; artifact typechecks consume those declarations. Without the build step, the declarations don't exist yet.

**How to apply:** Always run `typecheck:libs` first when debugging cross-package type errors.
