'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import type { BarangayOfficial } from '@/types/barangay';
import {
  IconCheck,
  IconDotsVertical,
  IconEdit,
  IconPower,
  IconTrash,
  IconX,
  IconClockHour4
} from '@tabler/icons-react';

interface BarangayOfficialsTableProps {
  officials: BarangayOfficial[];
  loading?: boolean;
  onEdit: (official: BarangayOfficial) => void;
  onToggleStatus: (official: BarangayOfficial) => void;
  onDelete: (official: BarangayOfficial) => void;
}

function getFullName(official: BarangayOfficial): string {
  return [official.first_name, official.middle_name, official.last_name]
    .filter(Boolean)
    .join(' ');
}

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell>
            <div className='space-y-1'>
              <Skeleton className='h-4 w-40' />
              <Skeleton className='h-3 w-28' />
            </div>
          </TableCell>
          <TableCell>
            <Skeleton className='h-5 w-16 rounded-full' />
          </TableCell>
          <TableCell>
            <Skeleton className='h-4 w-36' />
          </TableCell>
          <TableCell>
            <Skeleton className='h-4 w-28' />
          </TableCell>
          <TableCell>
            <Skeleton className='h-5 w-16 rounded-full' />
          </TableCell>
          <TableCell>
            <Skeleton className='h-8 w-8 rounded' />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

export function BarangayOfficialsTable({
  officials,
  loading = false,
  onEdit,
  onToggleStatus,
  onDelete
}: BarangayOfficialsTableProps) {
  if (!loading && officials.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-16 text-center'>
        <div className='bg-muted mb-4 flex h-14 w-14 items-center justify-center rounded-full'>
          <IconPower className='text-muted-foreground h-7 w-7' />
        </div>
        <h3 className='mb-1 text-sm font-medium'>No officials found</h3>
        <p className='text-muted-foreground text-xs'>
          Click "Add Official" to create the first barangay captain.
        </p>
      </div>
    );
  }

  return (
    <div className='rounded-md border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className='w-12' />
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableSkeleton />
          ) : (
            officials.map((official) => (
              <TableRow
                key={official.id}
                className={!official.is_active ? 'opacity-60' : undefined}
              >
                {/* Name */}
                <TableCell>
                  <div>
                    <p className='text-sm font-medium'>{getFullName(official)}</p>
                  </div>
                </TableCell>

                {/* Role badge */}
                <TableCell>
                  {official.role === 'captain' ? (
                    <Badge className='bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400'>
                      Captain
                    </Badge>
                  ) : (
                    <Badge className='bg-emerald-100 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400'>
                      Health Worker
                    </Badge>
                  )}
                </TableCell>

                {/* Email */}
                <TableCell className='text-muted-foreground text-sm'>
                  {official.email}
                </TableCell>

                {/* Contact */}
                <TableCell className='text-muted-foreground text-sm'>
                  {official.contact_number}
                </TableCell>

                {/* Status */}
                <TableCell>
                  {!official.is_active || official.status === 'inactive' ? (
                    <Badge
                      variant='outline'
                      className='border-gray-300 bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                    >
                      <IconX className='mr-1 h-3 w-3' />
                      Inactive
                    </Badge>
                  ) : official.status === 'pending' ? (
                    <Badge
                      variant='outline'
                      className='border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-800/50 dark:bg-amber-900/20 dark:text-amber-400'
                    >
                      <IconClockHour4 className='mr-1 h-3 w-3' />
                      Pending
                    </Badge>
                  ) : (
                    <Badge
                      variant='outline'
                      className='border-green-400 bg-green-50 text-green-700 dark:border-green-800/50 dark:bg-green-900/20 dark:text-green-400'
                    >
                      <IconCheck className='mr-1 h-3 w-3' />
                      Active
                    </Badge>
                  )}
                </TableCell>

                {/* Actions */}
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='h-8 w-8'
                        aria-label={`Actions for ${getFullName(official)}`}
                      >
                        <IconDotsVertical className='h-4 w-4' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end' className='w-40'>
                      <DropdownMenuItem onClick={() => onEdit(official)}>
                        <IconEdit className='mr-2 h-4 w-4' />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onToggleStatus(official)}>
                        <IconPower className='mr-2 h-4 w-4' />
                        {official.is_active ? 'Deactivate' : 'Activate'}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onDelete(official)}
                        className='text-destructive focus:text-destructive'
                      >
                        <IconTrash className='mr-2 h-4 w-4' />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
