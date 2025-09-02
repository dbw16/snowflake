import { db } from './db';
import { reportAccess } from './schema';
import { and, eq } from 'drizzle-orm';

export async function grantAccess({ reportKey, userId }: { reportKey: string; userId: string }) {
  const now = new Date().toISOString();
  await db.insert(reportAccess).values({
    reportKey,
    userId,
    grantedAt: now,
  });
  return { reportKey, userId };
}

export async function revokeAccess({ reportKey, userId }: { reportKey: string; userId: string }) {
  await db.delete(reportAccess).where(and(eq(reportAccess.reportKey, reportKey), eq(reportAccess.userId, userId)));
  return { reportKey, userId };
}
