import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut } from 'lucide-react';
import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-muted/50 p-4'>
      <Card className='mx-auto max-w-md text-center'>
        <CardHeader>
          <CardTitle className='text-2xl text-destructive'>Access Denied</CardTitle>
          <CardDescription>
            You do not have permission to view this page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className='text-sm text-foreground'>
            If you are a citizen or a barangay official, please use the mobile application to access your services.
          </p>
        </CardContent>
        <CardFooter className='flex justify-center'>
            <Button asChild variant='outline'>
                <Link href='/auth/sign-in'>
                  <LogOut className='mr-2 h-4 w-4' />
                  Return to Login
                </Link>
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
