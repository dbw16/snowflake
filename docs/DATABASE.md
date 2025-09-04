# Database & Migrations

This document explains how the SQLite database is created and how to manage schema changes using **Drizzle ORM / drizzle-kit**.

## Stack

- SQLite (file-based) – default path: `data/app.sqlite3`
- Drizzle ORM (runtime) – defined in `lib/db.ts` & `lib/schema.ts`
- drizzle-kit (migrations) – configured in `drizzle.config.ts`

There is also an alternate config for end-to-end tests: `drizzle.e2e.config.ts` (database at `e2e/test.sqlite3`).

## Key Files

| File | Purpose |
| ---- | ------- |
| `lib/schema.ts` | Source of truth for the schema (tables, indexes, constraints) |
| `drizzle.config.ts` | drizzle-kit config (dev/prod) pointing at `file:data/app.sqlite3` |
| `drizzle.e2e.config.ts` | drizzle-kit config for Playwright/Vitest E2E (`file:e2e/test.sqlite3`) |
| `drizzle/` | Generated SQL migrations + meta journal |
| `lib/db.ts` | Initializes a Better-SQLite3 connection (respects `DATABASE_PATH` env override) |

## Lifecycle Overview

1. Edit / add tables / columns in `lib/schema.ts`.
2. Generate a migration SQL file: `npm run db:generate`.
3. Apply migrations (dev/prod): `npm run db:migrate`.
4. Commit BOTH the updated `schema.ts` AND the new file(s) in `drizzle/`.

For a brand new environment you can also use `npm run drizzle:push` (applies the current schema snapshot directly). Prefer migrations (`generate` + `migrate`) for long‑lived environments so history is preserved.

## Commands (NPM Scripts)

| Script | Action |
| ------ | ------ |
| `npm run db:generate` | Generates a new numbered migration from schema diff |
| `npm run db:migrate` | Applies unapplied migrations (uses `drizzle/meta/_journal.json`) |
| `npm run db:status` | Shows applied vs. available migrations |
| `npm run db:reset` | DANGEROUS: Deletes the SQLite file then re-applies all migrations |
| `npm run drizzle:push` | Pushes current schema (no incremental file if schema diverged) |
| `npm run drizzle:push:e2e` | Push for the E2E DB (test database) |

Helper shell scripts live in `scripts/` and wrap these operations.

## Typical Workflow

### Add a Column Example

1. Edit `lib/schema.ts` – e.g. add `displayName` to `users`:
   ```ts
   export const users = sqliteTable('users', {
     username: text('username').primaryKey(),
     email: text('email'),
     displayName: text('display_name'), // NEW
     createdAt: text('createdAt').notNull(),
     updatedAt: text('updatedAt').notNull(),
   });
   ```
2. Generate migration:
   ```bash
   npm run db:generate
   ```
3. Review the new `drizzle/00xx_*.sql` file & adjust if needed.
4. Apply:
   ```bash
   npm run db:migrate
   ```
5. Run the app / tests. Commit changes.

### Fresh Setup (Dev)

```bash
npm install
npm run db:migrate   # or npm run drizzle:push on a clean repo
npm run dev
```

### Reset Local DB (Destructive)

```bash
npm run db:reset
```

### E2E Test Database

E2E tests use an isolated file at `e2e/test.sqlite3`.

```bash
npm run drizzle:push:e2e  # (or add a parallel migrate flow if you introduce migrations there)
```

## Environment Variables

Runtime code (`lib/db.ts`) reads `DATABASE_PATH` (defaults to `data/app.sqlite3`). drizzle-kit config uses a `file:` URL; both ultimately point to the same file if you keep defaults.

| Variable | Purpose | Default |
| -------- | ------- | ------- |
| `DATABASE_PATH` | Runtime DB file path | `data/app.sqlite3` |

To point the app at a different DB (e.g., a copy):
```bash
DATABASE_PATH=/tmp/alt.sqlite3 npm run dev
```

## Choosing push vs. migrations

| Use Case | Recommended |
| -------- | ----------- |
| First local bootstrap | `drizzle:push` or `db:migrate` (equivalent if no migrations yet) |
| Production schema change | `db:generate` + `db:migrate` |
| Recreating damaged local DB | `db:reset` |
| Experiments / throwaway | `drizzle:push` |

`push` applies the current schema snapshot directly – it will create or alter tables but does not emit a migration record documenting the change sequence. `generate` produces an immutable SQL file you review & commit; `migrate` replays those files in order and records them in `_journal.json`.

## Inspecting Migration State

```bash
npm run db:status
```
Outputs applied migrations and those still pending.

## Backups (Recommended for Prod)

- Periodic copy of the SQLite file (hot copy is usually fine for mostly read workloads; for safety, briefly stop writes when snapshotting).
- Consider future migration to Postgres (Drizzle supports it) when concurrency or size grows.

## Troubleshooting

| Symptom | Cause | Fix |
| ------- | ----- | --- |
| Migration not detected | Forgot to edit `schema.ts` before `generate` | Change schema then re-run generate |
| Column missing after migrate | Look at SQL file – was the ALTER emitted? | Manually adjust SQL & re-run migrate (or create a follow-up migration) |
| Locking / busy errors | Concurrent writes / long transactions | Keep operations short; retry logic if adding heavy writes |
