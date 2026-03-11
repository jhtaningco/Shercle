'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { SOSAlertWithDetails, SOSStatus } from '@/types/cdrrmo-sos';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import L from 'leaflet';

// Helper component to auto-center map bounds based on active points
function MapBounds({ alerts }: { alerts: SOSAlertWithDetails[] }) {
  const map = useMap();

  useEffect(() => {
    if (alerts.length > 0) {
      const bounds = L.latLngBounds(alerts.map(a => [a.latitude, a.longitude]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
    }
  }, [alerts, map]);

  return null;
}

// Custom markers using standard SVG data URIs so we don't need external image files
const createCustomIcon = (color: string, isPulsing: boolean) => {
    const pulseClass = isPulsing ? 'animate-pulse' : '';
    
    return L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="-mt-6 -ml-3 w-6 h-6 rounded-full flex items-center justify-center opacity-90 shadow-lg ${pulseClass}" style="background-color: ${color}; border: 2px solid white;">
                  <span class="w-2 h-2 rounded-full bg-white opacity-80" />
               </div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 24],
        popupAnchor: [0, -24]
    });
};

const iconMap: Record<SOSStatus, L.DivIcon> = {
    active: createCustomIcon('#ef4444', true), // red pulsing
    ongoing: createCustomIcon('#f97316', false), // orange
    resolved: createCustomIcon('#22c55e', false), // green
    bogus: createCustomIcon('#6b7280', false) // gray
};

export default function MapView({ alerts, onViewDetails }: { alerts: SOSAlertWithDetails[], onViewDetails: (id: string) => void }) {
  const [showAll, setShowAll] = useState(false);
  
  // Render map only after mount to avoid hydration mismatch with window/document
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
     setMounted(true);
  }, []);

  if (!mounted) {
      return <div className="flex-1 flex items-center justify-center bg-slate-100">Loading Map...</div>;
  }

  // Filter alerts based on toggle
  const visibleAlerts = showAll 
     ? alerts 
     : alerts.filter(a => a.status === 'active' || a.status === 'ongoing');

  const defaultCenter: [number, number] = [16.6159, 120.3167]; // Assuming San Fernando, La Union based on "Carlatan" mention

  return (
    <div className="relative w-full h-full flex flex-col">
       <div className="absolute top-4 right-4 z-[400] bg-white rounded-md shadow p-2">
           <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
               <input 
                  type="checkbox" 
                  checked={showAll} 
                  onChange={(e) => setShowAll(e.target.checked)}
                  className="rounded border-gray-300"
               />
               Show Resolved & Bogus
           </label>
       </div>

       <MapContainer 
          center={defaultCenter} 
          zoom={13} 
          scrollWheelZoom={true} 
          className="w-full h-full z-0"
       >
         <TileLayer
           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
         />
         
         <MapBounds alerts={visibleAlerts} />

         {visibleAlerts.map(alert => (
            <Marker 
               key={alert.id} 
               position={[alert.latitude, alert.longitude]} 
               icon={iconMap[alert.status]}
            >
               <Popup className="rounded-lg">
                  <div className="min-w-[200px] p-1">
                      <div className="mb-2">
                         <h4 className="font-bold text-sm text-slate-800">{alert.profiles?.first_name} {alert.profiles?.last_name}</h4>
                         <p className="text-xs text-muted-foreground">{alert.barangays?.name}</p>
                      </div>
                      
                      <div className="mb-3 space-y-1">
                         <div className="text-xs">
                             <span className="text-muted-foreground mr-1">Reported:</span>
                             {formatDistanceToNow(new Date(alert.created_at), { addSuffix: true })}
                         </div>
                         <div className="text-xs font-mono bg-slate-50 p-1 rounded">
                             {alert.latitude.toFixed(4)}, {alert.longitude.toFixed(4)}
                         </div>
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                         {alert.status === 'active' && <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Active</Badge>}
                         {alert.status === 'ongoing' && <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200">Ongoing</Badge>}
                         {alert.status === 'resolved' && <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Resolved</Badge>}
                         {alert.status === 'bogus' && <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">Bogus</Badge>}
                      </div>
                      
                      <Button variant="default" size="sm" className="w-full text-xs" onClick={() => onViewDetails(alert.id)}>
                         View Details
                      </Button>
                  </div>
               </Popup>
            </Marker>
         ))}
       </MapContainer>
    </div>
  );
}
