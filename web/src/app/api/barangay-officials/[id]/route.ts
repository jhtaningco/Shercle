import {
  deleteBarangayOfficial,
  getBarangayCaptain,
  isEmailUnique,
  toggleOfficialStatus,
  updateBarangayOfficial
} from '@/lib/supabase/barangay-officials';
import { NextRequest, NextResponse } from 'next/server';

type Params = { params: Promise<{ id: string }> };

// PATCH /api/barangay-officials/[id]
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();

    // If only toggling status
    if (Object.keys(body).length === 1 && 'is_active' in body) {
      const updated = await toggleOfficialStatus(id, body.is_active);
      return NextResponse.json(updated);
    }

    // If updating fields — check email uniqueness if email changed
    if (body.email) {
      const emailUnique = await isEmailUnique(body.email, id);
      if (!emailUnique) {
        return NextResponse.json(
          { error: 'Email address is already in use by another official' },
          { status: 409 }
        );
      }
    }

    const updated = await updateBarangayOfficial(id, body);
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE /api/barangay-officials/[id]
export async function DELETE(_: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await deleteBarangayOfficial(id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
