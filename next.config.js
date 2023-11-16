/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { unoptimized: true },
  experimental: {
    nextScriptWorkers: true,
  },
};

module.exports = nextConfig;
