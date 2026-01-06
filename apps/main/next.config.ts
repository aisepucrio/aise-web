// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@shared/ui"],
  eslint: {
    ignoreDuringBuilds: true, // ignora erros de lint durante o build
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
};

module.exports = nextConfig;
