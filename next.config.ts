// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // 🚫 do not block builds on lint errors
  },
  typescript: {
    ignoreBuildErrors: false, // ✅ still fail on real TS errors
  },
};

export default nextConfig;
