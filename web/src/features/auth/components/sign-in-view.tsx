import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import UserAuthForm from '@/features/auth/components/user-auth-form';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Authentication forms built using the components.'
};

export default function SignInViewPage() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center p-4 lg:p-8 relative'>
      <div className='flex w-full max-w-[400px] flex-col justify-center space-y-6'>
        <div className="flex flex-col items-center space-y-2 text-center">
          <img 
            src="/assets/logos/logo-main.png" 
            alt="Shercle Logo" 
            className="h-16 w-auto mb-4 drop-shadow-sm" 
          />
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome to Shercle
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email and password to sign in
          </p>
        </div>

        <UserAuthForm />

        <p className='text-muted-foreground px-8 text-center text-sm mt-8'>
          By clicking continue, you agree to our{' '}
          <Link
            href='/terms-of-service'
            className='hover:text-primary underline underline-offset-4'
          >
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link
            href='/privacy-policy'
            className='hover:text-primary underline underline-offset-4'
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
