#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
echo "[db-migrate] Applying pending migrations..."
npm run drizzle:migrate --silent
echo "[db-migrate] Complete. Current status:"
npm run db:status --silent || true
