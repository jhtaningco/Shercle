// c:\Users\Gian Adoc\Documents\e-gov\Shercle\web\src\lib\supabase\cdrrmo-sos.ts
import { SupabaseClient } from '@supabase/supabase-js';
import { SOSAlertWithDetails, SOSRemarkWithAuthor, SOSStatus } from '@/types/cdrrmo-sos';

export async function getActiveSOSAlerts(supabase: SupabaseClient): Promise<SOSAlertWithDetails[]> {
  const { data, error } = await supabase
    .from('sos_alerts')
    .select(`
      *,
      profiles:citizen_id(first_name, last_name, email),
      barangays:barangay_id(name, contact_number)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching active SOS alerts:', error);
    return [];
  }

  // Augment with roles from user_roles
  const citizenIds = Array.from(new Set(data.map(r => r.citizen_id)));
  if (citizenIds.length > 0) {
    const { data: rolesData } = await supabase
      .from('user_roles')
      .select('auth_user_id, role')
      .in('auth_user_id', citizenIds);
      
    const roleMap = Object.fromEntries(
      (rolesData || []).map(r => [r.auth_user_id, r.role])
    );
    
    data.forEach(r => {
      if (r.profiles) {
        (r.profiles as any).role = roleMap[r.citizen_id] || 'citizen';
      }
    });
  }

  return data as unknown as SOSAlertWithDetails[];
}

export async function getSOSRemarks(supabase: SupabaseClient, sosId: string): Promise<SOSRemarkWithAuthor[]> {
  const { data, error } = await supabase
    .from('sos_remarks')
    .select(`
      *,
      profiles:author_id(first_name, last_name)
    `)
    .eq('sos_id', sosId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching SOS remarks:', error);
    return [];
  }

  // Augment with roles from user_roles
  const authorIds = Array.from(new Set(data.map(r => r.author_id)));
  if (authorIds.length > 0) {
    const { data: rolesData } = await supabase
      .from('user_roles')
      .select('auth_user_id, role')
      .in('auth_user_id', authorIds);
      
    const roleMap = Object.fromEntries(
      (rolesData || []).map(r => [r.auth_user_id, r.role])
    );
    
    data.forEach(r => {
      if (r.profiles) {
        (r.profiles as any).role = roleMap[r.author_id] || 'citizen';
      }
    });
  }

  return data as unknown as SOSRemarkWithAuthor[];
}

// REMOVED: CDRRMO cannot update SOS status/legit — view only
// Removed updateSOSStatus, updateSOSLegitimacy, and addSOSRemark
