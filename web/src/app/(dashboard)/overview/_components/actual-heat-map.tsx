'use client';

import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from '@/components/ui/button';

export default function ActualHeatMap({ aggregatedData }: { aggregatedData: any[] }) {
  // San Fernando, La Union center
  const centerPosition: [number, number] = [16.6159, 120.3167];

  const getColor = (total: number) => {
    if (total === 0) return '#e5e7eb'; // light gray
    if (total <= 10) return '#fde047'; // light yellow
    if (total <= 30) return '#f97316'; // orange
    return '#b91c1c'; // dark red
  };

  const getRadius = (total: number) => {
    if (total === 0) return 6;
    if (total <= 10) return 10;
    if (total <= 30) return 14;
    return 18;
  };

  const handleScrollToDetails = (barangayId: string) => {
    const el = document.getElementById('barangay-breakdown-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      // You could also emit an event or update state here if needed
    }
  };

  return (
    <div className="h-[500px] w-full relative rounded-b-md overflow-hidden z-0">
      <MapContainer 
        center={centerPosition} 
        zoom={13} 
        style={{ height: '100%', width: '100%', borderRadius: 'inherit' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {aggregatedData.map(b => {
          if (!b.latitude || !b.longitude || b.totalCases === 0) return null;
          return (
            <CircleMarker
              key={b.id}
              center={[b.latitude, b.longitude]}
              pathOptions={{
                fillColor: getColor(b.totalCases),
                color: getColor(b.totalCases),
                weight: 2,
                opacity: 0.8,
                fillOpacity: 0.6
              }}
              radius={getRadius(b.totalCases)}
            >
              <Popup className="rounded-md">
                <div className="flex flex-col gap-2 min-w-[200px]">
                  <h3 className="font-bold border-b pb-1">{b.name}</h3>
                  <div className="text-sm grid grid-cols-2 gap-x-2 gap-y-1">
                    <span className="text-muted-foreground">Total:</span><span className="font-medium text-right">{b.totalCases}</span>
                    <span className="text-muted-foreground">SOS:</span><span className="text-right">{b.sosCount}</span>
                    <span className="text-muted-foreground">Complaints:</span><span className="text-right">{b.complaintsCount}</span>
                    <span className="text-muted-foreground">Incidents:</span><span className="text-right">{b.incidentsCount}</span>
                    <span className="text-muted-foreground">Top Cat:</span><span className="text-right truncate" title={b.topCategory}>{b.topCategory}</span>
                  </div>
                  <Button size="sm" variant="outline" className="w-full mt-2" onClick={() => handleScrollToDetails(b.id)}>
                    View Details
                  </Button>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
