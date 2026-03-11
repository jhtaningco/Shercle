'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { SOSAlertWithDetails, SOSRemarkWithAuthor, SOSStatus } from '@/types/cdrrmo-sos';
import { getSOSRemarks, updateSOSStatus, updateSOSLegitimacy, addSOSRemark } from '@/lib/supabase/cdrrmo-sos';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { ArrowLeft, ChevronDown, CheckCircle, XCircle, Send, MapPin, Phone, User as UserIcon } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { toast } from 'sonner';

interface DetailPanelProps {
  alert: SOSAlertWithDetails;
  onBack: () => void;
}

export default function DetailPanel({ alert, onBack }: DetailPanelProps) {
  const [remarks, setRemarks] = useState<SOSRemarkWithAuthor[]>([]);
  const [newRemark, setNewRemark] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const supabase = createClient();

  useEffect(() => {
    const fetchTimeline = async () => {
      const data = await getSOSRemarks(supabase, alert.id);
      setRemarks(data);
    };

    fetchTimeline();

    const channel = supabase
      .channel(`sos_remarks_${alert.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'sos_remarks', filter: `sos_id=eq.${alert.id}` },
        (_payload) => {
           // Refetch to get joined author profile data
           fetchTimeline();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [alert.id, supabase]);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [remarks]);

  const handleStatusChange = async (status: SOSStatus) => {
      try {
          await updateSOSStatus(supabase, alert.id, status);
          toast.success(`Status updated to ${status}`);
      } catch (error) {
          toast.error('Failed to update status');
      }
  };

  const handleLegitimacyChange = async (is_legit: boolean) => {
      try {
          await updateSOSLegitimacy(supabase, alert.id, is_legit);
          toast.success(`Marked as ${is_legit ? 'Legit' : 'Bogus'}`);
      } catch (error) {
          toast.error('Failed to update legitimacy');
      }
  };

  const submitRemark = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!newRemark.trim() || submitting) return;

      setSubmitting(true);
      try {
          // Get current user session
          const { data: { session } } = await supabase.auth.getSession();
          if (!session?.user) throw new Error("Not authenticated");

          await addSOSRemark(supabase, alert.id, session.user.id, newRemark.trim());
          setNewRemark('');
      } catch (error) {
          toast.error('Failed to post remark');
      } finally {
          setSubmitting(false);
      }
  };

  const getStatusBadge = (status: SOSStatus) => {
      switch(status) {
          case 'active': return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Active</Badge>;
          case 'ongoing': return <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200">Ongoing</Badge>;
          case 'resolved': return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Resolved</Badge>;
          case 'bogus': return <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">Bogus</Badge>;
      }
  };

  const getLegitBadge = (is_legit: boolean | null) => {
      if (is_legit === true) return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200"><CheckCircle className="w-3 h-3 mr-1" /> Legit</Badge>;
      if (is_legit === false) return <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200"><XCircle className="w-3 h-3 mr-1" /> Bogus</Badge>;
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">Unverified</Badge>;
  }

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm relative z-10">
         <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
               <Button variant="ghost" size="icon" onClick={onBack} className="md:hidden">
                  <ArrowLeft className="w-5 h-5" />
               </Button>
               <div>
                  <h2 className="text-lg font-bold flex items-center gap-2">
                     Case Details
                     {getStatusBadge(alert.status)}
                     {getLegitBadge(alert.is_legit)}
                  </h2>
                  <p className="text-sm text-muted-foreground">Received {format(new Date(alert.created_at), 'PPP p')}</p>
               </div>
            </div>

            <div className="flex gap-2">
               {/* Legit/Bogus Toggles */}
               {(alert.is_legit === null || alert.is_legit === false) && (
                  <Button variant="outline" size="sm" onClick={() => handleLegitimacyChange(true)} className="text-green-600 border-green-200 hover:bg-green-50 hidden sm:flex">
                     Mark Legit
                  </Button>
               )}
               {(alert.is_legit === null || alert.is_legit === true) && (
                  <Button variant="outline" size="sm" onClick={() => handleLegitimacyChange(false)} className="text-gray-600 border-gray-200 hover:bg-gray-50 hidden sm:flex">
                     Mark Bogus
                  </Button>
               )}

               {/* Status Update Dropdown */}
               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                     <Button variant="default" size="sm">
                        Update Status <ChevronDown className="w-4 h-4 ml-2" />
                     </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                     <DropdownMenuItem onClick={() => handleStatusChange('active')}>Set Active</DropdownMenuItem>
                     <DropdownMenuItem onClick={() => handleStatusChange('ongoing')}>Set Ongoing</DropdownMenuItem>
                     <DropdownMenuItem onClick={() => handleStatusChange('resolved')}>Set Resolved</DropdownMenuItem>
                     <DropdownMenuItem onClick={() => handleStatusChange('bogus')}>Set Bogus</DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
            </div>
         </div>

         {/* Info Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/20 border-t">
             <div className="space-y-3">
                 <div className="flex items-start gap-2">
                     <UserIcon className="w-4 h-4 text-muted-foreground mt-0.5" />
                     <div>
                         <p className="text-sm font-medium">{alert.profiles?.first_name} {alert.profiles?.last_name}</p>
                         <p className="text-xs text-muted-foreground">Victim / Reporter</p>
                     </div>
                 </div>
                 <div className="flex items-start gap-2">
                     <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                     <div>
                         <p className="text-sm font-medium">{alert.barangays?.name}</p>
                         <p className="text-xs text-muted-foreground">{alert.address || "No exact address provided"}</p>
                     </div>
                 </div>
             </div>
             
             <div className="space-y-3">
                 <div className="flex items-start gap-2">
                     <Phone className="w-4 h-4 text-muted-foreground mt-0.5" />
                     <div>
                         <p className="text-sm font-medium">{alert.barangays?.contact_number || "No contact info"}</p>
                         <p className="text-xs text-muted-foreground">Barangay Hotline</p>
                     </div>
                 </div>
                 <div className="text-xs text-muted-foreground bg-white border p-2 rounded-md font-mono">
                     Coordinates: {alert.latitude.toFixed(6)}, {alert.longitude.toFixed(6)}
                 </div>
             </div>
         </div>
      </div>

      {/* Timeline */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
         <div className="text-center">
            <span className="text-xs font-medium text-muted-foreground bg-white border px-3 py-1 rounded-full shadow-sm">
                Case Initiated: {formatDistanceToNow(new Date(alert.created_at), { addSuffix: true })}
            </span>
         </div>
         
         {remarks.map(remark => {
             const isCDRRMO = remark.profiles?.role === 'cdrrmo';
             return (
                 <div key={remark.id} className={`flex flex-col max-w-[80%] ${isCDRRMO ? 'ml-auto' : 'mr-auto'}`}>
                     <div className="flex items-baseline gap-2 mb-1 px-1">
                         <span className="text-xs font-semibold text-slate-700">{remark.profiles?.first_name}</span>
                         <span className="text-[10px] text-muted-foreground uppercase">{remark.profiles?.role}</span>
                         <span className="text-[10px] text-slate-400 ml-auto">{format(new Date(remark.created_at), 'p')}</span>
                     </div>
                     <div className={`
                         p-3 rounded-2xl shadow-sm border text-sm relative
                         ${isCDRRMO 
                            ? 'bg-blue-600 text-white border-blue-700 rounded-tr-sm' 
                            : 'bg-white text-slate-800 rounded-tl-sm'
                         }
                     `}>
                         {remark.remark}
                     </div>
                 </div>
             );
         })}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t mt-auto">
         <form onSubmit={submitRemark} className="flex gap-2">
             <Input 
                value={newRemark}
                onChange={e => setNewRemark(e.target.value)}
                placeholder="Type an official remark or update..."
                className="flex-1"
                disabled={submitting}
             />
             <Button type="submit" disabled={!newRemark.trim() || submitting} className="shrink-0 bg-blue-600 hover:bg-blue-700">
                 {submitting ? <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> : <Send className="w-4 h-4 mr-2" />}
                 Send
             </Button>
         </form>
      </div>
    </div>
  );
}
