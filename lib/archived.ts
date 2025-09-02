import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { archived as archivedTable } from './schema';
import { and, eq } from 'drizzle-orm';
import { getOrCreateUser } from './access';

// Simple database connection
const sqlite = new Database('data/app.sqlite3');
const db = drizzle(sqlite, { schema: { archived: archivedTable } });

export interface ArchivedLevelsMap {
  [trackId: string]: { [milestone: string]: boolean } | boolean; // boolean for backward-compat
}

// JSON storage removed; SQLite only

export async function getArchivedByReportKey(reportKey: string): Promise<ArchivedLevelsMap> {

  const rows = await db
    .select({ trackId: archivedTable.trackId, milestone: archivedTable.milestone, value: archivedTable.value })
    .from(archivedTable)
    .where(eq(archivedTable.reportKey, reportKey));
  const out: ArchivedLevelsMap = {};
  for (const row of rows) {
    const current = out[row.trackId];
    const milestone = String(row.milestone);
    const boolValue = row.value ? true : false;
    if (!current) {
      out[row.trackId] = { [milestone]: boolValue };
    } else if (typeof current === 'boolean') {
      out[row.trackId] = { [milestone]: boolValue };
    } else {
      current[milestone] = boolValue;
      out[row.trackId] = current;
    }
  }
  return out;
}

export async function setArchivedByReportKey(params: {
  reportKey: string;
  archivedByTrack: ArchivedLevelsMap;
  archivedBy?: string; // username who is archiving
}): Promise<ArchivedLevelsMap> {

  const now = new Date().toISOString();
  const archivedByUsername = await getOrCreateUser(params.archivedBy || 'system');
  
  await db.delete(archivedTable).where(eq(archivedTable.reportKey, params.reportKey));
  const rows: { 
    reportKey: string; 
    trackId: string; 
    milestone: string; 
    value: number;
    archivedAt: string;
    archivedBy: string;
  }[] = [];
  
  for (const [trackId, entry] of Object.entries(params.archivedByTrack || {})) {
    if (typeof entry === 'boolean') {
      rows.push({ 
        reportKey: params.reportKey, 
        trackId, 
        milestone: 'all', 
        value: entry ? 1 : 0,
        archivedAt: now,
  archivedBy: archivedByUsername
      });
    } else {
      for (const [milestone, value] of Object.entries(entry || {})) {
        rows.push({ 
          reportKey: params.reportKey, 
          trackId, 
          milestone: String(milestone), 
          value: value ? 1 : 0,
          archivedAt: now,
          archivedBy: archivedByUsername
        });
      }
    }
  }
  if (rows.length) await db.insert(archivedTable).values(rows);
  return getArchivedByReportKey(params.reportKey);
}

export async function updateArchivedTrack(params: {
  reportKey: string;
  trackId: string;
  milestone: number | string;
  value?: boolean; // if omitted, toggle
  archivedBy?: string; // username who is archiving
}): Promise<ArchivedLevelsMap> {

  const now = new Date().toISOString();
  const archivedByUsername = await getOrCreateUser(params.archivedBy || 'system');
  const mKey = String(params.milestone);
  
  const current = await getArchivedByReportKey(params.reportKey);
  const trackEntry = current[params.trackId];
  const existing = (typeof trackEntry === 'object' && Boolean(trackEntry[mKey])) || false;
  const nextValue = typeof params.value === 'boolean' ? params.value : !existing;
  
  await db
    .insert(archivedTable)
    .values({ 
      reportKey: params.reportKey, 
      trackId: params.trackId, 
      milestone: mKey, 
      value: nextValue ? 1 : 0,
      archivedAt: now,
  archivedBy: archivedByUsername
    })
    .onConflictDoUpdate({
      target: [archivedTable.reportKey, archivedTable.trackId, archivedTable.milestone],
      set: { 
        value: nextValue ? 1 : 0,
        archivedAt: now,
  archivedBy: archivedByUsername
      },
    });
  return getArchivedByReportKey(params.reportKey);
}


