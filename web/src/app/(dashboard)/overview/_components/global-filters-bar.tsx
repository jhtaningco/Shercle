'use client';

import { GlobalFilters } from '@/lib/supabase/analytics';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
// Fallback to basic if not present, but we will use standard Select for now, or just Checkboxes for multi-select.

interface Props {
  filters: GlobalFilters;
  onChange: (filters: GlobalFilters) => void;
  barangays: any[];
}

export default function GlobalFiltersBar({ filters, onChange, barangays }: Props) {
  const handleDateChange = (type: 'startDate' | 'endDate', val: string) => {
    onChange({
      ...filters,
      dateRange: { ...filters.dateRange, [type]: val }
    });
  };

  const handleCaseTypeToggle = (type: string) => {
    let newTypes = [...filters.caseType];
    if (type === 'All') {
      newTypes = ['All'];
    } else {
      newTypes = newTypes.filter(t => t !== 'All');
      if (newTypes.includes(type)) {
        newTypes = newTypes.filter(t => t !== type);
      } else {
        newTypes.push(type);
      }
      if (newTypes.length === 0) newTypes = ['All'];
    }
    onChange({ ...filters, caseType: newTypes });
  };

  return (
    <Card className="sticky top-0 z-10 w-full rounded-md bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        
        {/* Date Range */}
        <div className="flex flex-col gap-2">
          <Label>Date Range</Label>
          <div className="flex items-center gap-2">
            <Input 
              type="date" 
              value={filters.dateRange.startDate.split('T')[0]} 
              onChange={(e) => handleDateChange('startDate', new Date(e.target.value).toISOString())}
              className="h-9 px-2 text-xs"
            />
            <span className="text-muted-foreground">-</span>
            <Input 
              type="date" 
              value={filters.dateRange.endDate.split('T')[0]} 
              onChange={(e) => handleDateChange('endDate', new Date(e.target.value).toISOString())}
              className="h-9 px-2 text-xs"
            />
          </div>
        </div>

        {/* Case Type Multi-Selection Buttons */}
        <div className="flex flex-col gap-2">
          <Label>Case Type (Toggle)</Label>
          <div className="flex gap-1 flex-wrap">
             {['All', 'SOS', 'Complaints', 'Incident Reports'].map((type) => (
                <button
                  key={type}
                  onClick={() => handleCaseTypeToggle(type)}
                  className={`px-2 py-1 text-xs border rounded-md transition-colors ${
                    filters.caseType.includes(type) 
                      ? 'bg-primary text-primary-foreground border-primary' 
                      : 'bg-background hover:bg-muted'
                  }`}
                >
                  {type === 'Incident Reports' ? 'Incidents' : type}
                </button>
             ))}
          </div>
        </div>

        {/* Category */}
        <div className="flex flex-col gap-2">
          <Label>Category</Label>
          <Select 
            value={filters.category} 
            onValueChange={(val) => onChange({ ...filters, category: val })}
            disabled={filters.caseType.includes('SOS') || filters.caseType.includes('All')}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              <SelectItem value="Domestic Violence">Domestic Violence</SelectItem>
              <SelectItem value="Physical Abuse">Physical Abuse</SelectItem>
              <SelectItem value="Sexual Harassment">Sexual Harassment</SelectItem>
              <SelectItem value="Child Abuse">Child Abuse</SelectItem>
              <SelectItem value="Elder Abuse">Elder Abuse</SelectItem>
              <SelectItem value="Stalking/Threat">Stalking/Threat</SelectItem>
              <SelectItem value="Accident">Accident</SelectItem>
              <SelectItem value="Medical Emergency">Medical Emergency</SelectItem>
              <SelectItem value="Fire">Fire</SelectItem>
              <SelectItem value="Natural Disaster">Natural Disaster</SelectItem>
              <SelectItem value="Criminal Activity">Criminal Activity</SelectItem>
              <SelectItem value="Psychological Abuse">Psychological Abuse</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Barangay */}
        <div className="flex flex-col gap-2">
          <Label>Barangay</Label>
          <Select 
            value={filters.barangay} 
            onValueChange={(val) => onChange({ ...filters, barangay: val })}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="All Barangays" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Barangays</SelectItem>
              {barangays.map(b => (
                <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Gender */}
        <div className="flex flex-col gap-2">
          <Label>Gender</Label>
          <Select 
            value={filters.gender} 
            onValueChange={(val) => onChange({ ...filters, gender: val })}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="All Genders" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Genders</SelectItem>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Non-Binary">Non-Binary</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
              <SelectItem value="Prefer Not to Say">Prefer Not to Say</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status */}
        <div className="flex flex-col gap-2">
          <Label>Status</Label>
          <Select 
            value={filters.status} 
            onValueChange={(val) => onChange({ ...filters, status: val })}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Statuses</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Ongoing">Ongoing</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Resolved">Resolved</SelectItem>
              <SelectItem value="Dismissed">Dismissed</SelectItem>
              <SelectItem value="Bogus">Bogus (SOS)</SelectItem>
            </SelectContent>
          </Select>
        </div>

      </CardContent>
    </Card>
  );
}
