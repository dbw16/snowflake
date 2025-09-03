import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { mkdirSync } from 'fs';
import { dirname } from 'path';
import { db } from './db';

// Support overriding (mainly for tests)
const DB_PATH = process.env.DATABASE_PATH || 'data/app.sqlite3';
const MIGRATIONS_DIR = process.env.DB_MIGRATIONS_DIR || './drizzle';

declare global {
  // eslint-disable-next-line no-var
  var __dbInitPromise: Promise<void> | undefined;
}

async function runMigrations() {
  // Ensure directory exists (idempotent)
  try {
    mkdirSync(dirname(DB_PATH), { recursive: true });
  } catch (e) {
    // ignore if already exists
  }

  // Run migrations (drizzle will create tables if missing based on migrations)
  await migrate(db, { migrationsFolder: MIGRATIONS_DIR });
}

/**
 * Ensure the database schema is up to date. Safe to call multiple times; it
 * will only run once per process thanks to the global promise cache.
 */
export async function ensureDatabase() {
  if (!global.__dbInitPromise) {
    global.__dbInitPromise = (async () => {
      const startedAt = Date.now();
      try {
        console.info('[db] Ensuring database (migrations folder: ' + MIGRATIONS_DIR + ')');
        await runMigrations();
        console.info('[db] Database ready in ' + (Date.now() - startedAt) + 'ms');
      } catch (err) {
        console.error('[db] Database initialization failed:', err);
        // In production you might want to rethrow to crash the process so orchestrator restarts
        throw err;
      }
    })();
  }
  return global.__dbInitPromise;
}

/**
 * Utility for scripts (e.g., `node scripts/ensure-db.mjs`) so they can just import and run.
 */
export async function ensureDatabaseAndExit() {
  try {
    await ensureDatabase();
    process.exit(0);
  } catch {
    process.exit(1);
  }
}
