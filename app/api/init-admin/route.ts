import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { addAdmin, isAdmin, listAdmins } from '../../../lib/access';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    // Check authentication first
    const session = await getServerSession(authOptions);
    const currentUser = session?.user?.name;
    
    if (!currentUser) {
      return new Response(JSON.stringify({ 
        error: 'Authentication required' 
      }), {
        status: 401,
        headers: { 'content-type': 'application/json' },
      });
    }

    // Only allow existing admins to create new admins, or allow the first admin if none exist
    const existingAdmins = await listAdmins();
    const isCurrentUserAdmin = await isAdmin(currentUser);
    
    if (existingAdmins.length > 0 && !isCurrentUserAdmin) {
      return new Response(JSON.stringify({ 
        error: 'Only existing administrators can create new admin users' 
      }), {
        status: 403,
        headers: { 'content-type': 'application/json' },
      });
    }

    const body = await req.json();
    const username = body?.username;
    
    if (!username || typeof username !== 'string' || username.trim().length === 0) {
      return new Response(JSON.stringify({ 
        error: 'Valid username is required' 
      }), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      });
    }
    
    const normalizedUsername = username.trim();
    await addAdmin(normalizedUsername);
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: `User ${normalizedUsername} has been added as an admin` 
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
