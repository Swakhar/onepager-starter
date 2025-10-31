/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['your-supabase-bucket-url', 'images.unsplash.com'],
  },
}
module.exports = nextConfig
