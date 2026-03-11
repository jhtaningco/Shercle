'use client';

import { useEffect, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { CaseStatus, Complaint, IncidentReport, Profile } from '@/types/inbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown, Send, Clock, MapPin, User, Calendar, FileText } from 'lucide-react';
import { StatusBadge, ComplaintCategoryBadge, IncidentCategoryBadge } from './badges';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react'; // Adjust if auth uses Supabase exclusively

type ChatThreadProps = {
  type: 'complaint' | 'incident';
  caseData: Complaint | IncidentReport;
  currentUserProfileId: string; // From the logged-in CSWD user
  onConversationUpdate: () => void;
};

type MessageDisplay = {
  id: string;
  sender_id: string;
  message: string;
  created_at: string;
  is_read: boolean;
};

export function ChatThread({ type, caseData, currentUserProfileId, onConversationUpdate }: ChatThreadProps) {
  const [messages, setMessages] = useState<MessageDisplay[]>([]);
  const [inputText, setInputText] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const supabase = createClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Derive initial values from caseData
  const caseId = caseData.id;
  const isComplaint = type === 'complaint';
  const cData = caseData as Complaint;
  const iData = caseData as IncidentReport;

  useEffect(() => {
    // 1. Get or create conversation ID
    setupThread();
  }, [caseId]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    
    // Mark messages as read
    if (messages.length > 0 && conversationId) {
      markMessagesAsRead();
    }
  }, [messages]);

  async function setupThread() {
    // Determine the right tables
    const convTable = isComplaint ? 'complaint_conversations' : 'incident_conversations';
    const msgTable = isComplaint ? 'complaint_messages' : 'incident_messages';
    const fkeyCol = isComplaint ? 'complaint_id' : 'incident_report_id';

    // 1. Find existing conversation
    let { data: convData, error: convError } = await supabase
      .from(convTable)
      .select('*')
      .eq(fkeyCol, caseId)
      .maybeSingle();

    let cid = convData?.id;

    if (!cid && !convError) {
      // Create conversation
      const { data: newConv } = await supabase
        .from(convTable)
        .insert({ [fkeyCol]: caseId })
        .select()
        .single();
      
      cid = newConv?.id;
    }

    if (cid) {
      setConversationId(cid);
      fetchMessages(cid, msgTable);

      // Subscribe to messages
      const sub = supabase.channel(`messages:${cid}`)
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: msgTable, filter: `conversation_id=eq.${cid}` },
          (payload) => {
            setMessages(prev => [...prev, payload.new as MessageDisplay]);
            onConversationUpdate();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(sub);
      };
    }
  }

  async function fetchMessages(cid: string, msgTable: string) {
    const { data } = await supabase
      .from(msgTable)
      .select('*')
      .eq('conversation_id', cid)
      .order('created_at', { ascending: true });
    
    if (data) setMessages(data as MessageDisplay[]);
  }

  async function markMessagesAsRead() {
    if (!conversationId) return;
    const msgTable = isComplaint ? 'complaint_messages' : 'incident_messages';
    
    // Determine the citizen's ID
    const citizenId = isComplaint ? cData.complainant_id : iData.reporter_id;

    await supabase
      .from(msgTable)
      .update({ is_read: true })
      .eq('conversation_id', conversationId)
      .eq('sender_id', citizenId)
      .eq('is_read', false);
      
    onConversationUpdate(); // Refresh the dots
  }

  async function sendMessage() {
    if (!inputText.trim() || !conversationId) return;
    
    const msgTable = isComplaint ? 'complaint_messages' : 'incident_messages';
    const text = inputText.trim();
    setInputText('');

    await supabase
      .from(msgTable)
      .insert({
        conversation_id: conversationId,
        sender_id: currentUserProfileId,
        message: text,
        is_read: false
      });
      
    onConversationUpdate();
  }

  async function updateStatus(newStatus: CaseStatus) {
    const table = isComplaint ? 'complaints' : 'incident_reports';
    await supabase
      .from(table)
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', caseId);
      
    onConversationUpdate();
  }

  return (
    <div className="flex flex-col h-full bg-card">
      {/* Header */}
      <div className="border-b p-4 flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2">
              {isComplaint ? 'Complaint Details' : 'Incident Details'}
            </h3>
            <div className="flex items-center gap-2 mt-2">
              {isComplaint ? (
                <ComplaintCategoryBadge category={cData.category} />
              ) : (
                <IncidentCategoryBadge category={iData.category} />
              )}
              <StatusBadge status={caseData.status} />
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="ml-auto">
                Update Status <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => updateStatus('pending')}>Pending</DropdownMenuItem>
              <DropdownMenuItem onClick={() => updateStatus('ongoing')}>Ongoing</DropdownMenuItem>
              <DropdownMenuItem onClick={() => updateStatus('resolved')}>Resolved</DropdownMenuItem>
              <DropdownMenuItem onClick={() => updateStatus('dismissed')}>Dismissed</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Collapsible details section, for now just expanded */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm bg-muted/30 p-3 rounded-md">
          {isComplaint ? (
            <>
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="h-4 w-4" />
                <span className="font-semibold text-foreground">Respondent:</span> {cData.respondent_name || 'N/A'}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span className="font-semibold text-foreground">Incident Date:</span> {cData.incident_date ? format(new Date(cData.incident_date), 'PP') : 'N/A'}
              </div>
              <div className="flex items-start gap-2 text-muted-foreground col-span-1 md:col-span-2 mt-1">
                <FileText className="h-4 w-4 mt-0.5 shrink-0" />
                <span className="font-semibold text-foreground shrink-0">Description:</span>
                <p className="text-foreground">{cData.description}</p>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 text-muted-foreground col-span-1 md:col-span-2">
                <MapPin className="h-4 w-4 shrink-0" />
                <span className="font-semibold text-foreground shrink-0">Address:</span>
                <span className="text-foreground truncate">{iData.address || `${iData.latitude}, ${iData.longitude}`}</span>
              </div>
              <div className="flex items-start gap-2 text-muted-foreground col-span-1 md:col-span-2">
                <FileText className="h-4 w-4 mt-0.5 shrink-0" />
                <span className="font-semibold text-foreground shrink-0">Description:</span>
                <p className="text-foreground">{iData.description}</p>
              </div>
              {iData.photo_url && (
                <div className="col-span-1 md:col-span-2 mt-2">
                   <a href={iData.photo_url} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline text-xs flex items-center gap-1">
                     <FileText className="h-3 w-3"/> View Attached Photo
                   </a>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="flex flex-col gap-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-10">
              No messages yet. Send a message to start the conversation.
            </div>
          ) : (
            messages.map((msg) => {
              const citizenId = isComplaint ? cData.complainant_id : iData.reporter_id;
              const isCitizen = msg.sender_id === citizenId;
              const profile = caseData.profiles;
              
              return (
                <div
                  key={msg.id}
                  className={cn(
                    "flex flex-col max-w-[80%]",
                    !isCitizen ? "self-end items-end" : "self-start items-start"
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                     <span className="text-xs text-muted-foreground font-medium">
                       {!isCitizen ? 'You (CSWD)' : (profile ? `${profile.first_name} ${profile.last_name}` : 'Citizen')}
                     </span>
                     <span className="text-[10px] text-muted-foreground opacity-70">
                       {format(new Date(msg.created_at), 'p')}
                     </span>
                  </div>
                  <div
                    className={cn(
                      "px-4 py-2 rounded-2xl text-sm",
                      !isCitizen
                        ? "bg-blue-600 text-white rounded-tr-sm"
                        : "bg-muted text-foreground rounded-tl-sm"
                    )}
                  >
                    {msg.message}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t bg-card mt-auto">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="flex gap-2"
        >
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={!inputText.trim() || !conversationId}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
