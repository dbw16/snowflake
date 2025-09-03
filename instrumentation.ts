// Runs once when the Next.js server (or edge runtime context) starts.
// We use it to optionally run database migrations so tables exist.
import { ensureDatabase } from './lib/db-init';

export async function register() {
  const auto = shouldAutoMigrate();
  if (!auto) return;
  // Run migrations but don't block startup for too long; if it fails we rethrow.
  await ensureDatabase();
}

function shouldAutoMigrate(): boolean {
  // Explicit opt-out
  if (process.env.DB_AUTO_MIGRATE === 'false') return false;
  // Explicit opt-in
  if (process.env.DB_AUTO_MIGRATE === 'true') return true;
  // Default: enabled in development, disabled in production unless explicitly enabled
  return process.env.NODE_ENV !== 'production';
}
