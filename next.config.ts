import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // The music route reads tracks from /audio at runtime; ship them with it
  outputFileTracingIncludes: {
    "/api/music/[theme]": ["./audio/**/*"],
  },
};

export default nextConfig;
