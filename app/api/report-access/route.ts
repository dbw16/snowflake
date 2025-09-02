import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { grantAccess, revokeAccess } from '../../../lib/report-access';
import { isUserAllowed } from '../../../lib/access';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const reportKey = (body?.reportKey as string | undefined) || '';
    const userId = (body?.userId as string | undefined) || '';
    const username = (await cookies()).get('username')?.value || '';

    if (!reportKey || !userId) {
      return new Response(JSON.stringify({ error: 'reportKey and userId are required' }), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      });
    }

    // Only the report owner can grant access
    if (reportKey !== username) {
        return new Response(JSON.stringify({ error: 'Forbidden' }), {
            status: 403,
            headers: { 'content-type': 'application/json' },
        });
    }

    const created = await grantAccess({ reportKey, userId });
    return new Response(JSON.stringify({ access: created }), {
      status: 201,
      headers: { 'content-type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Failed to grant access' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
}

export async function DELETE(req: NextRequest) {
    try {
      const body = await req.json();
      const reportKey = (body?.reportKey as string | undefined) || '';
      const userId = (body?.userId as string | undefined) || '';
      const username = (await cookies()).get('username')?.value || '';
  
      if (!reportKey || !userId) {
        return new Response(JSON.stringify({ error: 'reportKey and userId are required' }), {
          status: 400,
          headers: { 'content-type': 'application/json' },
        });
      }
  
      // Only the report owner can revoke access
      if (reportKey !== username) {
          return new Response(JSON.stringify({ error: 'Forbidden' }), {
              status: 403,
              headers: { 'content-type': 'application/json' },
          });
      }
  
      const deleted = await revokeAccess({ reportKey, userId });
      return new Response(JSON.stringify({ access: deleted }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });
    } catch (err: any) {
      return new Response(JSON.stringify({ error: err?.message || 'Failed to revoke access' }), {
        status: 500,
        headers: { 'content-type': 'application/json' },
      });
    }
  }
