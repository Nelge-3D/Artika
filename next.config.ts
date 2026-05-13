import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Vercel Blob is already a CDN — skip Next.js proxy in dev to avoid timeout errors.
    // On Vercel production, the platform's native optimizer takes over automatically.
    unoptimized: process.env.NODE_ENV !== 'production',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: '*.blob.vercel-storage.com',
      },
    ],
  },
};

export default nextConfig;
