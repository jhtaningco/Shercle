import { CdrrmoOfficialsManager } from '@/features/cdrrmo-officials/components';

export const metadata = {
  title: 'CDRRMO Officials Management'
};

export default async function CdrrmoOfficialsPage() {
  return (
    <div className='flex flex-1 flex-col'>
      {/* Page header */}
      <div className='flex items-center justify-between border-b px-6 py-4'>
        <div>
          <h1 className='text-xl font-semibold'>
            CDRRMO Officials Management
          </h1>
          <p className='text-muted-foreground mt-0.5 text-sm'>
            Manage City Disaster Risk Reduction and Management Office personnel
          </p>
        </div>
      </div>

      {/* Main content */}
      <CdrrmoOfficialsManager />
    </div>
  );
}
