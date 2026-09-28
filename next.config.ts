import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client", "bcryptjs"],
  experimental: {
    // Next 15 defaults dynamic staleTime to 0, so every sidebar click refetches RSC.
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },
  // Trailing "." is treated as a file extension, so middleware often never runs.
  async redirects() {
    return [
      { source: "/login\\.", destination: "/login", permanent: false },
      { source: "/signup\\.", destination: "/signup", permanent: false },
      { source: "/features\\.", destination: "/features", permanent: false },
      { source: "/pricing\\.", destination: "/pricing", permanent: false },
      { source: "/dashboard\\.", destination: "/dashboard", permanent: false },
      { source: "/dashboard/scan", destination: "/dashboard/sell", permanent: false },
    ];
  },
};

export default nextConfig;
