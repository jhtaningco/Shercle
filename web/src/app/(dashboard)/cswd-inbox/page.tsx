"use client";

import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { ComplaintsList } from './components/complaints-list';
import { IncidentsList } from './components/incidents-list';
import { ChatThread } from './components/chat-thread';
import { createClient } from '@/lib/supabase/client';
import { Complaint, IncidentReport } from '@/types/inbox';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CswdInboxPage() {
  const [activeTab, setActiveTab] = useState<'complaints' | 'incidents'>('complaints');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<IncidentReport | null>(null);
  const [profileId, setProfileId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    // Fetch logged-in user profile ID
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setProfileId(user.id);
      }
    }
    getUser();
  }, []);

  const handleConversationUpdate = () => {
    // A quick way to trigger a re-render or refetch if we needed to,
    // though the lists have their own real-time subscriptions.
  };

  // Determine if a thread is active for mobile view
  const isThreadActive = activeTab === 'complaints' ? !!selectedComplaint : !!selectedIncident;

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="text-3xl font-bold tracking-tight">CSWD Inbox</h2>
      </div>
      
      <Tabs
        defaultValue="complaints"
        value={activeTab}
        className="flex h-full flex-col flex-1"
        onValueChange={(val) => {
          setActiveTab(val as 'complaints' | 'incidents');
          setSelectedComplaint(null);
          setSelectedIncident(null);
        }}
      >
        <TabsList className="mb-4 w-full md:w-auto self-start">
          <TabsTrigger value="complaints" className="flex-1 md:flex-none">Complaints</TabsTrigger>
          <TabsTrigger value="incidents" className="flex-1 md:flex-none">Incident Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="complaints" className="flex-1 mt-0 h-full data-[state=active]:flex flex-col">
          <Card className="flex flex-1 flex-row overflow-hidden border-border/40 min-h-[600px] max-h-[calc(100vh-12rem)]">
            {/* Left Panel */}
            <div className={cn(
              "border-r border-border/40 p-0 flex flex-col w-full md:w-1/3 transition-all",
              isThreadActive ? "hidden md:flex" : "flex"
            )}>
              <div className="p-4 border-b bg-muted/20">
                <h3 className="font-semibold text-lg">Complaints</h3>
              </div>
              <ComplaintsList 
                selectedId={selectedComplaint?.id || null} 
                onSelect={(c) => setSelectedComplaint(c)} 
              />
            </div>
            
            {/* Right Panel */}
            <div className={cn(
              "flex-1 flex flex-col w-full md:w-2/3 bg-card",
              !isThreadActive ? "hidden md:flex" : "flex"
            )}>
              {selectedComplaint && profileId ? (
                <>
                  <div className="md:hidden p-2 border-b">
                    <Button variant="ghost" onClick={() => setSelectedComplaint(null)} className="gap-2">
                       <ChevronLeft className="h-4 w-4"/> Back to List
                    </Button>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <ChatThread 
                      type="complaint"
                      caseData={selectedComplaint}
                      currentUserProfileId={profileId}
                      onConversationUpdate={handleConversationUpdate}
                      key={`comp-${selectedComplaint.id}`}
                    />
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-muted-foreground flex-col gap-4">
                  <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                    <svg className="w-10 h-10 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <p>Select a complaint to view the thread</p>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="incidents" className="flex-1 mt-0 h-full data-[state=active]:flex flex-col">
          <Card className="flex flex-1 flex-row overflow-hidden border-border/40 min-h-[600px] max-h-[calc(100vh-12rem)]">
            {/* Left Panel */}
            <div className={cn(
              "border-r border-border/40 p-0 flex flex-col w-full md:w-1/3 transition-all",
              isThreadActive ? "hidden md:flex" : "flex"
            )}>
              <div className="p-4 border-b bg-muted/20">
                <h3 className="font-semibold text-lg">Incident Reports</h3>
              </div>
              <IncidentsList 
                selectedId={selectedIncident?.id || null} 
                onSelect={(i) => setSelectedIncident(i)} 
              />
            </div>
            
            {/* Right Panel */}
            <div className={cn(
              "flex-1 flex flex-col w-full md:w-2/3 bg-card",
              !isThreadActive ? "hidden md:flex" : "flex"
            )}>
              {selectedIncident && profileId ? (
                <>
                   <div className="md:hidden p-2 border-b">
                     <Button variant="ghost" onClick={() => setSelectedIncident(null)} className="gap-2">
                        <ChevronLeft className="h-4 w-4"/> Back to List
                     </Button>
                   </div>
                   <div className="flex-1 overflow-hidden">
                     <ChatThread 
                       type="incident"
                       caseData={selectedIncident}
                       currentUserProfileId={profileId}
                       onConversationUpdate={handleConversationUpdate}
                       key={`inc-${selectedIncident.id}`}
                     />
                   </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-muted-foreground flex-col gap-4">
                  <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                    <svg className="w-10 h-10 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <p>Select an incident report to view the thread</p>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
