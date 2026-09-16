import { existsSync, readdirSync, readFileSync, renameSync, writeFileSync } from "node:fs"
import path from "node:path"

const outDir = path.join(process.cwd(), "out")
const hiddenNext = path.join(outDir, "_next")
const publicNext = path.join(outDir, "next")

function walk(dir) {
  const entries = readdirSync(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) files.push(...walk(full))
    else files.push(full)
  }
  return files
}

if (!existsSync(outDir)) {
  throw new Error("No existe la carpeta out/. Corre npm run build antes.")
}

if (existsSync(hiddenNext) && !existsSync(publicNext)) {
  renameSync(hiddenNext, publicNext)
}

const textExt = new Set([".html", ".js", ".css", ".json", ".txt", ".map"])

for (const file of walk(outDir)) {
  if (!textExt.has(path.extname(file))) continue
  const before = readFileSync(file, "utf8")
  const after = before.replaceAll("/_next/", "/next/")
  if (after !== before) writeFileSync(file, after)
}

writeFileSync(path.join(outDir, ".nojekyll"), "")
