import { createClient as createAdminClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { code } = await request.json();
  if (!code?.trim()) {
    return NextResponse.json({ error: 'Access code is required.' }, { status: 400 });
  }

  // Verify the requesting user's session
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: 'You must be signed in to redeem a code.' }, { status: 401 });
  }

  // Use service role to bypass RLS on access_codes
  const admin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: entry, error: lookupError } = await admin
    .from('access_codes')
    .select('*')
    .eq('code', code.trim().toUpperCase())
    .single();

  if (lookupError || !entry) {
    return NextResponse.json({ error: 'Invalid access code.' }, { status: 400 });
  }
  if (entry.uses >= entry.max_uses) {
    return NextResponse.json({ error: 'This access code has already been used.' }, { status: 400 });
  }
  if (entry.expires_at && new Date(entry.expires_at) < new Date()) {
    return NextResponse.json({ error: 'This access code has expired.' }, { status: 400 });
  }

  // Grant 180-day access
  const { error: grantError } = await admin.rpc('grant_user_access', {
    p_user_id: session.user.id,
    p_track: entry.license_track,
  });
  if (grantError) {
    return NextResponse.json({ error: 'Failed to grant access. Please try again.' }, { status: 500 });
  }

  // Increment usage count
  await admin
    .from('access_codes')
    .update({ uses: entry.uses + 1 })
    .eq('code', entry.code);

  return NextResponse.json({ success: true, license_track: entry.license_track });
}
