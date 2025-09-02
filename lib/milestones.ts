import { and, eq } from 'drizzle-orm';
import { db, reportMilestonesTable } from './db';
import { getOrCreateUser } from './access';

export interface MilestoneMap { [trackId: string]: number }

export async function getMilestones(reportKey: string): Promise<MilestoneMap> {
  if (!reportKey) return {};
  const rows = await db.select({ trackId: reportMilestonesTable.trackId, milestone: reportMilestonesTable.milestone })
    .from(reportMilestonesTable)
    .where(eq(reportMilestonesTable.reportKey, reportKey));
  const out: MilestoneMap = {};
  for (const row of rows) out[row.trackId] = row.milestone;
  return out;
}

export async function setMilestones(params: { reportKey: string; milestoneByTrack: MilestoneMap; updatedBy?: string }): Promise<MilestoneMap> {
  const { reportKey } = params;
  if (!reportKey) return {};
  const now = new Date().toISOString();
  const updatedBy = await getOrCreateUser(params.updatedBy || 'system');
  // Upsert each track
  for (const [trackId, milestone] of Object.entries(params.milestoneByTrack || {})) {
    const value = Number(milestone);
    if (!trackId || Number.isNaN(value)) continue;
    await db.insert(reportMilestonesTable)
      .values({ reportKey, trackId, milestone: value, updatedAt: now, updatedBy })
      .onConflictDoUpdate({
        target: [reportMilestonesTable.reportKey, reportMilestonesTable.trackId],
        set: { milestone: value, updatedAt: now, updatedBy },
      });
  }
  return getMilestones(reportKey);
}

export async function updateMilestone(params: { reportKey: string; trackId: string; milestone: number; updatedBy?: string }): Promise<MilestoneMap> {
  const { reportKey, trackId, milestone } = params;
  if (!reportKey || !trackId || Number.isNaN(Number(milestone))) return {};
  return setMilestones({ reportKey, milestoneByTrack: { [trackId]: Number(milestone) }, updatedBy: params.updatedBy });
}
