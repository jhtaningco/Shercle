import { SupabaseClient } from '@supabase/supabase-js';
import { SOSAlertWithDetails, SOSRemarkWithAuthor, SOSStatus } from '@/types/cdrrmo-sos';

export async function getActiveSOSAlerts(supabase: SupabaseClient): Promise<SOSAlertWithDetails[]> {
  const { data, error } = await supabase
    .from('sos_alerts')
    .select(`
      *,
      profiles:citizen_id(first_name, last_name, email, role),
      barangays:barangay_id(name, contact_number)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching active SOS alerts:', error);
    return [];
  }

  return data as unknown as SOSAlertWithDetails[];
}

export async function getSOSRemarks(supabase: SupabaseClient, sosId: string): Promise<SOSRemarkWithAuthor[]> {
  const { data, error } = await supabase
    .from('sos_remarks')
    .select(`
      *,
      profiles:author_id(first_name, last_name, role)
    `)
    .eq('sos_id', sosId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching SOS remarks:', error);
    return [];
  }

  return data as unknown as SOSRemarkWithAuthor[];
}

export async function updateSOSStatus(supabase: SupabaseClient, sosId: string, status: SOSStatus) {
  const { data, error } = await supabase
    .from('sos_alerts')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', sosId)
    .select()
    .single();

  if (error) {
    console.error('Error updating SOS status:', error);
    throw error;
  }
  return data;
}

export async function updateSOSLegitimacy(supabase: SupabaseClient, sosId: string, is_legit: boolean) {
  const { data, error } = await supabase
    .from('sos_alerts')
    .update({ is_legit, updated_at: new Date().toISOString() })
    .eq('id', sosId)
    .select()
    .single();

  if (error) {
    console.error('Error updating SOS legitimacy:', error);
    throw error;
  }
  return data;
}

export async function addSOSRemark(supabase: SupabaseClient, sosId: string, authorId: string, remark: string) {
  const { data, error } = await supabase
    .from('sos_remarks')
    .insert([
      {
        sos_id: sosId,
        author_id: authorId,
        remark: remark
      }
    ])
    .select()
    .single();

  if (error) {
    console.error('Error adding SOS remark:', error);
    throw error;
  }
  return data;
}
