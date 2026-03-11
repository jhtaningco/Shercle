import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const path = request.nextUrl.pathname;

  // Unprotected routes that require no auth checks
  if (
    path === '/' ||
    path.startsWith('/_next') ||
    path.startsWith('/api') ||
    path.startsWith('/unauthorized') ||
    path.startsWith('/about') ||
    path.startsWith('/privacy-policy') ||
    path.startsWith('/terms-of-service')
  ) {
    return supabaseResponse;
  }

  // Check auth session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If user is NOT logged in and trying to access anything else (i.e. the guarded dashboard pages)
  // excluding the auth pages themselves
  if (!user && !path.startsWith('/auth')) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth/sign-in';
    return NextResponse.redirect(url);
  }

  // If user IS logged in and tries to access /auth pages, redirect away
  if (user && path.startsWith('/auth')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const role = profile?.role || 'citizen';
    const url = request.nextUrl.clone();

    if (role === 'cicto') {
      url.pathname = '/overview';
    } else if (role === 'cdrrmo') {
      url.pathname = '/overview';
    } else if (role === 'cswd') {
      url.pathname = '/cswd-inbox';
    } else {
      url.pathname = '/unauthorized';
    }
    
    return NextResponse.redirect(url);
  }

  // If user IS logged in and accessing protected pages (not starting with /auth, /unauthorized, etc)
  if (user && !path.startsWith('/auth')) {
    // Fetch user profile to check role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const role = profile?.role || 'citizen';

    // Citizens and barangay have no access to the web dashboard at all
    if (role === 'citizen' || role === 'barangay') {
      const url = request.nextUrl.clone();
      url.pathname = '/unauthorized';
      return NextResponse.redirect(url);
    }

    // Role-based access rules
    // CICTO has access to officials management.
    if (role === 'cicto') {
       if (!path.startsWith('/overview') && !path.startsWith('/cdrrmo-officials') && !path.startsWith('/cswd-officials') && !path.startsWith('/barangay-officials')) {
          const url = request.nextUrl.clone();
          url.pathname = '/unauthorized';
          return NextResponse.redirect(url);
       }
    } else {
      // CDRRMO rules
      if (role === 'cdrrmo') {
         if (path === '/') {
            const url = request.nextUrl.clone();
            url.pathname = '/overview';
            return NextResponse.redirect(url);
         } else if(path.startsWith('/cdrrmo-officials') || path.startsWith('/cswd-officials') || path.startsWith('/barangay-officials') || path.startsWith('/cswd-inbox')) {
             const url = request.nextUrl.clone();
             url.pathname = '/unauthorized';
             return NextResponse.redirect(url);
         }
      }

      // CSWD rules
      if (role === 'cswd') {
         if (path === '/overview') {
            const url = request.nextUrl.clone();
            url.pathname = '/cswd-inbox';
            return NextResponse.redirect(url);
         } else if(!path.startsWith('/cswd-inbox')) {
             const url = request.nextUrl.clone();
             url.pathname = '/unauthorized';
             return NextResponse.redirect(url);
         }
      }
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
