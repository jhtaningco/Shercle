// Types for CDRRMO Officials Management

export type CdrrmoOfficialRole = 'officer' | 'staff';
export type OfficialStatus = 'pending' | 'active' | 'inactive';

export interface CdrrmoOfficial {
  id: string;
  auth_user_id?: string | null;
  first_name: string;
  last_name: string;
  middle_name?: string | null;
  role: CdrrmoOfficialRole;
  email: string;
  contact_number: string;
  status: OfficialStatus;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateCdrrmoOfficialInput {
  auth_user_id?: string | null;
  first_name: string;
  last_name: string;
  middle_name?: string;
  role: CdrrmoOfficialRole;
  email: string;
  contact_number: string;
  status?: OfficialStatus;
  is_active?: boolean;
}

export type UpdateCdrrmoOfficialInput = Partial<CreateCdrrmoOfficialInput>;
