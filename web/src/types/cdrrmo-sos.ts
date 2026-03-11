export type SOSStatus = 'active' | 'ongoing' | 'resolved' | 'bogus';

export interface SOSAlert {
  id: string;
  citizen_id: string;
  barangay_id: string;
  latitude: number;
  longitude: number;
  address: string | null;
  is_legit: boolean | null;
  status: SOSStatus;
  created_at: string;
  updated_at: string;
}

export interface SOSRemark {
  id: string;
  sos_id: string;
  author_id: string;
  remark: string;
  created_at: string;
}

// Joined types for UI display
export interface SOSAlertWithDetails extends SOSAlert {
  profiles: {
    first_name: string;
    last_name: string;
    email: string;
    role: string;
  };
  barangays: {
    name: string;
    contact_number: string | null;
  };
}

export interface SOSRemarkWithAuthor extends SOSRemark {
  profiles: {
    first_name: string;
    last_name: string;
    role: string;
  };
}
