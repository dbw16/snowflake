import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { comments as commentsTable, users } from './schema';
import { and, eq, isNull, asc } from 'drizzle-orm';
import { getOrCreateUser } from './access';

// Simple database connection
const sqlite = new Database('data/app.sqlite3');
const db = drizzle(sqlite, { schema: { comments: commentsTable, users } });

export interface CommentRecord {
  id: string;
  trackId: string;
  milestone: number;
  // When present, indicates the zero-based index of the signal within the milestone this comment pertains to
  signalIndex?: number | null;
  authorId: string;
  authorName: string; // For backward compatibility - populated from users table
  text: string;
  createdAt: string; // ISO string
  reportKey: string;
  parentId?: string | null;
}

// JSON storage removed; SQLite only

export async function getComments(params: {
  trackId: string;
  milestone: number;
  reportKey: string;
  signalIndex?: number | null;
}): Promise<CommentRecord[]> {

  const hasSignal = (params.signalIndex ?? null) !== null;
  const whereClause = hasSignal
    ? and(
        eq(commentsTable.trackId, params.trackId),
        eq(commentsTable.milestone, Number(params.milestone)),
        eq(commentsTable.reportKey, params.reportKey),
        eq(commentsTable.signalIndex, Number(params.signalIndex))
      )
    : and(
        eq(commentsTable.trackId, params.trackId),
        eq(commentsTable.milestone, Number(params.milestone)),
        eq(commentsTable.reportKey, params.reportKey),
        isNull(commentsTable.signalIndex)
      );
  
  const rows = await db
    .select({
      id: commentsTable.id,
      trackId: commentsTable.trackId,
      milestone: commentsTable.milestone,
      signalIndex: commentsTable.signalIndex,
      authorId: commentsTable.authorId,
      authorName: users.username,
      text: commentsTable.text,
      createdAt: commentsTable.createdAt,
      reportKey: commentsTable.reportKey,
      parentId: commentsTable.parentId,
    })
    .from(commentsTable)
  .innerJoin(users, eq(commentsTable.authorId, users.username))
    .where(whereClause)
    .orderBy(asc(commentsTable.createdAt));
  
  return rows.map((r) => ({
    ...r,
    milestone: Number(r.milestone),
    signalIndex: r.signalIndex === null || r.signalIndex === undefined ? null : Number(r.signalIndex),
    parentId: r.parentId === null || r.parentId === undefined ? null : r.parentId,
  }));
}

export async function addComment(input: {
  trackId: string;
  milestone: number;
  signalIndex?: number | null;
  authorName: string;
  text: string;
  reportKey: string;
  parentId?: string | null;
}): Promise<CommentRecord> {
  const now = new Date().toISOString();
  const id = `${input.trackId}-${input.milestone}-${input.signalIndex ?? 'all'}-${now}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
  
  if (!input.text?.trim()) throw new Error('Comment text is required');
  if (!input.reportKey?.trim()) throw new Error('reportKey is required');

  // Get or create the user
  const authorId = await getOrCreateUser(input.authorName?.trim() || 'Anonymous');
  
  const record: CommentRecord = {
    id,
    trackId: input.trackId,
    milestone: Number(input.milestone),
    signalIndex: input.signalIndex ?? null,
    authorId,
    authorName: input.authorName?.trim() || 'Anonymous',
    text: input.text.trim(),
    createdAt: now,
    reportKey: input.reportKey.trim(),
    parentId: input.parentId ?? null,
  };


  await db.insert(commentsTable).values({
    id: record.id,
    trackId: record.trackId,
    milestone: record.milestone,
    signalIndex: record.signalIndex === null ? null : Number(record.signalIndex),
    authorId: record.authorId,
    text: record.text,
    createdAt: record.createdAt,
    reportKey: record.reportKey,
    parentId: record.parentId === null ? null : record.parentId,
  });
  return record;
}


