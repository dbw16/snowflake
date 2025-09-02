import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { users, userRoles, archived as archivedTable, comments as commentsTable, reportAccess as reportAccessTable, reportMilestones as reportMilestonesTable } from './schema';

const sqlite = new Database('data/app.sqlite3');
export const db = drizzle(sqlite, { schema: { users, userRoles, archived: archivedTable, comments: commentsTable, reportAccess: reportAccessTable, reportMilestones: reportMilestonesTable } });
export { users, userRoles, archivedTable, commentsTable, reportAccessTable, reportMilestonesTable };
