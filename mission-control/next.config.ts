import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  // Turbopack optimized settings
  experimental: {
    // any experimental flags needed for R3F in Turbopack
  },
  // Ensure we can build without errors for now if there are lingering issues
  // Note: Next 16 might require different flags for ignoring errors
};

export default nextConfig;
