'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { getAnalyticsData, getAnalyticsBarangays, GlobalFilters } from '@/lib/supabase/analytics';
import { toast } from 'sonner';

import GlobalFiltersBar from './global-filters-bar';
import OverviewCards from './overview-cards';
import HeatMapSection from './heat-map-section';
import TrendCharts from './trend-charts';
import BarangayRankings from './barangay-rankings';
import BarangayBreakdown from './barangay-breakdown';
import ReportGenerator from './report-generator';

export default function AnalyticsDashboardClient() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  
  const [filters, setFilters] = useState<GlobalFilters>({
    dateRange: {
      startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString(), // Default: Last 1 month
      endDate: new Date().toISOString()
    },
    caseType: ['All'],
    category: 'All',
    barangay: 'All',
    gender: 'All',
    status: 'All'
  });

  const [data, setData] = useState({
    sos: [] as any[],
    complaints: [] as any[],
    incidents: [] as any[]
  });
  
  const [barangays, setBarangays] = useState<any[]>([]);

  useEffect(() => {
    async function loadInitial() {
      setLoading(true);
      try {
        const [bData, aData] = await Promise.all([
          getAnalyticsBarangays(supabase),
          getAnalyticsData(supabase, filters)
        ]);
        setBarangays(bData);
        setData(aData);
      } catch (err: any) {
        toast.error("Failed to fetch analytics data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadInitial();
  }, [supabase, filters]);

  return (
    <div className="flex flex-col h-full gap-6 pb-24">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
      </div>

      <GlobalFiltersBar 
        filters={filters} 
        onChange={setFilters} 
        barangays={barangays} 
      />

      {loading ? (
        <div className="flex-1 flex items-center justify-center min-h-[400px]">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="flex flex-col gap-6" id="analytics-report-content">
          <OverviewCards data={data} previousData={null} />
          
          <HeatMapSection data={data} barangays={barangays} />
          
          <TrendCharts data={data} />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             <BarangayRankings data={data} barangays={barangays} />
             {/* We can place additional side-by-side elements here, or just list them vertically */}
          </div>
          
          <BarangayBreakdown data={data} barangays={barangays} />
        </div>
      )}

      {/* Fixed bottom panel or just standard flow component */}
      <ReportGenerator 
        data={data} 
        filters={filters} 
        barangays={barangays} 
      />
    </div>
  );
}
