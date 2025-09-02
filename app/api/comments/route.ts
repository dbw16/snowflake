import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { addComment, getComments } from '../../../lib/comments';
import { isUserAllowed } from '../../../lib/access';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const username = session?.user?.name;
  const { searchParams } = new URL(req.url);
  const trackId = searchParams.get('trackId');
  const milestoneStr = searchParams.get('milestone');
  const reportKey = searchParams.get('reportKey') || '';
  const signalIndexStr = searchParams.get('signalIndex');
  const milestone = milestoneStr ? Number(milestoneStr) : NaN;

  if (!username) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'content-type': 'application/json' },
    });
  }

  if (!trackId || Number.isNaN(milestone) || !reportKey) {
    return new Response(JSON.stringify({ error: 'trackId, milestone, and reportKey are required' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  try {
    // Access check
    const allowed = await isUserAllowed({ reportKey, username });
    if (!allowed) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: { 'content-type': 'application/json' },
      });
    }
    const signalIndex = signalIndexStr === null || signalIndexStr === '' ? null : Number(signalIndexStr);
    const comments = await getComments({ trackId, milestone, reportKey, signalIndex });
    return new Response(JSON.stringify({ comments }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Failed to load comments' }), {
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
    const trackId = (body?.trackId as string | undefined) || '';
    const milestone = Number(body?.milestone);
    const signalIndex = body?.signalIndex === undefined || body?.signalIndex === null ? null : Number(body.signalIndex);
    const text = (body?.text as string | undefined) || '';
    const reportKey = (body?.reportKey as string | undefined) || '';
    const parentId = (body?.parentId as string | undefined) ?? null;

    if (!trackId || Number.isNaN(milestone) || !text.trim() || !reportKey) {
      return new Response(JSON.stringify({ error: 'trackId, milestone, text, and reportKey are required' }), {
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

    const created = await addComment({ trackId, milestone, signalIndex, authorName: username, text, reportKey, parentId });
    return new Response(JSON.stringify({ comment: created }), {
      status: 201,
      headers: { 'content-type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Failed to add comment' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
}


