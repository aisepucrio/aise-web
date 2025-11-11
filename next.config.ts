// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ignora erros de lint durante o build
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "imgbox.com",
      },
      {
        protocol: "https",
        hostname: "images2.imgbox.com",
      },
      {
        protocol: "https",
        hostname: "thumbs2.imgbox.com",
      },
    ],
  },
};

module.exports = nextConfig;
