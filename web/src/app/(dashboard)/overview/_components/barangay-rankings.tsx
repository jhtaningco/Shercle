'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

interface Props {
  data: { sos: any[]; complaints: any[]; incidents: any[] };
  barangays: any[];
}

export default function BarangayRankings({ data, barangays }: Props) {
  const [limit, setLimit] = useState<number>(5);

  const rankings = useMemo(() => {
    const map = new Map<string, any>();
    
    barangays.forEach(b => {
      map.set(b.id, {
        ...b,
        sos: 0,
        complaints: 0,
        incidents: 0,
        resolved: 0,
        categories: {} as Record<string, number>
      });
    });

    const processItem = (item: any, type: 'sos' | 'complaints' | 'incidents') => {
      const b = map.get(item.barangay_id);
      if (b) {
        b[type]++;
        if (item.status?.toLowerCase() === 'resolved') b.resolved++;
        if (item.category) b.categories[item.category] = (b.categories[item.category] || 0) + 1;
      }
    };

    data.sos.forEach(x => processItem(x, 'sos'));
    data.complaints.forEach(x => processItem(x, 'complaints'));
    data.incidents.forEach(x => processItem(x, 'incidents'));

    return Array.from(map.values())
      .map(b => {
        const total = b.sos + b.complaints + b.incidents;
        
        let topCategory = '—';
        let maxCount = 0;
        Object.entries(b.categories).forEach(([cat, count]) => {
          if ((count as number) > maxCount) {
             maxCount = count as number;
             topCategory = cat;
          }
        });

        return {
          id: b.id,
          name: b.name,
          district: b.district_number || 'N/A',
          total,
          sos: b.sos,
          complaints: b.complaints,
          incidents: b.incidents,
          topCategory,
          resolutionRate: total > 0 ? ((b.resolved / total) * 100).toFixed(1) : '0.0'
        };
      })
      .filter(b => b.total > 0)
      .sort((a, b) => b.total - a.total);
  }, [data, barangays]);

  const displayData = limit === -1 ? rankings : rankings.slice(0, limit);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Top Barangays</CardTitle>
          <CardDescription>Ranked by highest case volume</CardDescription>
        </div>
        <Select 
            value={limit.toString()} 
            onValueChange={(val) => setLimit(parseInt(val))}
        >
          <SelectTrigger className="w-[120px] h-8 text-xs">
            <SelectValue placeholder="Limit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3">Top 3</SelectItem>
            <SelectItem value="5">Top 5</SelectItem>
            <SelectItem value="10">Top 10</SelectItem>
            <SelectItem value="-1">All Items</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto">
        {rankings.length === 0 ? (
           <div className="py-8 text-center text-sm text-muted-foreground border rounded-md">
              No data available for the selected filters
           </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Rank</TableHead>
                  <TableHead>Barangay</TableHead>
                  <TableHead>Dist.</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayData.map((row, index) => (
                  <TableRow key={row.id} className={index === 0 ? "bg-red-50/50" : ""}>
                    <TableCell className="font-medium text-muted-foreground">{index + 1}</TableCell>
                    <TableCell className="font-semibold">{row.name}</TableCell>
                    <TableCell>{row.district}</TableCell>
                    <TableCell className="text-right font-bold text-red-600">{row.total}</TableCell>
                    <TableCell className="text-right text-emerald-600 font-medium">{row.resolutionRate}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
