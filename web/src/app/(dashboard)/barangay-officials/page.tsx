import { BarangayOfficialsManager } from '@/features/barangay-officials/components';
import { getDistrictsWithBarangays } from '@/lib/supabase/barangay-officials';
import { District } from '@/types/barangay';

export const metadata = {
  title: 'Barangay Officials Management'
};

export default async function BarangayOfficialsPage() {
  let districts: District[] = [];
  let error: string | null = null;

  try {
    districts = await getDistrictsWithBarangays();
  } catch (err: any) {
    error = err.message ?? 'Failed to load districts';
  }

  if (error) {
    return (
      <div className='flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center'>
        <h2 className='text-base font-semibold text-destructive'>
          Error loading data
        </h2>
        <p className='text-muted-foreground text-sm'>{error}</p>
      </div>
    );
  }

  return (
    <div className='flex flex-1 flex-col'>
      {/* Page header */}
      <div className='flex items-center justify-between border-b px-6 py-4'>
        <div>
          <h1 className='text-xl font-semibold'>
            Barangay Officials Management
          </h1>
          <p className='text-muted-foreground mt-0.5 text-sm'>
            Manage barangay captains across 59 barangays in San Fernando, La
            Union
          </p>
        </div>
      </div>

      {/* Main content — two-column layout */}
      <BarangayOfficialsManager districts={districts} />
    </div>
  );
}
