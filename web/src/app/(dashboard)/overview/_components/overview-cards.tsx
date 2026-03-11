'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, AlertTriangle, FileWarning, Target, CheckCircle2, ShieldAlert } from 'lucide-react';

interface Props {
  data: { sos: any[]; complaints: any[]; incidents: any[] };
  previousData?: any; // To be implemented later optionally
}

export default function OverviewCards({ data }: Props) {
  const totalSOS = data.sos.length;
  const totalComplaints = data.complaints.length;
  const totalIncidents = data.incidents.length;

  const totalCases = totalSOS + totalComplaints + totalIncidents;

  // Derived: Active/Ongoing
  const activeSOS = data.sos.filter(x => ['active', 'ongoing'].includes(x.status?.toLowerCase())).length;
  const activeComplaints = data.complaints.filter(x => ['pending', 'ongoing'].includes(x.status?.toLowerCase())).length;
  const activeIncidents = data.incidents.filter(x => ['pending', 'ongoing'].includes(x.status?.toLowerCase())).length;
  const totalActive = activeSOS + activeComplaints + activeIncidents;

  // Derived: Resolution Rate
  const resolvedSOS = data.sos.filter(x => x.status?.toLowerCase() === 'resolved').length;
  const resolvedComplaints = data.complaints.filter(x => x.status?.toLowerCase() === 'resolved').length;
  const resolvedIncidents = data.incidents.filter(x => x.status?.toLowerCase() === 'resolved').length;
  
  const totalResolved = resolvedSOS + resolvedComplaints + resolvedIncidents;
  const resolutionRate = totalCases > 0 ? ((totalResolved / totalCases) * 100).toFixed(1) : '0.0';

  // Derived: Legit Rate (SOS + Complaints)
  let legitCount = 0;
  let classifiedCount = 0;

  data.sos.forEach(x => {
    if (x.is_legit !== null) {
      classifiedCount++;
      if (x.is_legit) legitCount++;
    } else if (x.status?.toLowerCase() === 'bogus') { // Some older records might just use bogus status
      classifiedCount++;
    }
  });

  data.complaints.forEach(x => {
    if (x.is_legit !== null) {
      classifiedCount++;
      if (x.is_legit) legitCount++;
    }
  });

  const legitRate = classifiedCount > 0 ? ((legitCount / classifiedCount) * 100).toFixed(1) : '—';

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total SOS Alerts</CardTitle>
          <AlertTriangle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalSOS}</div>
          <p className="text-xs text-muted-foreground pt-1 flex items-center gap-1">
             <span className="text-emerald-500">↑</span> Active tracking
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Complaints</CardTitle>
          <FileWarning className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalComplaints}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Incident Reports</CardTitle>
          <Activity className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalIncidents}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active / Ongoing</CardTitle>
          <Target className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalActive}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{resolutionRate}%</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Legit Rate</CardTitle>
          <ShieldAlert className="h-4 w-4 text-sky-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{legitRate}{legitRate !== '—' ? '%' : ''}</div>
        </CardContent>
      </Card>
    </div>
  );
}
