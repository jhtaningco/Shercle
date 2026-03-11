'use client';

import { useState } from 'react';
import { SOSAlertWithDetails } from '@/types/cdrrmo-sos';
import FeedPanel from './feed-panel';
import DetailPanel from './detail-panel';
import { useMediaQuery } from 'react-responsive';

interface ListViewProps {
  alerts: SOSAlertWithDetails[];
  externalSelectedId?: string | null;
  onExternalSelect?: (id: string | null) => void;
}

export default function ListView({ alerts, externalSelectedId, onExternalSelect }: ListViewProps) {
  const [internalSelectedId, setInternalSelectedId] = useState<string | null>(null);
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  const selectedAlertId = externalSelectedId !== undefined ? externalSelectedId : internalSelectedId;
  const handleSelect = (id: string | null) => {
      if (onExternalSelect) onExternalSelect(id);
      else setInternalSelectedId(id);
  };

  const selectedAlert = alerts.find(a => a.id === selectedAlertId) || null;

  return (
    <div className="flex h-full w-full">
       {/* Left Panel: Feed */}
       <div className={`
         ${(isMobile && selectedAlertId) ? 'hidden' : 'flex'}
         flex-col w-full md:w-1/3 min-w-[320px] max-w-[450px] border-r h-full
       `}>
          <FeedPanel 
             alerts={alerts} 
             selectedId={selectedAlertId} 
             onSelect={handleSelect} 
          />
       </div>

       {/* Right Panel: Detail */}
       <div className={`
         ${(isMobile && !selectedAlertId) ? 'hidden' : 'flex'}
         flex-col flex-1 h-full bg-slate-50
       `}>
          {selectedAlert ? (
             <DetailPanel 
                alert={selectedAlert} 
                onBack={() => handleSelect(null)} 
             />
          ) : (
             <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-center p-8">
               <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mouse-pointer-click text-slate-400"><path d="M14 4.1 12 6"/><path d="m5.1 8-2.9-1.2"/><path d="m21.3 13.7-2.6-1.5"/><path d="m11 20.7 1.7-2.6"/><path d="m14 11.6-8.9 5.4c-.7.4-1.6-.2-1.4-1l2-8.5c.2-.8 1.2-1.1 1.8-.6l4.4 3.5c.5.4 1.4.3 1.8-.2l2.6-3.8c.4-.6 1.3-.7 1.8-.2l3.4 3.1c.5.5.4 1.4-.2 1.8L14 11.6Z"/></svg>
               </div>
               <h3 className="text-lg font-medium text-slate-700">Select an Emergency Alert</h3>
               <p className="max-w-xs mt-2 text-sm">Choose an SOS alert from the feed to view remarks, exact location, and update its status.</p>
             </div>
          )}
       </div>
    </div>
  );
}
