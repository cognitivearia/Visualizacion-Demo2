const repoBase = "/Visualizacion-Demo"

export const basePath =
  process.env.NEXT_PUBLIC_BASE_PATH ||
  process.env.PAGES_BASE_PATH ||
  (process.env.NODE_ENV === "production" ? repoBase : "")

export function withBasePath(path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`
  return `${basePath}${normalized}`
}
