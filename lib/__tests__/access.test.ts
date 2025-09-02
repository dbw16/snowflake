import { describe, it, expect, beforeEach } from 'vitest';
import { isUserAllowed, listReportKeysForUser, addAdmin, getAllReportKeys, createUser, grantReportAccess } from '../access';
import Database from 'better-sqlite3';
import { mkdirSync, existsSync } from 'fs';
import path from 'path';

// Ensure schema exists & tables cleared before each test.
function resetDb() {
  const dataDir = path.join(process.cwd(), 'data');
  if (!existsSync(dataDir)) mkdirSync(dataDir);
  const db = new Database(path.join(dataDir, 'app.sqlite3'));
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      username text PRIMARY KEY,
      email text,
      createdAt text NOT NULL,
      updatedAt text NOT NULL
    );
    CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username ON users (username);
    CREATE TABLE IF NOT EXISTS user_roles (
      userId text NOT NULL, -- references users.username
      role text NOT NULL,
      createdAt text NOT NULL,
      PRIMARY KEY (userId, role)
    );
    CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles (userId);
    CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles (role);
    CREATE TABLE IF NOT EXISTS comments (
      id text PRIMARY KEY,
      trackId text NOT NULL,
      milestone integer NOT NULL,
      signalIndex integer,
      authorId text NOT NULL, -- references users.username
      text text NOT NULL,
      createdAt text NOT NULL,
      reportKey text NOT NULL,
      parentId text
    );
    CREATE INDEX IF NOT EXISTS idx_comments_track_milestone ON comments (trackId, milestone);
    CREATE INDEX IF NOT EXISTS idx_comments_report_key ON comments (reportKey);
    CREATE INDEX IF NOT EXISTS idx_comments_author ON comments (authorId);
    CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments (createdAt);
    CREATE INDEX IF NOT EXISTS idx_comments_parent ON comments (parentId);
    CREATE TABLE IF NOT EXISTS archived (
      reportKey text NOT NULL,
      trackId text NOT NULL,
      milestone text NOT NULL,
      value integer NOT NULL,
      archivedAt text NOT NULL,
      archivedBy text NOT NULL, -- references users.username
      PRIMARY KEY (reportKey, trackId, milestone)
    );
    CREATE INDEX IF NOT EXISTS idx_archived_report_key ON archived (reportKey);
    CREATE INDEX IF NOT EXISTS idx_archived_by ON archived (archivedBy);
    CREATE TABLE IF NOT EXISTS report_access (
      reportKey text NOT NULL,
      userId text NOT NULL, -- references users.username
      grantedAt text NOT NULL,
      PRIMARY KEY (reportKey, userId)
    );
    CREATE INDEX IF NOT EXISTS idx_report_access_report_key ON report_access (reportKey);
    CREATE INDEX IF NOT EXISTS idx_report_access_user ON report_access (userId);
    DELETE FROM user_roles; DELETE FROM comments; DELETE FROM archived; DELETE FROM users; DELETE FROM report_access;
  `);
  db.close();
}

describe('explicit report access model', () => {
  beforeEach(() => {
    resetDb();
  });

  it('allows a user to access their own report key only until grant', async () => {
    await createUser('alice');
    await createUser('bob');

    expect(await isUserAllowed({ reportKey: 'alice', username: 'alice' })).toBe(true);
    expect(await isUserAllowed({ reportKey: 'bob', username: 'bob' })).toBe(true);
  expect(await isUserAllowed({ reportKey: 'alice', username: 'bob' })).toBe(false);
  // grant access for bob to alice
  await grantReportAccess('alice', 'bob');
  expect(await isUserAllowed({ reportKey: 'alice', username: 'bob' })).toBe(true);
  expect(await isUserAllowed({ reportKey: 'bob', username: 'alice' })).toBe(false);
  });

  it('grants admins access to all report keys', async () => {
    await createUser('owner1');
    await createUser('owner2');
    await createUser('adminUser');
    await addAdmin('adminUser');

    expect(await isUserAllowed({ reportKey: 'owner1', username: 'adminUser' })).toBe(true);
    expect(await isUserAllowed({ reportKey: 'owner2', username: 'adminUser' })).toBe(true);
  });

  it('lists own + granted keys for normal user; all for admin', async () => {
    await createUser('carol');
    await createUser('dave');
    await createUser('super');
    await addAdmin('super');
    await grantReportAccess('dave', 'carol');

    const carolKeys = await listReportKeysForUser('carol');
    expect(carolKeys).toEqual(['carol', 'dave']);

    const superKeys = await listReportKeysForUser('super');
    // super should include at least all existing usernames
    const allKeys = await getAllReportKeys();
    expect(new Set(superKeys)).toEqual(new Set(allKeys));
  });
});
