// Types for Barangay Officials Management

export interface District {
  id: string;
  district_number: number;
  city_municipality: string;
  province: string;
  is_active: boolean;
  created_at: string;
  barangays?: Barangay[];
}

export interface Barangay {
  id: string;
  name: string;
  district_id: string;
  city_municipality: string;
  province: string;
  zip_code?: string;
  latitude?: number;
  longitude?: number;
  contact_number?: string;
  is_active: boolean;
  created_at: string;
  district?: District;
}

export type OfficialRole = 'captain';

export interface BarangayOfficial {
  id: string;
  barangay_id: string;
  auth_user_id?: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  role: OfficialRole;
  email: string;
  contact_number: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  barangay?: Barangay;
}

export interface CreateOfficialInput {
  barangay_id: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  role: OfficialRole;
  email: string;
  contact_number: string;
  is_active?: boolean;
}

export type UpdateOfficialInput = Partial<CreateOfficialInput>;
