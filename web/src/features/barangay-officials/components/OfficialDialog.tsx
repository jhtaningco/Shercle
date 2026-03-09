'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import type { BarangayOfficial } from '@/types/barangay';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const officialSchema = z.object({
  first_name: z.string().min(2, 'First name must be at least 2 characters'),
  last_name: z.string().min(2, 'Last name must be at least 2 characters'),
  middle_name: z.string().optional(),
  email: z.string().email('Invalid email address'),
  contact_number: z
    .string()
    .regex(/^09\d{9}$/, 'Must be a valid PH mobile number (09XXXXXXXXX)')
});

export type OfficialFormValues = z.infer<typeof officialSchema>;

interface OfficialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  official?: BarangayOfficial | null;
  barangayName: string;
  onSubmit: (values: OfficialFormValues) => Promise<void>;
  loading?: boolean;
}

export function OfficialDialog({
  open,
  onOpenChange,
  official,
  barangayName,
  onSubmit,
  loading = false
}: OfficialDialogProps) {
  const isEdit = !!official;

  const form = useForm<OfficialFormValues>({
    resolver: zodResolver(officialSchema),
    defaultValues: {
      first_name: official?.first_name ?? '',
      last_name: official?.last_name ?? '',
      middle_name: official?.middle_name ?? '',
      email: official?.email ?? '',
      contact_number: official?.contact_number ?? ''
    }
  });

  // Reset form when official changes
  const handleOpenChange = (val: boolean) => {
    if (!val) form.reset();
    onOpenChange(val);
  };

  const handleSubmit = async (values: OfficialFormValues) => {
    await onSubmit(values);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Edit Official' : 'Add New Official'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? `Update details for ${official?.first_name} ${official?.last_name}`
              : `Add a new barangay captain for ${barangayName}`}
          </DialogDescription>
        </DialogHeader>

        <Form
          form={form}
          onSubmit={form.handleSubmit(handleSubmit)}
          className='space-y-4'
        >
          {/* Role — always Captain, shown as read-only badge */}
          <div className='flex items-center gap-3'>
            <span className='text-sm font-medium'>Role</span>
            <Badge className='bg-red-100 text-red-800 hover:bg-red-100'>
              Captain
            </Badge>
          </div>

          {/* Name row */}
          <div className='grid grid-cols-2 gap-3'>
            <FormField
              control={form.control}
              name='first_name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    First Name <span className='text-destructive'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder='Juan' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='last_name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Last Name <span className='text-destructive'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder='dela Cruz' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Middle Name */}
          <FormField
            control={form.control}
            name='middle_name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Middle Name (optional)</FormLabel>
                <FormControl>
                  <Input placeholder='Santos' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Email <span className='text-destructive'>*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type='email'
                    placeholder='juan@example.com'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Contact Number */}
          <FormField
            control={form.control}
            name='contact_number'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Contact Number <span className='text-destructive'>*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type='tel'
                    placeholder='09XXXXXXXXX'
                    maxLength={11}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter className='pt-2'>
            <Button
              type='button'
              variant='outline'
              onClick={() => handleOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type='submit' disabled={loading}>
              {loading
                ? isEdit
                  ? 'Saving...'
                  : 'Adding...'
                : isEdit
                  ? 'Save Changes'
                  : 'Add Official'}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
