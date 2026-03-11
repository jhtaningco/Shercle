export type CaseStatus = 'pending' | 'ongoing' | 'resolved' | 'dismissed';

export type ComplaintCategory = 
  | 'Domestic Violence'
  | 'Physical Abuse'
  | 'Sexual Harassment'
  | 'Child Abuse'
  | 'Elder Abuse'
  | 'Stalking/Threat'
  | 'Psychological Abuse'
  | 'Other';

export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: 'citizen' | 'cswd' | 'barangay' | 'cdrrmo' | 'cicto';
}

export interface ComplaintMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  message: string;
  is_read: boolean;
  created_at: string;
  profiles?: Profile;
}

export interface ComplaintConversation {
  id: string;
  complaint_id: string;
  created_at: string;
  complaint_messages?: ComplaintMessage[];
}

export interface Complaint {
  id: string;
  complainant_id: string;
  respondent_name: string | null;
  category: ComplaintCategory;
  description: string;
  incident_date: string | null;
  barangay_id: string;
  is_legit: boolean | null;
  status: CaseStatus;
  created_at: string;
  updated_at: string;
  
  profiles?: Profile;
  complaint_conversations?: ComplaintConversation[];
}

export type IncidentCategory = 
  | 'Accident'
  | 'Medical Emergency'
  | 'Fire'
  | 'Natural Disaster'
  | 'Criminal Activity'
  | 'Other';

export interface IncidentMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  message: string;
  is_read: boolean;
  created_at: string;
  profiles?: Profile;
}

export interface IncidentConversation {
  id: string;
  incident_report_id: string;
  created_at: string;
  incident_messages?: IncidentMessage[];
}

export interface IncidentReport {
  id: string;
  reporter_id: string;
  category: IncidentCategory;
  description: string;
  photo_url: string;
  latitude: number;
  longitude: number;
  address: string | null;
  barangay_id: string;
  status: CaseStatus;
  created_at: string;
  updated_at: string;
  
  profiles?: Profile;
  incident_conversations?: IncidentConversation[];
}
