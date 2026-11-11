// Genera src/data/csv-sources.generated.ts a partir de los archivos de src/data/csv/.
// Así la web siempre usa los CSV reales: editas el CSV y la web cambia.
// Se ejecuta solo antes de `npm run dev` y `npm run build` (ver package.json).
import { readdirSync, readFileSync, writeFileSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const csvDir = join(root, "src", "data", "csv")
const out = join(root, "src", "data", "csv-sources.generated.ts")

const files = readdirSync(csvDir).filter((name) => name.endsWith(".csv")).sort()

const entries = files.map((name) => {
  const key = name.replace(/\.csv$/, "")
  const text = readFileSync(join(csvDir, name), "utf8").replace(/^\uFEFF/, "")
  return `  ${JSON.stringify(key)}: ${JSON.stringify(text)},`
})

const content = `// ARCHIVO GENERADO por scripts/sync-csv.mjs. No editar a mano: edita src/data/csv/*.csv.
export const csvSources = {
${entries.join("\n")}
} as const
`

writeFileSync(out, content, "utf8")
console.log(`sync-csv: ${files.length} CSV -> src/data/csv-sources.generated.ts`)
