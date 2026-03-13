import { SupabaseClient } from '@supabase/supabase-js';

export type DateRange = {
  startDate: string;
  endDate: string;
};

export type GlobalFilters = {
  dateRange: DateRange;
  caseType: string[]; // ['All'], ['SOS', 'Complaints'], etc.
  category: string; // 'All' or specific category
  barangay: string; // 'All' or specific barangay id
  gender: string; // 'All', 'Male', 'Female'
  status: string; // 'All', 'Pending', 'Ongoing', 'Resolved', 'Dismissed', 'Bogus'
};

export async function getAnalyticsData(supabase: SupabaseClient, filters: GlobalFilters) {
  const { dateRange, caseType, category, barangay, gender, status } = filters;
  
  const fetchSOS = caseType.includes('All') || caseType.includes('SOS');
  const fetchComplaints = caseType.includes('All') || caseType.includes('Complaints');
  const fetchIncidents = caseType.includes('All') || caseType.includes('Incident Reports');

  let sosQuery = supabase
      .from('sos_alerts')
      .select('id, status, is_legit, created_at, barangay_id, citizen_id, profiles!citizen_id ( gender )')
      .gte('created_at', dateRange.startDate)
      .lte('created_at', dateRange.endDate);

  let complaintsQuery = supabase
      .from('complaints')
      .select('id, category, status, is_legit, created_at, barangay_id, complainant_id, profiles!complainant_id ( gender )')
      .gte('created_at', dateRange.startDate)
      .lte('created_at', dateRange.endDate);

  let incidentsQuery = supabase
      .from('incident_reports')
      .select('id, category, status, created_at, barangay_id, reporter_id, profiles!reporter_id ( gender )')
      .gte('created_at', dateRange.startDate)
      .lte('created_at', dateRange.endDate);

  // Apply filters
  if (barangay !== 'All') {
    sosQuery = sosQuery.eq('barangay_id', barangay);
    complaintsQuery = complaintsQuery.eq('barangay_id', barangay);
    incidentsQuery = incidentsQuery.eq('barangay_id', barangay);
  }

  if (status !== 'All') {
    sosQuery = sosQuery.eq('status', status.toLowerCase());
    complaintsQuery = complaintsQuery.eq('status', status.toLowerCase());
    incidentsQuery = incidentsQuery.eq('status', status.toLowerCase());
  }

  if (category !== 'All') {
    // Only applied to complaints and incidents, SOS doesn't have a category
    complaintsQuery = complaintsQuery.eq('category', category);
    incidentsQuery = incidentsQuery.eq('category', category);
  }

  // Execute queries in parallel
  const [sosRes, complaintsRes, incidentsRes] = await Promise.all([
    fetchSOS ? sosQuery : Promise.resolve({ data: [], error: null }),
    fetchComplaints ? complaintsQuery : Promise.resolve({ data: [], error: null }),
    fetchIncidents ? incidentsQuery : Promise.resolve({ data: [], error: null })
  ]);

  if (sosRes.error) console.error("SOS Fetch Error:", sosRes.error);
  if (complaintsRes.error) console.error("Complaints Fetch Error:", complaintsRes.error);
  if (incidentsRes.error) console.error("Incidents Fetch Error:", incidentsRes.error);

  const filterByGender = (item: any) => {
    if (gender === 'All') return true;
    // Suppress if gender filter applied to SOS, or we just rely on standard M/F matching
    const itemGender = item.profiles?.gender?.toLowerCase();
    return itemGender === gender.toLowerCase();
  };

  return {
    sos: (sosRes.data || []).filter(filterByGender),
    complaints: (complaintsRes.data || []).filter(filterByGender),
    incidents: (incidentsRes.data || []).filter(filterByGender)
  };
}

export async function getAnalyticsBarangays(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from('barangays')
    .select('id, name, latitude, longitude, districts!district_id ( district_number )')
    .eq('is_active', true);

  if (error) {
    console.error("Barangay Fetch Error:", error);
    return [];
  }
  
  // Transform the response so district_number is flat and easy to access
  return data.map((b: any) => ({
    id: b.id,
    name: b.name,
    latitude: b.latitude,
    longitude: b.longitude,
    district_number: b.districts?.district_number
  }));
}
