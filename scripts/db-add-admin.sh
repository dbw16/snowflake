#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 1 ]]; then
  echo "Usage: $0 <admin-user_id>"
  exit 1
fi

if [[ $1 == help || $1 == --help || $1 == -h ]]; then
  echo "Usage: $0 <admin-user_id>"
  exit 0
fi

echo "[db-add-admin] Adding admin user with ID '$1'"
sqlite3 "${DATABASE_PATH:-data/app.sqlite3}" <<SQL       
BEGIN;
INSERT OR IGNORE INTO users (username, email, createdAt, updatedAt)
  VALUES ('$1','',datetime('now'),datetime('now'));
INSERT OR IGNORE INTO user_roles (userId, role, createdAt)
  VALUES ('$1','admin',datetime('now'));
COMMIT;
SQL

echo "[db-add-admin] Done"