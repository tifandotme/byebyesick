/** @type {import('next').NextConfig} */
const config = {
  output: "standalone",
  reactStrictMode: false,
  env: {
    BASE_URL: process.env.NEXT_PUBLIC_DB_URL,
  },
  basePath: process.env.NEXT_PUBLIC_SITE_PATH,

  async redirects() {
    if (process.env.NEXT_PUBLIC_SITE_PATH === "") return []
    return [
      {
        source: "/",
        destination: `${process.env.NEXT_PUBLIC_SITE_PATH}`,
        basePath: false,
        permanent: false,
      },
    ]
  },
  images: {
    unoptimized: true,
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
      {
        protocol: "https",
        hostname: "byebyesick-bucket.irfancen.com",
      },
      {
        protocol: "https",
        hostname: "cdn0.iconfinder.com",
      },
      {
        protocol: "https",
        hostname: "digitalent.games.test.shopee.io",
      },
    ],
  },
}

export default config
