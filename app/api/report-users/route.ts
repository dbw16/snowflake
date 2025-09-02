import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { isAdmin, listUsersWithAccessToReport } from '../../../lib/access.ts';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const reportKey = searchParams.get('reportKey') || '';
  const requester = searchParams.get('username') || (await cookies()).get('username')?.value || '';
  if (!requester || !(await isAdmin(requester))) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: { 'content-type': 'application/json' } });
  }
  if (!reportKey) {
    return new Response(JSON.stringify({ error: 'reportKey is required' }), { status: 400, headers: { 'content-type': 'application/json' } });
  }
  try {
    const users = await listUsersWithAccessToReport(reportKey);
    return new Response(JSON.stringify({ users }), { status: 200, headers: { 'content-type': 'application/json' } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Failed to list users for report' }), { status: 500, headers: { 'content-type': 'application/json' } });
  }
}


