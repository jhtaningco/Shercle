import { Metadata } from 'next';
import SOSDashboardClient from './_components/sos-dashboard-client';
import PageContainer from '@/components/layout/page-container';

export const metadata: Metadata = {
  title: 'SOS Dashboard | CDRRMO',
  description: 'Live operations monitor for CDRRMO SOS Alerts'
};

export default function CDRRMOSOSPage() {
  return (
    <PageContainer>
      <div className="flex flex-col gap-4 h-[calc(100vh-8rem)]">
        <SOSDashboardClient />
      </div>
    </PageContainer>
  );
}
