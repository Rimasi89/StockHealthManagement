export { default } from "next-auth/middleware";

export const config = {
  // Protect all routes except login, API auth routes, and static assets
  matcher: [
    "/dashboard/:path*",
    "/portfolio/:path*",
    "/analysis/:path*",
    "/insights/:path*",
  ],
};
