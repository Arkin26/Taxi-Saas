// // import type { NextConfig } from "next";

// // const nextConfig: NextConfig = {
// //   /* config options here */
// // };

// // export default nextConfig;

// import type { NextConfig } from 'next';

// const nextConfig: NextConfig = {
//   // eslint config removed - no longer supported in Next.js 16
//   // ESLint will still run via `npm run lint` or in your IDE
  
//   typescript: {
//     ignoreBuildErrors: false, // ✅ still fail on real TS errors
//   },
// };

// export default nextConfig;

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone', // ✅ add here

  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
