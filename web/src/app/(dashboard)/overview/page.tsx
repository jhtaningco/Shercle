import { Metadata } from 'next';
import AnalyticsDashboardClient from './_components/analytics-dashboard-client';
import PageContainer from '@/components/layout/page-container';

export const metadata: Metadata = {
  title: 'CICTO Analytics | Dashboard',
  description: 'City Information and Communications Technology Office Analytics Dashboard'
};

export default function CICTOAnalyticsPage() {
  return (
    <PageContainer>
      <div className="flex flex-col gap-4 min-h-[calc(100vh-8rem)]">
        <AnalyticsDashboardClient />
      </div>
    </PageContainer>
  );
}
