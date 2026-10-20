import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async redirects() {
    return [{
      source: "/legal-help-maharashtra",
      destination: "/legal-help",
      permanent: true,
    }, {
      source: "/:path*",
      has: [{ type: "host", value: "www.nyaysaathi.in" }],
      destination: "https://nyaysaathi.in/:path*",
      permanent: true,
    }];
  },
  async headers() {
    return [
      { source: "/admin-firebase-messaging-sw.js", headers: [
        { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
        { key: "Content-Type", value: "application/javascript; charset=utf-8" },
      ] },
      // Headers also cover query-string variants and all client-rendered admin pages.
      { source: "/admin-lawyersite/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
      { source: "/track-appointment", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
    ];
  },
};

export default nextConfig;
