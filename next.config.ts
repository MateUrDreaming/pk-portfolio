import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    authInterrupts: true,
  },
  eslint: {
  ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      { 
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'media.licdn.com'
      }
    ],
  },
};

export default nextConfig;
