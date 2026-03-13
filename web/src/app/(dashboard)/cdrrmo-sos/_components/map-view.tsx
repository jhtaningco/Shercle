'use client';

import { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { SOSAlertWithDetails, SOSStatus } from '@/types/cdrrmo-sos';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import 'leaflet/dist/leaflet.css';

// Dynamically import react-leaflet components to avoid SSR "window is not defined" errors
const MapContainer = dynamic(
  () => import('react-leaflet').then(mod => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then(mod => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then(mod => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then(mod => mod.Popup),
  { ssr: false }
);

// MapBounds as a separate client-only component
function MapBoundsInner({ alerts }: { alerts: SOSAlertWithDetails[] }) {
  const { useMap } = require('react-leaflet');
  const L = require('leaflet');
  const map = useMap();

  useEffect(() => {
    if (alerts.length > 0) {
      const bounds = L.latLngBounds(alerts.map((a: SOSAlertWithDetails) => [a.latitude, a.longitude]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
    }
  }, [alerts, map, L]);

  return null;
}

// Custom markers - created lazily on client only
function createCustomIcon(L: typeof import('leaflet'), color: string, isPulsing: boolean) {
    // Increased sizes: pulsing w-14 h-14, non-pulsing w-10 h-10
    const baseSize = isPulsing ? 'w-14 h-14' : 'w-10 h-10';
    const innerSize = isPulsing ? 'w-5 h-5' : 'w-3 h-3';
    
    if (isPulsing) {
        return L.divIcon({
            className: 'custom-div-icon',
            html: `<div class="-translate-x-1/2 -translate-y-full relative flex items-center justify-center ${baseSize}">
                      <span class="absolute inline-flex h-full w-full rounded-full opacity-75 animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite]" style="background-color: ${color};"></span>
                      <span class="relative inline-flex rounded-full border-2 border-white shadow-lg ${innerSize}" style="background-color: ${color};"></span>
                   </div>`,
            iconSize: [56, 56],
            iconAnchor: [28, 56],
            popupAnchor: [0, -56]
        });
    }

    return L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="-translate-x-1/2 -translate-y-full rounded-full flex items-center justify-center opacity-90 shadow-lg ${baseSize}" style="background-color: ${color}; border: 2px solid white;">
                  <span class="${innerSize} rounded-full bg-white opacity-90 shadow-sm" />
               </div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
    });
}

export default function MapView({ alerts, onViewDetails }: { alerts: SOSAlertWithDetails[], onViewDetails: (id: string) => void }) {
  const [showAll, setShowAll] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
     setMounted(true);
  }, []);

  // Create icons lazily on the client only
  const iconMap = useMemo(() => {
    if (typeof window === 'undefined') return null;
    const L = require('leaflet');
    return {
      active: createCustomIcon(L, '#ef4444', true),
      ongoing: createCustomIcon(L, '#f97316', false),
      resolved: createCustomIcon(L, '#22c55e', false),
      bogus: createCustomIcon(L, '#6b7280', false),
    } as Record<SOSStatus, import('leaflet').DivIcon>;
  }, []);

  if (!mounted || !iconMap) {
      return <div className="flex-1 flex items-center justify-center bg-slate-100">Loading Map...</div>;
  }

  const visibleAlerts = showAll 
     ? alerts 
     : alerts.filter(a => a.status === 'active' || a.status === 'ongoing');

  const defaultCenter: [number, number] = [16.6159, 120.3167];

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
         
         <MapBoundsInner alerts={visibleAlerts} />

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
