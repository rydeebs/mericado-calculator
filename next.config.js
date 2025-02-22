/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
      return [
        {
          source: "/:path*",
          headers: [
            {
              key: "X-Frame-Options",
              value: "ALLOWALL", // Allows the page to be displayed in a frame on any site
            },
            {
              key: "Access-Control-Allow-Origin",
              value: "*", // Allows requests from any origin
            },
            {
              key: "Content-Security-Policy",
              value: "frame-ancestors 'self' https://*.webflow.com https://webflow.com", // Restricts which domains can embed this content
            },
          ],
        },
      ]
    },
    // Add any other Next.js config options here if needed
  }
  
  module.exports = nextConfig
  
  