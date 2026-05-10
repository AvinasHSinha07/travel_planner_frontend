import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api/v1";
    const backEndBase = apiUrl.replace(/\/api\/v1\/?$/, '').replace(/\/$/, '');

    return [
      {
        source: "/api/v1/:path*",
        destination: `${backEndBase}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
