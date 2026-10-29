import type { NextConfig } from "next";

const isGitHubPagesBuild = process.env.GITHUB_PAGES === "true";
const githubPagesBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const sanityImagePattern = {
  protocol: "https" as const,
  hostname: "cdn.sanity.io",
  pathname: "/images/**",
};

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  ...(isGitHubPagesBuild
    ? {
        output: "export" as const,
        basePath: githubPagesBasePath,
        trailingSlash: true,
        images: {
          loader: "custom" as const,
          loaderFile: "./src/lib/image-loader.ts",
          remotePatterns: [sanityImagePattern],
        },
      }
    : {
        images: {
          remotePatterns: [sanityImagePattern],
        },
        async headers() {
          return [
            {
              source: "/(.*)",
              headers: securityHeaders,
            },
          ];
        },
      }),
};

export default nextConfig;
