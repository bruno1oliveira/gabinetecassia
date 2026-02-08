import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
    // If Supabase is not configured, skip authentication
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        return NextResponse.next({ request });
    }

    let supabaseResponse = NextResponse.next({
        request,
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    );
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

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const pathname = request.nextUrl.pathname;

    // Protected admin routes - require authentication
    if (!user && pathname.startsWith('/admin')) {
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    // Protected master routes - require platform_admin role
    if (pathname.startsWith('/master')) {
        if (!user) {
            const url = request.nextUrl.clone();
            url.pathname = '/login';
            return NextResponse.redirect(url);
        }

        // Check if user is platform_admin
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (!profile || profile.role !== 'platform_admin') {
            // Not a platform admin, redirect to admin
            const url = request.nextUrl.clone();
            url.pathname = '/admin';
            return NextResponse.redirect(url);
        }
    }

    // Identify tenant from host
    const host = request.headers.get('host') || '';
    const cleanHost = host.split(':')[0]; // Remove port

    // Try to find tenant by custom domain or subdomain
    let tenantSlug: string | null = null;

    // Check for custom domain first
    const { data: tenantByDomain } = await supabase
        .from('tenants')
        .select('slug')
        .eq('custom_domain', cleanHost)
        .eq('is_active', true)
        .single();

    if (tenantByDomain) {
        tenantSlug = tenantByDomain.slug;
    } else {
        // Try subdomain
        const subdomain = cleanHost.split('.')[0];

        // Skip common subdomains
        if (!['www', 'app', 'api', 'master', 'localhost'].includes(subdomain)) {
            const { data: tenantBySlug } = await supabase
                .from('tenants')
                .select('slug')
                .eq('slug', subdomain)
                .eq('is_active', true)
                .single();

            if (tenantBySlug) {
                tenantSlug = tenantBySlug.slug;
            }
        }
    }

    // For development: use default tenant if not found
    if (!tenantSlug && (cleanHost === 'localhost' || cleanHost.includes('localhost'))) {
        tenantSlug = process.env.DEFAULT_TENANT_SLUG || 'cassia';
    }

    // Pass tenant info via headers (to be read by pages)
    if (tenantSlug) {
        supabaseResponse.headers.set('x-tenant-slug', tenantSlug);
    }

    return supabaseResponse;
}
