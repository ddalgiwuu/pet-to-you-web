/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@pet-to-you/ui'],
  images: {
    domains: ['localhost'],
  },
}

module.exports = nextConfig
