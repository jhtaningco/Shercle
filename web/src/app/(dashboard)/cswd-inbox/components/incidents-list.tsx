'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { IncidentReport, IncidentMessage } from '@/types/inbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { StatusBadge, IncidentCategoryBadge } from './badges';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface IncidentsListProps {
  selectedId: string | null;
  onSelect: (report: IncidentReport) => void;
}

export function IncidentsList({ selectedId, onSelect }: IncidentsListProps) {
  const [reports, setReports] = useState<IncidentReport[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchReports();

    // Subscribe to new reports
    const reportsSub = supabase
      .channel('public:incident_reports')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'incident_reports' },
        (payload) => {
          fetchReports(); 
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'incident_reports' },
        (payload) => {
          fetchReports();
        }
      )
      .subscribe();

    // Subscribe to new messages
    const messagesSub = supabase
      .channel('public:incident_messages_list')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'incident_messages' },
        (payload) => {
          fetchReports(); 
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(reportsSub);
      supabase.removeChannel(messagesSub);
    };
  }, []);

  async function fetchReports() {
    const { data, error } = await supabase
      .from('incident_reports')
      .select(`
        *,
        profiles!incident_reports_reporter_id_fkey (*),
        incident_conversations (
          id,
          created_at,
          incident_messages (*)
        )
      `)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setReports(data as unknown as IncidentReport[]);
    }
    setLoading(false);
  }

  if (loading) {
    return <div className="p-4">Loading reports...</div>;
  }

  return (
    <ScrollArea className="flex-1">
      <div className="flex flex-col">
        {reports.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">No incident reports found.</div>
        ) : (
          reports.map((report) => {
            const conversations = report.incident_conversations || [];
            const conversation = conversations.length > 0 ? conversations[0] : null;
            const messages = conversation?.incident_messages || [];
            
            // Sort messages to get the latest
            const sortedMessages = [...messages].sort((a, b) => 
              new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );
            
            const lastMessage = sortedMessages[0];
            const hasUnread = sortedMessages.some(m => !m.is_read && m.sender_id === report.reporter_id);
            
            const profile = report.profiles;
            const initials = profile ? `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase() : '??';

            return (
              <div
                key={report.id}
                onClick={() => onSelect(report)}
                className={cn(
                  "flex gap-3 p-4 border-b cursor-pointer transition-colors hover:bg-muted/50",
                  selectedId === report.id ? "bg-muted" : ""
                )}
              >
                {report.photo_url ? (
                  <div className="h-12 w-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
                    <img src={report.photo_url} alt="Incident" className="h-full w-full object-cover" />
                  </div>
                ) : (
                  <Avatar className="h-12 w-12 rounded-md flex-shrink-0">
                    <AvatarFallback className="rounded-md">{initials}</AvatarFallback>
                  </Avatar>
                )}
                
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <span className="font-semibold text-sm truncate pr-2">
                       {profile ? `${profile.first_name} ${profile.last_name}` : 'Unknown Reporter'}
                    </span>
                    {hasUnread && (
                      <div className="h-2.5 w-2.5 rounded-full bg-blue-600 mt-1 flex-shrink-0"></div>
                    )}
                  </div>
                  
                  <span className="text-xs text-muted-foreground mb-1">
                    {formatDistanceToNow(new Date(report.created_at), { addSuffix: true })}
                  </span>
                  
                  <div className="flex flex-wrap gap-2 mt-0.5">
                    <IncidentCategoryBadge category={report.category} />
                    <StatusBadge status={report.status} />
                  </div>
                  
                  {lastMessage && (
                    <p className="text-sm text-muted-foreground line-clamp-1 mt-1.5">
                      {lastMessage.sender_id === report.reporter_id ? '' : 'You: '}
                      {lastMessage.message}
                    </p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </ScrollArea>
  );
}
