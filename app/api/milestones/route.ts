import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { isUserAllowed } from '../../../lib/access';
import { getMilestones, setMilestones, updateMilestone } from '../../../lib/milestones';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const username = session?.user?.name;
  const { searchParams } = new URL(req.url);
  const reportKey = searchParams.get('reportKey') || '';

  if (!username) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'content-type': 'application/json' },
    });
  }

  if (!reportKey) {
    return new Response(JSON.stringify({ error: 'reportKey is required' }), { status: 400, headers: { 'content-type': 'application/json' } });
  }
  try {
    const allowed = await isUserAllowed({ reportKey, username });
    if (!allowed) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: { 'content-type': 'application/json' } });
    }
    const milestoneByTrack = await getMilestones(reportKey);
    return new Response(JSON.stringify({ milestoneByTrack }), { status: 200, headers: { 'content-type': 'application/json' } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Failed to load milestones' }), { status: 500, headers: { 'content-type': 'application/json' } });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const username = session?.user?.name;

  if (!username) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'content-type': 'application/json' },
    });
  }

  try {
    const body = await req.json();
    const reportKey = (body?.reportKey as string | undefined) || '';
    const trackId = (body?.trackId as string | undefined) || undefined;
    const milestone = body?.milestone === undefined || body?.milestone === null ? undefined : Number(body.milestone);
    const milestoneByTrack = (body?.milestoneByTrack as Record<string, number> | undefined) || undefined;

    if (!reportKey) {
      return new Response(JSON.stringify({ error: 'reportKey is required' }), { status: 400, headers: { 'content-type': 'application/json' } });
    }

    const allowed = await isUserAllowed({ reportKey, username });
    if (!allowed) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: { 'content-type': 'application/json' } });
    }

    let updated;
    if (trackId && typeof milestone === 'number' && !Number.isNaN(milestone)) {
      updated = await updateMilestone({ reportKey, trackId, milestone, updatedBy: username });
    } else if (milestoneByTrack) {
      updated = await setMilestones({ reportKey, milestoneByTrack, updatedBy: username });
    } else {
      return new Response(JSON.stringify({ error: 'Provide (trackId and milestone) or milestoneByTrack' }), { status: 400, headers: { 'content-type': 'application/json' } });
    }

    return new Response(JSON.stringify({ milestoneByTrack: updated }), { status: 200, headers: { 'content-type': 'application/json' } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Failed to update milestones' }), { status: 500, headers: { 'content-type': 'application/json' } });
  }
}
