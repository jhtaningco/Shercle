'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Complaint, ComplaintMessage } from '@/types/inbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { StatusBadge, ComplaintCategoryBadge } from './badges';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface ComplaintsListProps {
  selectedId: string | null;
  onSelect: (complaint: Complaint) => void;
}

export function ComplaintsList({ selectedId, onSelect }: ComplaintsListProps) {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchComplaints();

    // Subscribe to new complaints
    const complaintsSub = supabase
      .channel('public:complaints')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'complaints' },
        (payload) => {
          fetchComplaints(); // Refetch to get joined data, or insert directly
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'complaints' },
        (payload) => {
          fetchComplaints(); // Fast way to update statuses
        }
      )
      .subscribe();

    // Subscribe to new messages mapped to conversations to update unread dots
    const messagesSub = supabase
      .channel('public:complaint_messages_list')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'complaint_messages' },
        (payload) => {
          fetchComplaints(); // Simple approach: refetch to update the latest message and unread count
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(complaintsSub);
      supabase.removeChannel(messagesSub);
    };
  }, []);

  async function fetchComplaints() {
    const { data, error } = await supabase
      .from('complaints')
      .select(`
        *,
        profiles!complaints_complainant_id_fkey (*),
        complaint_conversations (
          id,
          created_at,
          complaint_messages (*)
        )
      `)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setComplaints(data as unknown as Complaint[]);
    }
    setLoading(false);
  }

  if (loading) {
    return <div className="p-4">Loading complaints...</div>;
  }

  return (
    <ScrollArea className="flex-1">
      <div className="flex flex-col">
        {complaints.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">No complaints found.</div>
        ) : (
          complaints.map((complaint) => {
            const conversations = complaint.complaint_conversations || [];
            const conversation = conversations.length > 0 ? conversations[0] : null;
            const messages = conversation?.complaint_messages || [];
            
            // Sort messages to get the latest
            const sortedMessages = [...messages].sort((a, b) => 
              new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );
            
            const lastMessage = sortedMessages[0];
            const hasUnread = sortedMessages.some(m => !m.is_read && m.sender_id === complaint.complainant_id);
            
            const profile = complaint.profiles;
            const initials = profile ? `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase() : '??';

            return (
              <div
                key={complaint.id}
                onClick={() => onSelect(complaint)}
                className={cn(
                  "flex flex-col gap-2 p-4 border-b cursor-pointer transition-colors hover:bg-muted/50",
                  selectedId === complaint.id ? "bg-muted" : ""
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm">
                        {profile ? `${profile.first_name} ${profile.last_name}` : 'Unknown Citizen'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(complaint.created_at), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                  {hasUnread && (
                    <div className="h-3 w-3 rounded-full bg-blue-600"></div>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2 mt-1">
                  <ComplaintCategoryBadge category={complaint.category} />
                  <StatusBadge status={complaint.status} />
                </div>
                
                {lastMessage && (
                  <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                    {lastMessage.sender_id === complaint.complainant_id ? '' : 'You: '}
                    {lastMessage.message}
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>
    </ScrollArea>
  );
}
