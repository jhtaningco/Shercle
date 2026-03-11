import { createClient } from '@/lib/supabase-server';
import type { Complaint, IncidentReport, CaseStatus } from '@/types/inbox';

// --- Complaints ---

export async function getInboxComplaints(): Promise<Complaint[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('complaints')
    .select(`
      *,
      profiles!complaints_complainant_id_fkey (*),
      complaint_conversations (
        id,
        created_at,
        complaint_messages (*)
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching complaints:', error);
    throw new Error(error.message);
  }
  return (data ?? []) as unknown as Complaint[];
}

export async function updateComplaintStatus(id: string, status: CaseStatus): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('complaints')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) throw new Error(error.message);
}

// --- Incident Reports ---

export async function getInboxIncidentReports(): Promise<IncidentReport[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('incident_reports')
    .select(`
      *,
      profiles!incident_reports_reporter_id_fkey (*),
      incident_conversations (
        id,
        created_at,
        incident_messages (*)
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching incident reports:', error);
    throw new Error(error.message);
  }
  return (data ?? []) as unknown as IncidentReport[];
}

export async function updateIncidentReportStatus(id: string, status: CaseStatus): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('incident_reports')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) throw new Error(error.message);
}
