import { CswdOfficialsManager } from '@/features/cswd-officials/components';

export const metadata = {
  title: 'CSWD Officials Management'
};

export default async function CswdOfficialsPage() {
  return (
    <div className='flex flex-1 flex-col'>
      {/* Page header */}
      <div className='flex items-center justify-between border-b px-6 py-4'>
        <div>
          <h1 className='text-xl font-semibold'>
            CSWD Officials Management
          </h1>
          <p className='text-muted-foreground mt-0.5 text-sm'>
            Manage City Social Welfare and Development personnel
          </p>
        </div>
      </div>

      {/* Main content */}
      <CswdOfficialsManager />
    </div>
  );
}
