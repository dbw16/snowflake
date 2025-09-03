import { test, expect } from '@playwright/test';
import { db } from './db';
import { users, userRoles, reportAccess, comments } from '../lib/schema';
import { eq, and } from 'drizzle-orm';
import { aw } from 'vitest/dist/chunks/reporters.nr4dxCkA.js';
import { now } from 'next-auth/client/_utils';

test.beforeEach(async () => {
  // Reset the database before each test
  await db.delete(comments);
  await db.delete(userRoles);
  await db.delete(reportAccess);
  await db.delete(users);

  const now = new Date().toISOString();
  await db.insert(users).values([
    { username: 'user1', email: 'user1@example.com', createdAt: now, updatedAt: now },
    { username: 'user2', email: 'user2@example.com', createdAt: now, updatedAt: now },
    { username: 'admin_user', email: 'admin@example.com', createdAt: now, updatedAt: now },
  ]);

  await db.insert(userRoles).values([
    { userId: 'admin_user', role: 'admin', createdAt: now },
  ]);
});

test('admin can add and remove admins', async ({ page, context }) => {
  // Login as admin
  await page.goto('/');
  await page.getByLabel('Username').fill('admin_user');
  await page.getByRole('button').click();
  await expect(page.getByText('Career Ladder')).toBeVisible();

  // Go to admin page
  await page.goto('/admin', { waitUntil: 'networkidle' });
  await expect(page).toHaveURL(/.*admin/);
  
  // Click on Add Admin tab
  await page.getByRole('button', { name: 'Add Admin'}).click();

  // Fill in and hit enter
  await page.getByPlaceholder('Select a user to make admin').fill('user1');
  await page.getByPlaceholder('Select a user to make admin').press('Enter');
  await page.getByPlaceholder('Select a user to make admin').press('Escape');

  // Check user is now in the list of admins
  await page.waitForTimeout(50); // wait for db write
  const newAdminRole = await db.select().from(userRoles).where(eq(userRoles.userId, 'user1')).limit(1);
  expect(newAdminRole.length).toBeGreaterThan(0);

  // Fill in revoke and hit enter
  await page.getByPlaceholder('Select an admin to revoke').fill('user1');
  await page.getByPlaceholder('Select an admin to revoke').press('Enter');
  await page.getByPlaceholder('Select an admin to revoke').press('Escape');


  // Check user is now in the list of admins
  await page.waitForTimeout(500); // wait for db write
  const revokedAdminRole = await db.select().from(userRoles).where(eq(userRoles.userId, 'user1')).limit(1);
  expect(revokedAdminRole.length).toEqual(0);
});

test('admin can add and remove reviewers', async ({ page }) => {
  // Login as admin
  await page.goto('/');
  await page.getByLabel('Username').fill('admin_user');
  await page.getByRole('button').click();
  await expect(page.getByText('Career Ladder')).toBeVisible();

  // Go to admin page
  await page.goto('/admin', { waitUntil: 'networkidle' });
  await expect(page).toHaveURL(/.*admin/);

  // fill in
  await page.getByPlaceholder('Select User Report').nth(0).fill('user1');
  await page.getByPlaceholder('User to grant').fill('user2');
  await page.getByPlaceholder('User to grant').press('Enter');

  // check db to make sure this has been done
  await page.waitForTimeout(300); // wait for db write
  const grantedReviewerRole = await db.select().from(reportAccess).where(and(eq(reportAccess.userId, 'user2'), eq(reportAccess.reportKey, 'user1'))).limit(1);
  expect(grantedReviewerRole.length).toBeGreaterThan(0);

  // fill in revoke
  await page.getByPlaceholder('Select User Report').nth(1).fill('user1');
  await page.getByPlaceholder(RegExp('reviews name .*')).fill('user2');
  await page.getByPlaceholder(RegExp('reviews name .*')).press('Enter');

  // check db to make sure this has been done
  await page.waitForTimeout(500); // wait for db write
  const revokedReviewerRole = await db.select().from(reportAccess).where(and(eq(reportAccess.userId, 'user2'), eq(reportAccess.reportKey, 'user1'))).limit(1);
  expect(revokedReviewerRole.length).toEqual(0);
});

test('non-admin cannot access admin page', async ({ page }) => {
  // Login as admin
  await page.goto('/');
  await page.getByLabel('Username').fill('user1');
  await page.getByRole('button').click();
  await expect(page.getByText('Career Ladder')).toBeVisible();

  // Go to admin page
  await page.goto('/admin', { waitUntil: 'networkidle' });
  await expect(page).toHaveURL('/');  // If user does not have admin access they get redirect to home
});

test('users can add comments and replies', async ({ page }) => {
  // Login as user
  await page.goto('/');
  await page.getByLabel('Username').fill('user1');
  await page.getByRole('button').click();


  // Wait until the combobox has the 'dev' option loaded (even if not visible yet)
  const devOption = page.getByRole('combobox').locator('text=user1');
  await devOption.waitFor({ state: 'attached', timeout: 10000 });

  // Add first comment
  await page.getByRole('button', { name: 'Add comment' }).nth(0).click();
  await page.getByPlaceholder('Add a comment').nth(0).fill('First comment');
  await page.getByRole('button', { name: 'Post comment' }).nth(0).click();

  // Verify the comment show up
  expect(page.getByText('First comment')).toBeVisible();

  // Verify in database that comments were actually saved
  await page.waitForTimeout(50); // wait for db write
  const savedComments = await db.select().from(comments).where(eq(comments.authorId, 'user1'));
  console.log('Saved comments:', savedComments);
  expect(savedComments.length).toBeGreaterThan(0);

  // Post a reply to this comment
  await page.getByRole('button', { name: 'Reply' }).nth(0).click();
  await page.getByPlaceholder('Add a reply').nth(0).fill('First reply');
  await page.getByRole('button', { name: 'Post reply' }).nth(0).click();

  // Verify the reply show up
  expect(page.getByText('First reply')).toBeVisible();
  
  // Verify in database that comments were actually saved
  await page.waitForTimeout(50); // wait for db write
  const savedReply = await db.select().from(comments).where(eq(comments.authorId, 'user1'));
  console.log('Saved comments:', savedReply);
  expect(savedReply.length).toBeGreaterThan(1);
});



test('users who has report over antoher can add comments', async ({ page }) => {
  // let user 1 mark user 2's report
  await db.insert(reportAccess).values([
    { reportKey: 'user2', userId: 'user1', grantedAt: now().toString() }
  ]);
 
  // Login as user
  await page.goto('/');
  await page.getByLabel('Username').fill('user1');
  await page.getByRole('button').click();


  // Wait until the combobox has the 'dev' option loaded (even if not visible yet)
  const devOption = page.getByRole('combobox').locator('text=user2');
  await devOption.waitFor({ state: 'attached', timeout: 10000 });

  // Select the user2 option
  await page.getByRole('combobox').selectOption('user2');

  // Add first comment
  await page.getByRole('button', { name: 'Add comment' }).nth(0).click();
  await page.getByPlaceholder('Add a comment').nth(0).fill('First comment');
  await page.getByRole('button', { name: 'Post comment' }).nth(0).click();

  // Verify the comment show up
  expect(page.getByText('First comment')).toBeVisible();

  // Verify in database that comments were actually saved
  await page.waitForTimeout(50); // wait for db write
  const savedComments = await db.select().from(comments).where(and(eq(comments.authorId, 'user1'), eq(comments.reportKey, 'user2')));
  console.log('Saved comments:', savedComments);
  expect(savedComments.length).toBeGreaterThan(0);
});
