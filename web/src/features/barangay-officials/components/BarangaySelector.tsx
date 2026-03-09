'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Barangay, District } from '@/types/barangay';
import { IconMapPin, IconSearch, IconX } from '@tabler/icons-react';
import { useMemo, useState } from 'react';

interface BarangaySelectorProps {
  districts: District[];
  selectedBarangayId: string | null;
  onSelect: (barangay: Barangay) => void;
}

export function BarangaySelector({
  districts,
  selectedBarangayId,
  onSelect
}: BarangaySelectorProps) {
  const [search, setSearch] = useState('');
  const [expandedDistricts, setExpandedDistricts] = useState<Set<string>>(
    new Set(districts.map((d) => d.id))
  );

  const toggleDistrict = (districtId: string) => {
    setExpandedDistricts((prev) => {
      const next = new Set(prev);
      if (next.has(districtId)) {
        next.delete(districtId);
      } else {
        next.add(districtId);
      }
      return next;
    });
  };

  const filteredDistricts = useMemo(() => {
    if (!search.trim()) return districts;
    const q = search.toLowerCase();
    return districts
      .map((d) => ({
        ...d,
        barangays: (d.barangays ?? []).filter((b) =>
          b.name.toLowerCase().includes(q)
        )
      }))
      .filter((d) => d.barangays.length > 0);
  }, [districts, search]);

  const totalBarangays = districts.reduce(
    (acc, d) => acc + (d.barangays?.length ?? 0),
    0
  );

  return (
    <div className='flex h-full flex-col'>
      {/* Header */}
      <div className='border-b p-4'>
        <div className='mb-1 flex items-center gap-2'>
          <IconMapPin className='text-primary h-4 w-4' />
          <h2 className='text-sm font-semibold'>Select Barangay</h2>
        </div>
        <p className='text-muted-foreground mb-3 text-xs'>
          {totalBarangays} barangays across {districts.length} districts
        </p>
        {/* Search */}
        <div className='relative'>
          <IconSearch className='text-muted-foreground absolute left-2.5 top-2.5 h-3.5 w-3.5' />
          <Input
            placeholder='Search barangay...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='h-8 pl-8 pr-8 text-xs'
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className='text-muted-foreground hover:text-foreground absolute right-2.5 top-2.5'
            >
              <IconX className='h-3.5 w-3.5' />
            </button>
          )}
        </div>
      </div>

      {/* District + Barangay list */}
      <ScrollArea className='min-h-0 flex-1'>
        <div className='p-2'>
          {filteredDistricts.length === 0 ? (
            <div className='text-muted-foreground py-8 text-center text-xs'>
              No barangays found
            </div>
          ) : (
            filteredDistricts.map((district) => (
              <div key={district.id} className='mb-1'>
                {/* District header */}
                <button
                  onClick={() => toggleDistrict(district.id)}
                  className='hover:bg-muted flex w-full items-center justify-between rounded-md px-3 py-2 text-left transition-colors'
                >
                  <span className='text-xs font-semibold tracking-wide uppercase'>
                    District {district.district_number}
                  </span>
                  <Badge variant='secondary' className='text-xs'>
                    {district.barangays?.length ?? 0}
                  </Badge>
                </button>

                {/* Barangays */}
                {expandedDistricts.has(district.id) && (
                  <div className='ml-2 mt-0.5 space-y-0.5'>
                    {(district.barangays ?? []).map((barangay) => {
                      const isSelected = barangay.id === selectedBarangayId;
                      return (
                        <button
                          key={barangay.id}
                          onClick={() => onSelect(barangay)}
                          className={`flex w-full items-center rounded-md px-3 py-2 text-left text-xs transition-colors ${
                            isSelected
                              ? 'bg-primary text-primary-foreground font-medium'
                              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                          }`}
                        >
                          <span className='truncate capitalize'>
                            {barangay.name.charAt(0) +
                              barangay.name.slice(1).toLowerCase()}
                          </span>
                          {barangay.contact_number && (
                            <span
                              className={`ml-auto text-xs ${isSelected ? 'text-primary-foreground/70' : 'text-muted-foreground/70'}`}
                            >
                              •
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
