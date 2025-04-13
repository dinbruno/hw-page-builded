/** @type {import('next').NextConfig} */
const nextConfig = {
  // Normal Next.js app configuration (removed static export settings)
  reactStrictMode: true,
  images: {
    domains: ["firebasestorage.googleapis.com", "storage.googleapis.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
