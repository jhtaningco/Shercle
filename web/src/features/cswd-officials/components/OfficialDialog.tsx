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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import type { CswdOfficial } from '@/types/cswd';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const getOfficialSchema = (isEdit: boolean) => z.object({
  first_name: z.string().min(2, 'First name must be at least 2 characters'),
  last_name: z.string().min(2, 'Last name must be at least 2 characters'),
  middle_name: z.string().optional(),
  email: z.string().email('Invalid email address'),
  contact_number: z
    .string()
    .regex(/^09\d{9}$/, 'Must be a valid PH mobile number (09XXXXXXXXX)'),
  role: z.enum(['social_worker', 'staff'], {
    required_error: 'Please select a role'
  }),
  password: isEdit ? z.string().optional() : z.string().min(6, 'Password must be at least 6 characters'),
  confirm_password: isEdit ? z.string().optional() : z.string().min(1, 'Please confirm your password')
}).superRefine((data, ctx) => {
  if (data.password !== data.confirm_password) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Passwords don't match",
      path: ['confirm_password']
    });
  }
});

export type OfficialFormValues = z.infer<ReturnType<typeof getOfficialSchema>>;

interface OfficialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  official?: CswdOfficial | null;
  onSubmit: (values: OfficialFormValues) => Promise<void>;
  loading?: boolean;
}

export function OfficialDialog({
  open,
  onOpenChange,
  official,
  onSubmit,
  loading = false
}: OfficialDialogProps) {
  const isEdit = !!official;

  const form = useForm<OfficialFormValues>({
    resolver: zodResolver(getOfficialSchema(isEdit)),
    defaultValues: {
      first_name: official?.first_name ?? '',
      last_name: official?.last_name ?? '',
      middle_name: official?.middle_name ?? '',
      email: official?.email ?? '',
      contact_number: official?.contact_number ?? '',
      role: official?.role ?? 'social_worker'
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
              : `Add a new CSWD official`}
          </DialogDescription>
        </DialogHeader>

        <Form
          form={form}
          onSubmit={form.handleSubmit(handleSubmit)}
          className='space-y-4'
        >
          {/* Role */}
          <FormField
            control={form.control}
            name='role'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Role <span className='text-destructive'>*</span>
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isEdit} // You shouldn't typically change a user's fundamental role after creation
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select a role' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='social_worker'>Social Worker</SelectItem>
                    <SelectItem value='staff'>Staff</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

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

          {/* Passwords (only on create) */}
          {!isEdit && (
            <div className='grid grid-cols-2 gap-3'>
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Password <span className='text-destructive'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type='password' placeholder='******' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='confirm_password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Confirm Password <span className='text-destructive'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type='password' placeholder='******' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

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
