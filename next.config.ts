import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // packages/db e packages/s3-images são workspace packages cujo "main"
  // aponta direto pra fonte TS (sem build próprio) — precisam ser
  // transpilados pelo Next, assim como quando eram usados pelos apps antigos.
  transpilePackages: ["@shared/db", "@shared/s3-images"],
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

export default nextConfig;
