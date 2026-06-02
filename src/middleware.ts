// Crucial Security Patch: Implement CSRF protection for state-mutating requests (#359)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const mutatingMethods = ['POST', 'PUT', 'DELETE', 'PATCH'];
    
    // Check if the request is trying to mutate data
    if (mutatingMethods.includes(request.method)) {
        const csrfTokenHeader = request.headers.get('x-csrf-token');
        const csrfCookieToken = request.cookies.get('csrfToken')?.value;

        // Block request if tokens are missing or do not match
        if (!csrfTokenHeader || !csrfCookieToken || csrfTokenHeader !== csrfCookieToken) {
            return new NextResponse(
                JSON.stringify({ success: false, message: 'CSRF token validation failed.' }),
                { status: 403, headers: { 'content-type': 'application/json' } }
            );
        }
    }
    return NextResponse.next();
}

// Config to apply this middleware across all API routes
export const config = {
    matcher: '/api/:path*',
};
