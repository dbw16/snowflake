#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

DB_FILE="${DATABASE_PATH:-data/app.sqlite3}"

if [[ -f "$DB_FILE" ]]; then
  echo "[db-reset] Removing $DB_FILE"
  rm -f "$DB_FILE"
else
  echo "[db-reset] No existing DB file ($DB_FILE)"
fi

echo "[db-reset] Re-applying migrations"
npm run db:migrate
echo "[db-reset] Done"
