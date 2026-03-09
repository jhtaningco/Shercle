import {
  createBarangayOfficial,
  getBarangayOfficials,
  getBarangayCaptain,
  isEmailUnique
} from '@/lib/supabase/barangay-officials';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/barangay-officials?barangay_id=xxx
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const barangayId = searchParams.get('barangay_id');

    if (!barangayId) {
      return NextResponse.json(
        { error: 'barangay_id is required' },
        { status: 400 }
      );
    }

    const officials = await getBarangayOfficials(barangayId);
    return NextResponse.json(officials);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/barangay-officials
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { barangay_id, email, role } = body;

    // Validate required fields
    if (!barangay_id || !email || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check email uniqueness
    const emailUnique = await isEmailUnique(email);
    if (!emailUnique) {
      return NextResponse.json(
        { error: 'Email address is already in use by another official' },
        { status: 409 }
      );
    }

    // Enforce one captain per barangay
    if (role === 'captain') {
      const existingCaptain = await getBarangayCaptain(barangay_id);
      if (existingCaptain) {
        return NextResponse.json(
          {
            error: `This barangay already has a captain: ${existingCaptain.first_name} ${existingCaptain.last_name}. Deactivate them first before adding a new one.`
          },
          { status: 409 }
        );
      }
    }

    const official = await createBarangayOfficial(body);
    return NextResponse.json(official, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
