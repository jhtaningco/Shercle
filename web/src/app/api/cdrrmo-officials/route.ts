import {
  createCdrrmoOfficial,
  getCdrrmoOfficials,
  isCdrrmoEmailUnique
} from '@/lib/supabase/cdrrmo-officials';
import { NextRequest, NextResponse } from 'next/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// GET /api/cdrrmo-officials
export async function GET() {
  try {
    const officials = await getCdrrmoOfficials();
    return NextResponse.json(officials);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/cdrrmo-officials
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, role, password } = body;

    // Validate required fields
    if (!email || !role || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check email uniqueness
    const emailUnique = await isCdrrmoEmailUnique(email);
    if (!emailUnique) {
      return NextResponse.json(
        { error: 'Email address is already in use by another official' },
        { status: 409 }
      );
    }

    // Create Supabase Auth User
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;
    
    // We instantiate a separate client with persistSession: false to ensure the current admin user is not logged out
    const authSupabase = createSupabaseClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false }
    });

    const { data: authData, error: authError } = await authSupabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      return NextResponse.json(
        { error: `Error creating auth user: ${authError.message}` },
        { status: 500 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Failed to create auth user' },
        { status: 500 }
      );
    }

    // In Supabase, if an email already exists in auth.users, signUp() will return the user
    // but with an empty identities array, and it will NOT send another verification email.
    if (authData.user.identities && authData.user.identities.length === 0) {
      return NextResponse.json(
        { error: 'This email is already registered in Supabase Authentication. Please delete the existing user from the Supabase dashboard first, or use a different email.' },
        { status: 409 }
      );
    }

    // Insert mapping into user_roles table
    const { error: roleError } = await authSupabase.from('user_roles').insert({
      auth_user_id: authData.user.id,
      role: 'cdrrmo'
    });

    if (roleError) {
      return NextResponse.json(
        { error: `Error assigning user role: ${roleError.message}` },
        { status: 500 }
      );
    }

    // Now insert the official into our cdrrmo_officials table
    const { password: _pw, confirm_password: _cpw, ...officialData } = body;
    const officialPayload = {
      ...officialData,
      auth_user_id: authData.user.id,
      status: 'pending' // Enforce pending status until email confirmation
    };

    const official = await createCdrrmoOfficial(officialPayload);
    return NextResponse.json(official, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
