import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === "production";

/**
 * Static CSP.
 *
 * A nonce-based policy would give stronger script protection, but Next.js
 * only applies nonces to dynamically rendered pages, which would force every
 * prerendered marketing page to render per request. A static policy keeps the
 * site statically generated while still blocking the common injection vectors.
 *
 * 'unsafe-inline' is required for script-src because Next.js emits inline
 * bootstrap scripts.
 */
function buildCsp(): string {
  const directives: string[] = [
    "default-src 'self'",
    // Next.js emits inline bootstrap scripts, so 'unsafe-inline' is required.
    `script-src 'self' 'unsafe-inline' https://connect.facebook.net${
      isProduction ? "" : " 'unsafe-eval'"
    }`,
    "style-src 'self' 'unsafe-inline'",
    // Landing pages may reference remote imagery over HTTPS.
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    `connect-src 'self' https://connect.facebook.net${
      isProduction ? "" : " ws: wss:"
    }`,
    // Required by the Meta Pixel iframe.
    "frame-src 'self' https://www.facebook.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ];

  if (isProduction) {
    directives.push("upgrade-insecure-requests");
  }

  return directives.join("; ");
}

const securityHeaders = [
  { key: "Content-Security-Policy", value: buildCsp() },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "off" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  ...(isProduction
    ? [
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
      ]
    : []),
];

const nextConfig: NextConfig = {
  images: {
    // Only operator-controlled hosts may be fetched by the image optimizer.
    // Admin-supplied media is expected to live on Cloudinary.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        // Admin surfaces expose analytics and configuration; keep them out of
        // caches, CDNs and search indexes.
        source: "/admin/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store, max-age=0, must-revalidate" },
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
        ],
      },
      {
        source: "/api/admin/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store, max-age=0, must-revalidate" },
        ],
      },
    ];
  },
};

export default nextConfig;
