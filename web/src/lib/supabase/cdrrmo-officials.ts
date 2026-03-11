import { createClient } from '@/lib/supabase-server';
import type {
  CdrrmoOfficial,
  CreateCdrrmoOfficialInput,
  UpdateCdrrmoOfficialInput
} from '@/types/cdrrmo';

// ─── CDRRMO Officials ────────────────────────────────────────────────────────

export async function getCdrrmoOfficials(): Promise<CdrrmoOfficial[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('cdrrmo_officials')
    .select('*')
    .order('last_name', { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as CdrrmoOfficial[];
}

export async function createCdrrmoOfficial(
  input: CreateCdrrmoOfficialInput
): Promise<CdrrmoOfficial> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('cdrrmo_officials')
    .insert({ ...input, is_active: input.is_active ?? true })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as CdrrmoOfficial;
}

export async function updateCdrrmoOfficial(
  id: string,
  input: UpdateCdrrmoOfficialInput
): Promise<CdrrmoOfficial> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('cdrrmo_officials')
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as CdrrmoOfficial;
}

export async function deleteCdrrmoOfficial(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('cdrrmo_officials')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
}

export async function toggleCdrrmoOfficialStatus(
  id: string,
  isActive: boolean
): Promise<CdrrmoOfficial> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('cdrrmo_officials')
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
  return data as CdrrmoOfficial;
}

export async function isCdrrmoEmailUnique(
  email: string,
  excludeId?: string
): Promise<boolean> {
  const supabase = await createClient();
  let query = supabase
    .from('cdrrmo_officials')
    .select('id')
    .eq('email', email);

  if (excludeId) {
    query = query.neq('id', excludeId);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []).length === 0;
}
