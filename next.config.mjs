/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  reactStrictMode: false,
  distDir: "out",
  // Desabilitar algumas verificações durante a build para permitir a exportação estática
  experimental: {
    // Desabilitar temporariamente a otimização de fontes
    optimizeFonts: false,
  },
};

export default nextConfig;
