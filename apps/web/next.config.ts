import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const monorepoRoot = path.resolve(dir, "../..");
const { version } = require("./package.json");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "@reborn/ui",
    "@reborn/components",
    "@reborn/form-builder",
    "@reborn/datatable-builder",
    "@reborn/hooks",
    "@reborn/contexts",
    "@reborn/lib",
    "@reborn/api-client",
  ],
  outputFileTracingRoot: monorepoRoot,
  turbopack: {
    root: monorepoRoot,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "**",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  env: {
    NEXT_PUBLIC_APP_VERSION: version,
  },
};

export default nextConfig;
