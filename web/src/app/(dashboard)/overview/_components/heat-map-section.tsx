'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import dynamic from 'next/dynamic';

const ActualHeatMap = dynamic(() => import('./actual-heat-map'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] flex items-center justify-center bg-muted rounded-md border">
       <span className="text-muted-foreground animate-pulse">Loading Map...</span>
    </div>
  )
});

interface Props {
  data: { sos: any[]; complaints: any[]; incidents: any[] };
  barangays: any[];
}

export default function HeatMapSection({ data, barangays }: Props) {
  
  // Aggregate data by barangay
  const aggregatedData = useMemo(() => {
    const map = new Map<string, any>();
    
    // Initialize map
    barangays.forEach(b => {
      map.set(b.id, {
        ...b,
        sosCount: 0,
        complaintsCount: 0,
        incidentsCount: 0,
        categories: {} as Record<string, number>
      });
    });

    // Populate
    data.sos.forEach(x => {
      const b = map.get(x.barangay_id);
      if (b) b.sosCount++;
    });

    data.complaints.forEach(x => {
      const b = map.get(x.barangay_id);
      if (b) {
        b.complaintsCount++;
        b.categories[x.category] = (b.categories[x.category] || 0) + 1;
      }
    });

    data.incidents.forEach(x => {
      const b = map.get(x.barangay_id);
      if (b) {
        b.incidentsCount++;
        b.categories[x.category] = (b.categories[x.category] || 0) + 1;
      }
    });

    // Final calculations for Top Category and Total
    const finalData = Array.from(map.values()).map(b => {
      let topCategory = 'None';
      let maxCatCount = 0;
      Object.entries(b.categories).forEach(([cat, count]) => {
         if ((count as number) > maxCatCount) {
             maxCatCount = count as number;
             topCategory = cat;
         }
      });

      return {
        ...b,
        totalCases: b.sosCount + b.complaintsCount + b.incidentsCount,
        topCategory
      };
    });

    return finalData;
  }, [data, barangays]);

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Case Density Map</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ActualHeatMap aggregatedData={aggregatedData} />
      </CardContent>
    </Card>
  );
}
