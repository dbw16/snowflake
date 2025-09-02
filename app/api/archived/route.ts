import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { getArchivedByReportKey, setArchivedByReportKey, updateArchivedTrack } from '../../../lib/archived.ts';
import { isUserAllowed } from '../../../lib/access.ts';

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
    return new Response(JSON.stringify({ error: 'reportKey is required' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  try {
    const allowed = await isUserAllowed({ reportKey, username });
    if (!allowed) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: { 'content-type': 'application/json' },
      });
    }
    const archived = await getArchivedByReportKey(reportKey);
    return new Response(JSON.stringify({ archivedByTrack: archived }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Failed to load archived state' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
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
    const archivedByTrack = (body?.archivedByTrack as Record<string, boolean> | undefined) || undefined;
    const trackId = (body?.trackId as string | undefined) || undefined;
    const milestone = body?.milestone === undefined || body?.milestone === null ? undefined : Number(body.milestone);
    const value = (body?.value as boolean | undefined);

    if (!reportKey) {
      return new Response(JSON.stringify({ error: 'reportKey is required' }), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      });
    }

    const allowed = await isUserAllowed({ reportKey, username });
    if (!allowed) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: { 'content-type': 'application/json' },
      });
    }

    let updated;
    if (trackId && typeof milestone === 'number' && !Number.isNaN(milestone)) {
      updated = await updateArchivedTrack({ reportKey, trackId, milestone, value });
    } else if (archivedByTrack) {
      updated = await setArchivedByReportKey({ reportKey, archivedByTrack });
    } else {
      return new Response(JSON.stringify({ error: 'Provide (trackId and milestone) or archivedByTrack' }), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ archivedByTrack: updated }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Failed to update archived state' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
}


