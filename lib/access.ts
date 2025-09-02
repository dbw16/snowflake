import { and, eq } from 'drizzle-orm';
import { db, users, userRoles, archivedTable, commentsTable, reportAccessTable } from './db';

function normalize(value: string): string {
  return (value || '').trim().toLowerCase();
}

// User management functions
export async function createUser(username: string, email?: string): Promise<string> {
  const now = new Date().toISOString();
  await db.insert(users).values({
    username: username.trim(),
    email: email?.trim() || null,
    createdAt: now,
    updatedAt: now,
  });
  return username.trim();
}

export async function getUserByUsername(username: string): Promise<{ username: string; email?: string } | null> {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.username, username.trim()))
    .limit(1);
  
  if (!result[0]) return null;
  
  return {
    username: result[0].username,
    email: result[0].email || undefined,
  };
}

export async function getOrCreateUser(username: string, email?: string): Promise<string> {
  const existing = await getUserByUsername(username);
  if (existing) return existing.username;
  return await createUser(username, email);
}

// Admin functions
export async function isAdmin(username: string): Promise<boolean> {
  const user = await getUserByUsername(username);
  if (!user) return false;
  const result = await db
    .select()
    .from(userRoles)
    .where(and(eq(userRoles.userId, user.username), eq(userRoles.role, 'admin')))
    .limit(1);
  
  return result.length > 0;
}

export async function listAdmins(): Promise<string[]> {

  const result = await db
    .select({ username: users.username })
    .from(users)
    .innerJoin(userRoles, eq(users.username, userRoles.userId))
    .where(eq(userRoles.role, 'admin'));
  
  return result.map((r: { username: string }) => r.username);
}

export async function addAdmin(username: string): Promise<void> {
  const user = await getOrCreateUser(username); // returns username

  const now = new Date().toISOString();
  
  // Check if already admin
  const existing = await db
    .select()
    .from(userRoles)
    .where(and(eq(userRoles.userId, user), eq(userRoles.role, 'admin')))
    .limit(1);
  
  if (existing.length === 0) {
  await db.insert(userRoles).values({ userId: user, role: 'admin', createdAt: now });
  }
}

export async function revokeAdmin(username: string): Promise<void> {
  const user = await getUserByUsername(username);
  if (!user) return;
  await db.delete(userRoles).where(and(eq(userRoles.userId, user.username), eq(userRoles.role, 'admin')));
}

// Report management simplified: each user's username IS its reportKey.
// All users can access their own report; admins can access all.

function normalizeKey(key: string) { return key.trim(); }

async function listAllReportKeys(): Promise<string[]> {
  // Derive from existing usernames plus any orphaned historical keys in archived/comments
  const keys = new Set<string>();
  const userRows = await db.select({ username: users.username }).from(users);
  userRows.forEach((r: { username: string }) => keys.add(r.username));
  const archivedKeys = await db.select({ key: archivedTable.reportKey }).from(archivedTable);
  archivedKeys.forEach((r: { key: string }) => keys.add(r.key));
  const commentKeys = await db.select({ key: commentsTable.reportKey }).from(commentsTable);
  commentKeys.forEach((r: { key: string }) => keys.add(r.key));
  return Array.from(keys.values()).sort();
}

export async function getAllReportKeys(): Promise<string[]> { return listAllReportKeys(); }

// grant/revoke removed under implicit ownership model

export async function getAllUsernames(): Promise<string[]> {

  const result = await db
    .select({ username: users.username })
    .from(users)
    .orderBy(users.username);
  
  return result.map((r: { username: string }) => r.username);
}

export async function grantReportAccess(reportKey: string, username: string): Promise<void> {
  const key = normalize(reportKey);
  const user = await getUserByUsername(username);
  if (!key || !user) return;
  const now = new Date().toISOString();
  // Upsert-like: attempt insert; rely on PK ignore semantics (SQLite) not provided directly; simple check
  const existing = await db
    .select({ reportKey: reportAccessTable.reportKey })
    .from(reportAccessTable)
    .where(and(eq(reportAccessTable.reportKey, key), eq(reportAccessTable.userId, user.username)))
    .limit(1);
  if (existing.length === 0) {
    await db.insert(reportAccessTable).values({ reportKey: key, userId: user.username, grantedAt: now });
  }
}

export async function revokeReportAccess(reportKey: string, username: string): Promise<void> {
  const key = normalize(reportKey);
  const user = await getUserByUsername(username);
  if (!key || !user) return;
  await db.delete(reportAccessTable).where(and(eq(reportAccessTable.reportKey, key), eq(reportAccessTable.userId, user.username)));
}

export async function listUsersWithAccessToReport(reportKey: string): Promise<string[]> {
  const key = normalize(reportKey);
  const set = new Set<string>();
  const owner = await getUserByUsername(key);
  if (owner) set.add(owner.username);
  // Explicit grants
  const grants = await db
    .select({ userId: reportAccessTable.userId, username: users.username })
    .from(reportAccessTable)
    .innerJoin(users, eq(reportAccessTable.userId, users.username))
    .where(eq(reportAccessTable.reportKey, key));
  grants.forEach((r: { username: string }) => set.add(r.username));
  // Admins
  const adminUsernames = await listAdmins();
  adminUsernames.forEach(a => set.add(a));
  return Array.from(set.values()).sort();
}

export async function isUserAllowed(params: { reportKey: string; username: string }): Promise<boolean> {
  const { reportKey, username } = params;
  const key = normalize(reportKey);
  if (!key || !username) return false;
  if (await isAdmin(username)) return true;
  const user = await getUserByUsername(username);
  if (!user) return false;
  if (user.username === key) return true; // owner
  // explicit grant
  const grant = await db
    .select({ reportKey: reportAccessTable.reportKey })
    .from(reportAccessTable)
    .where(and(eq(reportAccessTable.reportKey, key), eq(reportAccessTable.userId, user.username)))
    .limit(1);
  return grant.length > 0;
}

export async function listReportKeysForUser(username: string): Promise<string[]> {
  if (!username) return [];
  if (await isAdmin(username)) return listAllReportKeys();
  const user = await getUserByUsername(username);
  if (!user) return [];
  const keys = new Set<string>([user.username]);
  // explicit grants
  const grants = await db
    .select({ reportKey: reportAccessTable.reportKey })
    .from(reportAccessTable)
    .where(eq(reportAccessTable.userId, user.username));
  grants.forEach((r: { reportKey: string }) => keys.add(r.reportKey));
  return Array.from(keys.values()).sort();
}


