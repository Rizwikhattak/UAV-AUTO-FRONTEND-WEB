/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    viewTransition: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "**", // matches any hostname
        port: "5000",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
