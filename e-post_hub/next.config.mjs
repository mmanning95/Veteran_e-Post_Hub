/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      turbo: {
        resolveAlias: {
          canvas: './empty-module.ts', 
        },
      },
    },
    swcMinify: false, 
  };
  
  export default nextConfig;