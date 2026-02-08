import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  devIndicators: {
    position: "bottom-right",
  },
  // Experimental settings for better SSG compatibility
  experimental: {
    // Disable strict mode during build to avoid double-render issues
  },
};

export default nextConfig;

