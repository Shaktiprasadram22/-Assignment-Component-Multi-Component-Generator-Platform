/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  output: "export", // Enable static export for Netlify
  images: {
    unoptimized: true, // Required for static export
  },
  env: {
    BACKEND_URL:
      process.env.NODE_ENV === "production"
        ? "https://ai-component-generator-backend-6yc0.onrender.com"
        : "http://localhost:5000",
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination:
          process.env.NODE_ENV === "production"
            ? "https://ai-component-generator-backend-6yc0.onrender.com/api/:path*" // Your actual backend URL
            : "http://localhost:5000/api/:path*",
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://unpkg.com https://cdn.tailwindcss.com; object-src 'none'; connect-src 'self' https://ai-component-generator-backend-6yc0.onrender.com;",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
