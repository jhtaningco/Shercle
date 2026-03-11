'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const formSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' })
});

type UserFormValue = z.infer<typeof formSchema>;

export default function UserAuthForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data: UserFormValue) => {
    try {
      setLoading(true);
      
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      });

      if (authError) {
        throw new Error(authError.message);
      }

      if (!authData.user) {
        throw new Error('No user data returned');
      }

      // Fetch user role from profiles
      const { data: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', authData.user.id)
        .single();

      // We don't strictly *need* to route here because the middleware will handle
      // the base /dashboard redirect based on role, but it's cleaner to send them to the root.
      toast.success('Signed in successfully!');
      
      // Let the middleware handle the exact route based on the profile role
      router.push('/overview');
      router.refresh();
      
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='w-full'>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='w-full space-y-4'
      >
        <div className='grid gap-2'>
          <label className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70' htmlFor='email'>
            Email
          </label>
          <Input
            id='email'
            type='email'
            placeholder='Enter your email...'
            disabled={loading}
            {...form.register('email')}
          />
          {form.formState.errors.email && (
            <p className='text-sm text-destructive'>{form.formState.errors.email.message}</p>
          )}
        </div>
        
        <div className='grid gap-2'>
          <label className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70' htmlFor='password'>
            Password
          </label>
          <Input
            id='password'
            type='password'
            placeholder='Enter your password...'
            disabled={loading}
            {...form.register('password')}
          />
          {form.formState.errors.password && (
            <p className='text-sm text-destructive'>{form.formState.errors.password.message}</p>
          )}
        </div>

        <Button disabled={loading} className='w-full' type='submit'>
          {loading ? 'Signing In...' : 'Sign In'}
        </Button>
      </form>
    </div>
  );
}
