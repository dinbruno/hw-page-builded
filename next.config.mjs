/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  reactStrictMode: false,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_TENANT_ID: process.env.NEXT_PUBLIC_TENANT_ID || "2KXgoF4G6heP4SzudoRtcr7vUbM2",
    NEXT_PUBLIC_WORKSPACE_ID: process.env.NEXT_PUBLIC_WORKSPACE_ID || "4a1b7d73-7e51-47f5-9572-78d973f95c08",
  },
};

export default nextConfig;
