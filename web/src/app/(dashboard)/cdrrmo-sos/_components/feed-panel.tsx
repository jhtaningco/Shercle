'use client';

import { useState } from 'react';
import { SOSAlertWithDetails, SOSStatus } from '@/types/cdrrmo-sos';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface FeedPanelProps {
  alerts: SOSAlertWithDetails[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

type FilterTab = 'all' | SOSStatus;

export default function FeedPanel({ alerts, selectedId, onSelect }: FeedPanelProps) {
  const [filter, setFilter] = useState<FilterTab>('all');

  // Ensure active alerts always bubble up to the top, then sort by date desc
  const sortedAlerts = [...alerts].sort((a, b) => {
      if (a.status === 'active' && b.status !== 'active') return -1;
      if (a.status !== 'active' && b.status === 'active') return 1;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const filteredAlerts = sortedAlerts.filter(a => {
      if (filter === 'all') return true;
      return a.status === filter;
  });

  const getStatusBadge = (status: SOSStatus) => {
      switch(status) {
          case 'active':
             return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200"><span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse mr-1" /> Active</Badge>;
          case 'ongoing':
             return <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200">Ongoing</Badge>;
          case 'resolved':
             return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Resolved</Badge>;
          case 'bogus':
             return <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">Bogus</Badge>;
      }
  };

  const getLegitBadge = (is_legit: boolean | null) => {
      if (is_legit === true) return <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-100">Legit</span>;
      if (is_legit === false) return <span className="text-xs font-medium text-gray-600 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">Bogus</span>;
      return <span className="text-xs font-medium text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded border border-yellow-100">Unverified</span>;
  }

  const tabs: { label: string; value: FilterTab }[] = [
    { label: 'All', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Ongoing', value: 'ongoing' },
    { label: 'Resolved', value: 'resolved' },
    { label: 'Bogus', value: 'bogus' }
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Filters */}
      <div className="p-3 border-b flex gap-2 overflow-x-auto no-scrollbar shrink-0">
         {tabs.map(tab => (
            <button
               key={tab.value}
               onClick={() => setFilter(tab.value)}
               className={`px-3 py-1.5 text-sm rounded-full whitespace-nowrap transition-colors ${
                  filter === tab.value 
                  ? 'bg-primary text-primary-foreground font-medium' 
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
               }`}
            >
               {tab.label}
            </button>
         ))}
      </div>

      {/* Feed List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
         {filteredAlerts.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">
               No alerts found in this category.
            </div>
         ) : (
            filteredAlerts.map(alert => (
               <div 
                  key={alert.id}
                  onClick={() => onSelect(alert.id)}
                  className={`
                     p-4 rounded-lg border cursor-pointer transition-all hover:shadow-sm
                     ${selectedId === alert.id ? 'bg-primary/5 border-primary shadow-sm' : 'bg-card hover:bg-accent/50'}
                  `}
               >
                  <div className="flex justify-between items-start mb-2">
                     <div className="font-semibold text-sm truncate pr-2">
                        {alert.profiles?.first_name} {alert.profiles?.last_name}
                     </div>
                     <div className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatDistanceToNow(new Date(alert.created_at), { addSuffix: true })}
                     </div>
                  </div>
                  
                  <div className="text-sm text-muted-foreground mb-3 truncate">
                     📍 {alert.address || alert.barangays?.name || `${alert.latitude.toFixed(4)}, ${alert.longitude.toFixed(4)}`}
                  </div>

                  <div className="flex items-center justify-between">
                     <div className="flex gap-2 items-center">
                         {getStatusBadge(alert.status)}
                         {getLegitBadge(alert.is_legit)}
                     </div>
                  </div>
               </div>
            ))
         )}
      </div>
    </div>
  );
}
