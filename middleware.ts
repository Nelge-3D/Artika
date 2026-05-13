import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Logique de middleware personnalisée
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
)

export const config = {
  matcher: ["/dashboard/:path*", "/upload/:path*", "/user/:path*", "/settings/:path*"]
}