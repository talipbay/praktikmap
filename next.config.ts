import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/praktikoffice' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/praktikoffice/' : '',
};

export default nextConfig;
