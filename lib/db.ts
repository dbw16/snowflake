import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { mkdirSync } from 'fs';
import { dirname } from 'path';
import { users, userRoles, archived as archivedTable, comments as commentsTable, reportAccess as reportAccessTable, reportMilestones as reportMilestonesTable } from './schema';

// Use environment variable for database path, with secure default
const DB_PATH = process.env.DATABASE_PATH || 'data/app.sqlite3';

// Ensure database directory exists
try {
  mkdirSync(dirname(DB_PATH), { recursive: true });
} catch (error) {
  // Directory might already exist, which is fine
  if ((error as NodeJS.ErrnoException).code !== 'EEXIST') {
    console.error('Failed to create database directory:', error);
    throw error;
  }
}

const sqlite = new Database(DB_PATH);
export const db = drizzle(sqlite, { schema: { users, userRoles, archived: archivedTable, comments: commentsTable, reportAccess: reportAccessTable, reportMilestones: reportMilestonesTable } });
export { users, userRoles, archivedTable, commentsTable, reportAccessTable, reportMilestonesTable };
