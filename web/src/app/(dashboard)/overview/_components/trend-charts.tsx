'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, Cell,
  PieChart, Pie
} from 'recharts';

interface Props {
  data: { sos: any[]; complaints: any[]; incidents: any[] };
}

export default function TrendCharts({ data }: Props) {
  
  // 1. Cases Over Time (Group by YYYY-MM-DD for simplicity)
  const timelineData = useMemo(() => {
    const dates = new Set<string>();
    const map = new Map<string, { date: string, sos: number, complaints: number, incidents: number }>();
    
    const addToMap = (dateStr: string, type: 'sos' | 'complaints' | 'incidents') => {
      if (!dateStr) return;
      const date = dateStr.split('T')[0];
      dates.add(date);
      if (!map.has(date)) {
        map.set(date, { date, sos: 0, complaints: 0, incidents: 0 });
      }
      map.get(date)![type]++;
    };

    data.sos.forEach(x => addToMap(x.created_at, 'sos'));
    data.complaints.forEach(x => addToMap(x.created_at, 'complaints'));
    data.incidents.forEach(x => addToMap(x.created_at, 'incidents'));

    return Array.from(map.values()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [data]);

  // 2. Resolution Rate Over Time (Group by YYYY-MM-DD)
  const resolutionTimelineData = useMemo(() => {
      const map = new Map<string, { date: string, total: number, resolved: number }>();
      
      const addToMap = (item: any) => {
        if (!item.created_at) return;
        const date = item.created_at.split('T')[0];
        if (!map.has(date)) {
          map.set(date, { date, total: 0, resolved: 0 });
        }
        const record = map.get(date)!;
        record.total++;
        if (item.status?.toLowerCase() === 'resolved') {
          record.resolved++;
        }
      };
      
      data.sos.forEach(addToMap);
      data.complaints.forEach(addToMap);
      data.incidents.forEach(addToMap);

      return Array.from(map.values())
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map(x => ({
          date: x.date,
          rate: x.total > 0 ? Number(((x.resolved / x.total) * 100).toFixed(1)) : 0
        }));
  }, [data]);

  // 3 & 4. Categories Breakdown
  const compCatColors: Record<string, string> = {
    'Domestic Violence': '#ef4444',
    'Physical Abuse': '#f97316',
    'Sexual Harassment': '#ec4899',
    'Child Abuse': '#a855f7',
    'Elder Abuse': '#eab308',
    'Stalking/Threat': '#991b1b',
    'Psychological Abuse': '#6366f1',
    'Other': '#6b7280'
  };

  const incCatColors: Record<string, string> = {
    'Accident': '#f97316',
    'Medical Emergency': '#ef4444',
    'Fire': '#ea580c',
    'Natural Disaster': '#92400e',
    'Criminal Activity': '#7f1d1d',
    'Other': '#6b7280'
  };

  const getCategoryData = (items: any[], colors: Record<string, string>) => {
    const map = new Map<string, number>();
    items.forEach(x => {
        if (!x.category) return;
        map.set(x.category, (map.get(x.category) || 0) + 1);
    });
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value, fill: colors[name] || '#6b7280' }))
      .sort((a, b) => b.value - a.value);
  };

  const complaintsCats = getCategoryData(data.complaints, compCatColors);
  const incidentsCats = getCategoryData(data.incidents, incCatColors);

  // 5. Gender
  const genderData = useMemo(() => {
     const counts: Record<string, number> = { male: 0, female: 0, 'non-binary': 0, other: 0, 'prefer not to say': 0 };
     const countGender = (items: any[]) => {
         items.forEach(x => {
            const g = (x.profiles?.gender || '').toLowerCase();
            if (g in counts) counts[g]++;
         });
     };
     countGender(data.complaints);
     countGender(data.incidents);

     return [
       { name: 'Male', value: counts['male'], fill: '#3b82f6' },
       { name: 'Female', value: counts['female'], fill: '#ec4899' },
       { name: 'Non-Binary', value: counts['non-binary'], fill: '#a855f7' },
       { name: 'Other', value: counts['other'], fill: '#f97316' },
       { name: 'Prefer Not to Say', value: counts['prefer not to say'], fill: '#6b7280' }
     ].filter(d => d.value > 0); // Only show slices with data
  }, [data]);

  const hasGenderData = genderData.length > 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Cases Over Time */}
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle>Cases Over Time</CardTitle>
          <CardDescription>Daily volume of emergency and incident reports</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tick={{fontSize: 12}} />
              <YAxis tick={{fontSize: 12}} />
              <Tooltip />
              <Legend />
              <Line type="monotone" name="SOS Alerts" dataKey="sos" stroke="#ef4444" strokeWidth={2} dot={false} />
              <Line type="monotone" name="Complaints" dataKey="complaints" stroke="#3b82f6" strokeWidth={2} dot={false} />
              <Line type="monotone" name="Incident Reports" dataKey="incidents" stroke="#f97316" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Complaint Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Complaint Categories</CardTitle>
        </CardHeader>
        <CardContent className="h-[250px]">
          {complaintsCats.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={complaintsCats} layout="vertical" margin={{ left: 40, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 11}} />
                <Tooltip />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                   {complaintsCats.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={entry.fill} />
                   ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
             <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground">No data available</div>
          )}
        </CardContent>
      </Card>

      {/* Incident Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Incident Categories</CardTitle>
        </CardHeader>
        <CardContent className="h-[250px]">
           {incidentsCats.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={incidentsCats} layout="vertical" margin={{ left: 40, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 11}} />
                <Tooltip />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                   {incidentsCats.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={entry.fill} />
                   ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
             <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground">No data available</div>
          )}
        </CardContent>
      </Card>

      {/* Resolution Rate */}
      <Card>
        <CardHeader>
          <CardTitle>Resolution Rate (%)</CardTitle>
        </CardHeader>
        <CardContent className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={resolutionTimelineData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tick={{fontSize: 12}} />
              <YAxis tick={{fontSize: 12}} domain={[0, 100]} />
              <Tooltip formatter={(value: number) => [`${value}%`, 'Current Rate']} />
              <Line type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gender Profile */}
      <Card>
        <CardHeader>
          <CardTitle>Complainant/Reporter Demographics</CardTitle>
        </CardHeader>
        <CardContent className="h-[250px]">
           {hasGenderData ? (
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip formatter={(value: number, name: string) => [value, name]} />
                  <Legend />
                  <Pie
                    data={genderData}
                    cx="50%"
                    cy="45%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label
                  >
                    {genderData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
             </ResponsiveContainer>
           ) : (
              <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground">No data available</div>
           )}
        </CardContent>
      </Card>
    </div>
  );
}
