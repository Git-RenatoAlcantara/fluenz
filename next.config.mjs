/** @type {import('next').NextConfig} */
import path from "path";

//https://imgcdn.stablediffusionweb.com/2024/4/17/3b3ceb83-440b-4402-8461-00514a71c584.jpg
const nextConfig = {
  publicRuntimeConfig: {
    // Will be available on both server and client
    staticFolder: "/static",
  },
  headers: () => [
    {
      source: '/',
      headers: [
        {
          key: 'Cache-Control',
          value: 'no-store',
        },
      ],
    },
  ],
  images: {
    domains: [
      "imgcdn.stablediffusionweb.com",
      "images.unsplash.com"
    ],
    unoptimized: true
  },
  webpack(config, options) {
    // Further custom configuration here
    config.resolve.alias["Static"] = path.join(process.cwd(), "public");
    config.resolve.alias["Public"] = path.join(process.cwd(), "public");

    return config;
  },
};

export default nextConfig;