'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { SOSAlertWithDetails, SOSStatus } from '@/types/cdrrmo-sos';
import { getActiveSOSAlerts } from '@/lib/supabase/cdrrmo-sos';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Map, List, Bell, BellOff } from 'lucide-react';
import ListView from './list-view';
import MapView from './map-view';
import { toast } from 'sonner';

export default function SOSDashboardClient() {
  const [view, setView] = useState<'list' | 'map'>('list');
  const [alerts, setAlerts] = useState<SOSAlertWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    // Initial fetch
    const fetchAlerts = async () => {
      setLoading(true);
      const data = await getActiveSOSAlerts(supabase);
      setAlerts(data);
      setLoading(false);
    };

    fetchAlerts();

    // Supabase Realtime Subscription for Alerts
    const channel = supabase
      .channel('sos_alerts_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'sos_alerts' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newDoc = payload.new as SOSAlertWithDetails;
            // Refetch or augment. Best practice for complex joins is refetch initially, 
            // or fetch the single newly joined record inside the callback.
            // For simplicity here we refetch everything to get the joined profile/barangay data
            fetchAlerts();
            
            if (soundEnabled) {
              playAlertSound();
            }
            showBrowserNotification();
            toast.error('New SOS Alert Received!', {
              description: 'A new emergency alert requires immediate attention.',
              duration: 10000,
            });
          } else if (payload.eventType === 'UPDATE') {
             fetchAlerts(); // Refetch to get updated status/legitimacy and sort order.
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, soundEnabled]);

  const playAlertSound = () => {
    const audio = new Audio('/sounds/alert.mp3'); // We'll need to create this sound file or use a data uri if not possible
    audio.play().catch(e => console.error("Sound play failed:", e));
  };

  const showBrowserNotification = () => {
      if (Notification.permission === 'granted') {
        new Notification('New SOS Alert', {
            body: 'A new emergency alert has been received.',
            icon: '/favicon.ico'
        });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission();
      }
  };

  const toggleSound = () => {
    if (!soundEnabled) {
        Notification.requestPermission();
    }
    setSoundEnabled(!soundEnabled);
  }

  // Derived statistics
  const activeCount = alerts.filter(a => a.status === 'active').length;
  const ongoingCount = alerts.filter(a => a.status === 'ongoing').length;
  const resolvedCount = alerts.filter(a => a.status === 'resolved').length;
  const bogusCount = alerts.filter(a => a.status === 'bogus').length;

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Real-time Summary Bar */}
      <div className="flex items-center justify-between p-4 bg-background border rounded-lg shadow-sm">
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-bold">SOS Operations Monitor</h1>
          <div className="flex gap-4">
             <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 px-3 py-1 text-sm rounded-full">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse mr-2" />
                Active: {activeCount}
             </Badge>
             <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200 px-3 py-1 text-sm rounded-full">
                <span className="w-2 h-2 rounded-full bg-orange-500 mr-2" />
                Ongoing: {ongoingCount}
             </Badge>
             <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 px-3 py-1 text-sm rounded-full">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                Resolved: {resolvedCount}
             </Badge>
             <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200 px-3 py-1 text-sm rounded-full">
                <span className="w-2 h-2 rounded-full bg-gray-500 mr-2" />
                Bogus: {bogusCount}
             </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2">
           <Button variant="ghost" size="icon" onClick={toggleSound} title={soundEnabled ? "Disable Alert Sounds" : "Enable Alert Sounds"}>
             {soundEnabled ? <Bell className="h-5 w-5 text-blue-500" /> : <BellOff className="h-5 w-5 text-muted-foreground" />}
           </Button>
           <div className="flex border rounded-md">
             <Button 
                variant={view === 'list' ? 'default' : 'ghost'} 
                size="sm" 
                className="rounded-none rounded-l-md px-4"
                onClick={() => setView('list')}
             >
                <List className="w-4 h-4 mr-2" /> List
             </Button>
             <Button 
                variant={view === 'map' ? 'default' : 'ghost'} 
                size="sm"
                className="rounded-none rounded-r-md px-4"
                onClick={() => setView('map')}
             >
                <Map className="w-4 h-4 mr-2" /> Map
             </Button>
           </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0 bg-background border rounded-lg overflow-hidden relative shadow-sm">
         {loading && alerts.length === 0 ? (
             <div className="flex items-center justify-center h-full">
                 <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
             </div>
         ) : view === 'list' ? (
             <ListView 
                alerts={alerts} 
                externalSelectedId={selectedAlertId}
                onExternalSelect={setSelectedAlertId}
             />
         ) : (
             <MapView 
                alerts={alerts} 
                onViewDetails={(id: string) => {
                   setSelectedAlertId(id);
                   setView('list');
                }}
             />
         )}
      </div>
    </div>
  );
}
