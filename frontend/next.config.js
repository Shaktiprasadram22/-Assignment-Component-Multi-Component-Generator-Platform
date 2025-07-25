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
};

module.exports = nextConfig;
