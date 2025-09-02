import { sqliteTable, text, integer, primaryKey, index } from 'drizzle-orm/sqlite-core';

// Users table - username is the primary identifier (removed random id)
export const users = sqliteTable('users', {
  username: text('username').primaryKey(),
  email: text('email'),
  createdAt: text('createdAt').notNull(),
  updatedAt: text('updatedAt').notNull(),
}, (t) => ({
  usernameIdx: index('idx_users_username').on(t.username),
}));

// User roles table - many-to-many relationship for roles (userId now stores the username)
export const userRoles = sqliteTable('user_roles', {
  userId: text('userId').notNull(), // references users.username
  role: text('role').notNull(), // 'admin', 'user', etc.
  createdAt: text('createdAt').notNull(),
}, (t) => ({
  pk: primaryKey({ columns: [t.userId, t.role] }),
  userIdIdx: index('idx_user_roles_user_id').on(t.userId),
  roleIdx: index('idx_user_roles_role').on(t.role),
}));

// NOTE: Removed separate reports & report_access tables.
// Each user implicitly owns exactly one "report" whose key is the user's username (unique).
// Wherever reportKey was previously a foreign key to reports.key, it now references users.username.

// Comments table - authorId now stores the author's username
export const comments = sqliteTable('comments', {
  id: text('id').primaryKey(),
  trackId: text('trackId').notNull(),
  milestone: integer('milestone').notNull(),
  signalIndex: integer('signalIndex'),
  authorId: text('authorId').notNull(), // references users.username
  text: text('text').notNull(),
  createdAt: text('createdAt').notNull(),
  reportKey: text('reportKey').notNull(), // References users.username (implicit 1:1 report per user)
  parentId: text('parentId'), // Self-referencing foreign key
}, (t) => ({
  trackMilestoneIdx: index('idx_comments_track_milestone').on(t.trackId, t.milestone),
  reportKeyIdx: index('idx_comments_report_key').on(t.reportKey),
  authorIdx: index('idx_comments_author').on(t.authorId),
  createdAtIdx: index('idx_comments_created_at').on(t.createdAt),
  parentIdx: index('idx_comments_parent').on(t.parentId),
}));

// Archived table - archivedBy stores username
export const archived = sqliteTable('archived', {
  reportKey: text('reportKey').notNull(), // References users.username (implicit 1:1 report per user)
  trackId: text('trackId').notNull(),
  milestone: text('milestone').notNull(),
  value: integer('value').notNull(),
  archivedAt: text('archivedAt').notNull(),
  archivedBy: text('archivedBy').notNull(), // references users.username
}, (t) => ({
  pk: primaryKey({ columns: [t.reportKey, t.trackId, t.milestone] }),
  reportKeyIdx: index('idx_archived_report_key').on(t.reportKey),
  archivedByIdx: index('idx_archived_by').on(t.archivedBy),
}));

// Explicit report access grants (in addition to implicit ownership & admin rights)
export const reportAccess = sqliteTable('report_access', {
  reportKey: text('reportKey').notNull(), // references users.username (owner)
  userId: text('userId').notNull(), // references users.username (granted user)
  grantedAt: text('grantedAt').notNull(),
}, (t) => ({
  pk: primaryKey({ columns: [t.reportKey, t.userId] }),
  reportKeyIdx: index('idx_report_access_report_key').on(t.reportKey),
  userIdx: index('idx_report_access_user').on(t.userId),
}));

// Per-report milestone state (one row per track)
export const reportMilestones = sqliteTable('report_milestones', {
  reportKey: text('reportKey').notNull(), // references users.username (implicit owner)
  trackId: text('trackId').notNull(),
  milestone: integer('milestone').notNull(),
  updatedAt: text('updatedAt').notNull(),
  updatedBy: text('updatedBy').notNull(), // username who made change
}, (t) => ({
  pk: primaryKey({ columns: [t.reportKey, t.trackId] }),
  reportKeyIdx: index('idx_report_milestones_report_key').on(t.reportKey),
  trackIdx: index('idx_report_milestones_track').on(t.trackId),
}));


