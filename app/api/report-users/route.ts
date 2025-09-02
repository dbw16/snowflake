import { NextRequest } from 'next/server';
import { isAdmin, listUsersWithAccessToReport } from '../../../lib/access.ts';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const reportKey = searchParams.get('reportKey') || '';
  const session = await getServerSession(authOptions);
  const requester = session?.user?.name || '';
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


