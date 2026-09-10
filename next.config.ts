import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client", "bcryptjs"],
  // Trailing "." is treated as a file extension, so middleware often never runs.
  async redirects() {
    return [
      { source: "/login\\.", destination: "/login", permanent: false },
      { source: "/signup\\.", destination: "/signup", permanent: false },
      { source: "/features\\.", destination: "/features", permanent: false },
      { source: "/pricing\\.", destination: "/pricing", permanent: false },
      { source: "/dashboard\\.", destination: "/dashboard", permanent: false },
    ];
  },
};

export default nextConfig;
