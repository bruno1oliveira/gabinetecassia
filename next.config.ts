import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  // Força modo dinâmico (evita SSG)
  experimental: {
    disableOptimizedLoading: true,
  },

  devIndicators: {
    position: "bottom-right",
  },
};

export default nextConfig;
