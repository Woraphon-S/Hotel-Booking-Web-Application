import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  // ซ่อนป้าย Next.js (Dev Tools indicator) มุมซ้ายล่างตอน dev mode
  // (build/runtime error ยังแสดงตามปกติ)
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
