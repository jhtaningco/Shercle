export interface Comment {
  id: string;
  author: string;
  role: 'barangay' | 'user';
  message: string;
  timestamp: string;
  isResolveTrigger?: boolean;
}

export interface Report {
  id: string;
  title: string;
  description: string;
  incidentType: string;
  otherIncidentType?: string;
  location: string;
  useCurrentLocation: boolean;
  date: string;        // display string e.g. "Mar 7, 2026 – 5:00 PM"
  rawDate: Date;
  status: 'pending' | 'resolved';
  mediaCount: number;
  thumbnails?: string[];
  comments: Comment[];
  icon: string;        // ionicons name
}
