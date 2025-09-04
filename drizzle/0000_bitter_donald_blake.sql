CREATE TABLE `archived` (
	`reportKey` text NOT NULL,
	`trackId` text NOT NULL,
	`milestone` text NOT NULL,
	`value` integer NOT NULL,
	`archivedAt` text NOT NULL,
	`archivedBy` text NOT NULL,
	PRIMARY KEY(`reportKey`, `trackId`, `milestone`)
);
--> statement-breakpoint
CREATE INDEX `idx_archived_report_key` ON `archived` (`reportKey`);--> statement-breakpoint
CREATE INDEX `idx_archived_by` ON `archived` (`archivedBy`);--> statement-breakpoint
CREATE TABLE `comments` (
	`id` text PRIMARY KEY NOT NULL,
	`trackId` text NOT NULL,
	`milestone` integer NOT NULL,
	`signalIndex` integer,
	`authorId` text NOT NULL,
	`text` text NOT NULL,
	`createdAt` text NOT NULL,
	`reportKey` text NOT NULL,
	`parentId` text
);
--> statement-breakpoint
CREATE INDEX `idx_comments_track_milestone` ON `comments` (`trackId`,`milestone`);--> statement-breakpoint
CREATE INDEX `idx_comments_report_key` ON `comments` (`reportKey`);--> statement-breakpoint
CREATE INDEX `idx_comments_author` ON `comments` (`authorId`);--> statement-breakpoint
CREATE INDEX `idx_comments_created_at` ON `comments` (`createdAt`);--> statement-breakpoint
CREATE INDEX `idx_comments_parent` ON `comments` (`parentId`);--> statement-breakpoint
CREATE TABLE `report_access` (
	`reportKey` text NOT NULL,
	`userId` text NOT NULL,
	`grantedAt` text NOT NULL,
	PRIMARY KEY(`reportKey`, `userId`)
);
--> statement-breakpoint
CREATE INDEX `idx_report_access_report_key` ON `report_access` (`reportKey`);--> statement-breakpoint
CREATE INDEX `idx_report_access_user` ON `report_access` (`userId`);--> statement-breakpoint
CREATE TABLE `report_milestones` (
	`reportKey` text NOT NULL,
	`trackId` text NOT NULL,
	`milestone` integer NOT NULL,
	`updatedAt` text NOT NULL,
	`updatedBy` text NOT NULL,
	PRIMARY KEY(`reportKey`, `trackId`)
);
--> statement-breakpoint
CREATE INDEX `idx_report_milestones_report_key` ON `report_milestones` (`reportKey`);--> statement-breakpoint
CREATE INDEX `idx_report_milestones_track` ON `report_milestones` (`trackId`);--> statement-breakpoint
CREATE TABLE `user_roles` (
	`userId` text NOT NULL,
	`role` text NOT NULL,
	`createdAt` text NOT NULL,
	PRIMARY KEY(`userId`, `role`)
);
--> statement-breakpoint
CREATE INDEX `idx_user_roles_user_id` ON `user_roles` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_user_roles_role` ON `user_roles` (`role`);--> statement-breakpoint
CREATE TABLE `users` (
	`username` text PRIMARY KEY NOT NULL,
	`email` text,
	`createdAt` text NOT NULL,
	`updatedAt` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_users_username` ON `users` (`username`);