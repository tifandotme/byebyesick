/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: false,
  env: {
    PUBLIC_URL: process.env.NEXT_PUBLIC_BASE_URL,
  },
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
}

export default config
