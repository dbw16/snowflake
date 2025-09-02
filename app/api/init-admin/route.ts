import { NextRequest } from 'next/server';
import { addAdmin } from '../../../lib/access';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const username = body?.username || 'david';
    
    await addAdmin(username);
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: `User ${username} has been added as an admin` 
    }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ 
      error: err?.message || 'Failed to initialize admin user' 
    }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
}
