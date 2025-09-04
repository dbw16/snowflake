#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
echo "[db-generate] Generating migration from schema changes..."
npm run drizzle:generate --silent
echo "[db-generate] Done. Review new file(s) in drizzle/ then run npm run db:migrate"
