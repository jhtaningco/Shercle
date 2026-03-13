'use client';

import { useState, useMemo, Fragment } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, ChevronDown, ChevronRight } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Props {
  data: { sos: any[]; complaints: any[]; incidents: any[] };
  barangays: any[];
}

export default function BarangayBreakdown({ data, barangays }: Props) {
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const breakdown = useMemo(() => {
    const map = new Map<string, any>();
    
    barangays.forEach(b => {
      map.set(b.id, {
        ...b,
        sos: 0,
        complaints: 0,
        incidents: 0,
        resolved: 0,
        males: 0,
        females: 0,
        categories: {} as Record<string, number>,
        statuses: {} as Record<string, number>
      });
    });

    const processItem = (item: any, type: 'sos' | 'complaints' | 'incidents') => {
      const b = map.get(item.barangay_id);
      if (b) {
        b[type]++;
        
        const status = item.status?.toLowerCase() || 'unknown';
        b.statuses[status] = (b.statuses[status] || 0) + 1;
        
        if (status === 'resolved') b.resolved++;
        
        if (item.category) b.categories[item.category] = (b.categories[item.category] || 0) + 1;
        
        const gender = (item.profiles?.gender || '').toLowerCase();
        if (gender === 'male') b.males++;
        else if (gender === 'female') b.females++;
        else if (gender) b.others = (b.others || 0) + 1;
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
          ...b,
          total,
          topCategory,
          resolutionRate: total > 0 ? ((b.resolved / total) * 100).toFixed(1) : '0.0'
        };
      })
      .sort((a, b) => b.total - a.total);
  }, [data, barangays]);

  const filtered = useMemo(() => {
     if (!search.trim()) return breakdown;
     const q = search.toLowerCase();
     return breakdown.filter(b => b.name.toLowerCase().includes(q));
  }, [breakdown, search]);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <Card id="barangay-breakdown-section" className="scroll-m-20">
      <CardHeader>
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
            <div>
              <CardTitle>Per Barangay Breakdown</CardTitle>
              <CardDescription>Detailed statistics for all barangays</CardDescription>
            </div>
            <div className="relative w-full sm:w-[300px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search barangay..."
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]"></TableHead>
                  <TableHead>Barangay</TableHead>
                  <TableHead>Dist.</TableHead>
                  <TableHead className="text-right">Total Cases</TableHead>
                  <TableHead className="text-right">SOS</TableHead>
                  <TableHead className="text-right">Complaints</TableHead>
                  <TableHead className="text-right">Incidents</TableHead>
                  <TableHead>Top Category</TableHead>
                  <TableHead className="text-right">Res. Rate</TableHead>
                  <TableHead className="text-right border-l">M | F | O</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((row) => (
                  <Fragment key={row.id}>
                      <TableRow 
                        className={`cursor-pointer hover:bg-muted/50 ${expandedId === row.id ? 'bg-muted/30' : ''}`}
                        onClick={() => toggleExpand(row.id)}
                      >
                        <TableCell>
                           {expandedId === row.id ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        </TableCell>
                        <TableCell className="font-semibold">{row.name}</TableCell>
                        <TableCell>{row.district_number || 'N/A'}</TableCell>
                        <TableCell className="text-right font-bold">{row.total}</TableCell>
                        <TableCell className="text-right">{row.sos}</TableCell>
                        <TableCell className="text-right">{row.complaints}</TableCell>
                        <TableCell className="text-right">{row.incidents}</TableCell>
                        <TableCell className="text-muted-foreground text-xs">{row.topCategory}</TableCell>
                        <TableCell className="text-right text-emerald-600">{row.resolutionRate}%</TableCell>
                        <TableCell className="text-right border-l text-xs text-muted-foreground">
                            <span className="text-blue-600 font-medium">{row.males}</span> <span className="mx-1">|</span> <span className="text-pink-600 font-medium">{row.females}</span> <span className="mx-1">|</span> <span className="text-purple-600 font-medium">{row.others || 0}</span>
                        </TableCell>
                      </TableRow>
                      
                      {/* Expanded Section */}
                      {expandedId === row.id && (
                        <TableRow className="bg-muted/10">
                          <TableCell colSpan={10} className="p-0">
                             <div className="p-4 border-b">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4 bg-background rounded-md border shadow-sm">
                                   
                                   {/* Status Distribution */}
                                   <div>
                                     <h4 className="font-semibold text-sm mb-2 border-b pb-1">Status Distribution</h4>
                                     <div className="flex flex-col gap-1 text-sm mt-2">
                                        {Object.entries(row.statuses).length > 0 ? (
                                           Object.entries(row.statuses)
                                             .sort((a, b) => (b[1] as number) - (a[1] as number))
                                             .map(([status, count]) => (
                                              <div key={status} className="flex justify-between">
                                                 <span className="capitalize text-muted-foreground">{status}</span>
                                                 <span className="font-medium">{count as number}</span>
                                              </div>
                                           ))
                                        ) : (
                                           <span className="text-muted-foreground italic">No cases recorded</span>
                                        )}
                                     </div>
                                   </div>

                                   {/* Category Breakdown */}
                                   <div>
                                     <h4 className="font-semibold text-sm mb-2 border-b pb-1">Category Breakdown</h4>
                                     <div className="flex flex-col gap-1 text-sm mt-2">
                                        {Object.entries(row.categories).length > 0 ? (
                                           Object.entries(row.categories)
                                             .sort((a, b) => (b[1] as number) - (a[1] as number))
                                             .map(([cat, count]) => (
                                              <div key={cat} className="flex justify-between">
                                                 <span className="capitalize text-muted-foreground truncate max-w-[200px]" title={cat}>{cat}</span>
                                                 <span className="font-medium">{count as number}</span>
                                              </div>
                                           ))
                                        ) : (
                                           <span className="text-muted-foreground italic">No categories recorded</span>
                                        )}
                                     </div>
                                   </div>

                                </div>
                             </div>
                          </TableCell>
                        </TableRow>
                      )}
                  </Fragment>
                ))}
                {filtered.length === 0 && (
                   <TableRow>
                     <TableCell colSpan={10} className="h-24 text-center text-muted-foreground">
                       No barangays found matching "{search}"
                     </TableCell>
                   </TableRow>
                )}
              </TableBody>
            </Table>
        </div>
      </CardContent>
    </Card>
  );
}
