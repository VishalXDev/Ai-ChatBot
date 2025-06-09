import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true, // faster builds with SWC
  experimental: {
    serverActions: {}, // enable server actions with default options (Next.js 14+)
  },
  images: {
    domains: [
      "images.unsplash.com", // remove if not needed
      "cdn.openai.com",       // optional if using OpenAI image endpoints
      "yourdomain.com",       // replace with your hosted assets domain
    ],
  },
};

export default nextConfig;
