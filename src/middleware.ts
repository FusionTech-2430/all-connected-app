import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

const publicRoutes = ['/', '/sign-in', '/sign-up', '/forgot-password']

export async function middleware(request: NextRequest) {
  const cookieStore = cookies()
  const { pathname } = request.nextUrl

  // Get the access token from the cookie store
  const accessToken = cookieStore.get('access-token')

  // If the access token is not present and the route is not public, redirect to the sign-in page
  if (!accessToken && !publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/sign-in', request.nextUrl))
  }

  // If the access token is present and the route is a public route, redirect to the home page
  if (accessToken && publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/home', request.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /**
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'
  ]
}
