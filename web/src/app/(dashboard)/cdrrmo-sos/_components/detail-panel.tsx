// c:\Users\Gian Adoc\Documents\e-gov\Shercle\web\src\app\(dashboard)\cdrrmo-sos\_components\detail-panel.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { SOSAlertWithDetails, SOSRemarkWithAuthor, SOSStatus } from '@/types/cdrrmo-sos';
import { getSOSRemarks } from '@/lib/supabase/cdrrmo-sos';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle, XCircle, MapPin, Phone, User as UserIcon } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';

interface DetailPanelProps {
  alert: SOSAlertWithDetails;
  onBack: () => void;
}

export default function DetailPanel({ alert, onBack }: DetailPanelProps) {
  const [remarks, setRemarks] = useState<SOSRemarkWithAuthor[]>([]);
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

  // REMOVED: CDRRMO cannot update SOS status/legit — view only
  // Removed handleStatusChange, handleLegitimacyChange, and submitRemark

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

            {/* REMOVED: CDRRMO cannot update SOS status/legit — view only */}
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

      {/* REMOVED: CDRRMO cannot update SOS status/legit — view only */}
    </div>
  );
}
