// Types for CSWD Officials Management

export type CswdOfficialRole = 'social_worker' | 'staff';
export type OfficialStatus = 'pending' | 'active' | 'inactive';

export interface CswdOfficial {
  id: string;
  auth_user_id?: string | null;
  first_name: string;
  last_name: string;
  middle_name?: string | null;
  role: CswdOfficialRole;
  email: string;
  contact_number: string;
  status: OfficialStatus;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateCswdOfficialInput {
  auth_user_id?: string | null;
  first_name: string;
  last_name: string;
  middle_name?: string;
  role: CswdOfficialRole;
  email: string;
  contact_number: string;
  status?: OfficialStatus;
  is_active?: boolean;
}

export type UpdateCswdOfficialInput = Partial<CreateCswdOfficialInput>;
