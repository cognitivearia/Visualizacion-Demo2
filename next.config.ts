import type { NextConfig } from "next"

const repoBase = "/Visualizacion-Demo"
const basePath =
  process.env.NEXT_PUBLIC_BASE_PATH ||
  process.env.PAGES_BASE_PATH ||
  (process.env.NODE_ENV === "production" ? repoBase : "")

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  ...(basePath
    ? {
        basePath,
        assetPrefix: basePath,
      }
    : {}),
  devIndicators: false,
}

export default nextConfig
