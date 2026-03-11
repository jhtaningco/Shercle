import { createClient } from '@/lib/supabase-server';
import type {
  BarangayOfficial,
  CreateOfficialInput,
  District,
  UpdateOfficialInput
} from '@/types/barangay';

// ─── Districts & Barangays ──────────────────────────────────────────────────

export async function getDistrictsWithBarangays(): Promise<District[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('districts')
    .select('*, barangays(*)')
    .eq('is_active', true)
    .order('district_number', { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as District[];
}

export async function getBarangayById(barangayId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('barangays')
    .select('*, district:districts(*)')
    .eq('id', barangayId)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// ─── Officials ──────────────────────────────────────────────────────────────

export async function getBarangayOfficials(
  barangayId: string
): Promise<BarangayOfficial[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('barangay_officials')
    .select('*')
    .eq('barangay_id', barangayId)
    .order('last_name', { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as BarangayOfficial[];
}

export async function getBarangayCaptain(
  barangayId: string
): Promise<BarangayOfficial | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('barangay_officials')
    .select('*')
    .eq('barangay_id', barangayId)
    .eq('role', 'captain')
    .eq('is_active', true)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data as BarangayOfficial | null;
}

export async function createBarangayOfficial(
  input: CreateOfficialInput
): Promise<BarangayOfficial> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('barangay_officials')
    .insert({ ...input, is_active: input.is_active ?? true })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as BarangayOfficial;
}

export async function updateBarangayOfficial(
  id: string,
  input: UpdateOfficialInput
): Promise<BarangayOfficial> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('barangay_officials')
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as BarangayOfficial;
}

export async function deleteBarangayOfficial(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('barangay_officials')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
}

export async function toggleOfficialStatus(
  id: string,
  isActive: boolean
): Promise<BarangayOfficial> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('barangay_officials')
    // Changing is_active determines if it's manually inactive or not
    // We update both tracking fields to properly deactivate an account.
    // If they were active or pending before deactivate, they become inactive.
    // If they are reactivated, they become active (we assume email was confirmed if an admin reactivates them for now).
    .update({ 
      is_active: isActive, 
      status: isActive ? 'active' : 'inactive',
      updated_at: new Date().toISOString() 
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as BarangayOfficial;
}

export async function isEmailUnique(
  email: string,
  excludeId?: string
): Promise<boolean> {
  const supabase = await createClient();
  let query = supabase
    .from('barangay_officials')
    .select('id')
    .eq('email', email);

  if (excludeId) {
    query = query.neq('id', excludeId);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []).length === 0;
}
