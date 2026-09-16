export type CsvRow = Record<string, string>

export function parseCsv(text: string): CsvRow[] {
  const clean = text.replace(/^\uFEFF/, "").trim()
  if (!clean) return []

  const lines = clean.split(/\r?\n/).filter((line) => line.trim().length > 0)
  const headerLine = lines[0] ?? ""
  const delimiter = detectDelimiter(headerLine)
  const headers = splitCsvLine(headerLine, delimiter).map(normalizeHeader)

  return lines.slice(1).map((line) => {
    const cells = splitCsvLine(line, delimiter)
    const row: CsvRow = {}
    headers.forEach((header, index) => {
      if (!header) return
      row[header] = (cells[index] ?? "").trim()
    })
    return row
  })
}

export function toNumber(value: string | undefined) {
  if (!value) return 0
  const trimmed = value.trim().replace(/%/g, "")
  if (!trimmed) return 0
  const normalized = trimmed.includes(",") && !trimmed.includes(".")
    ? trimmed.replace(/\./g, "").replace(",", ".")
    : trimmed.replace(/,/g, "")
  const parsed = Number(normalized)
  return Number.isFinite(parsed) ? parsed : 0
}

function detectDelimiter(header: string) {
  const commas = header.split(",").length
  const semis = header.split(";").length
  return semis > commas ? ";" : ","
}

function normalizeHeader(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "")
}

function splitCsvLine(line: string, delimiter: string) {
  const cells: string[] = []
  let current = ""
  let quoted = false

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index]
    const next = line[index + 1]
    if (char === '"' && quoted && next === '"') {
      current += '"'
      index += 1
      continue
    }
    if (char === '"') {
      quoted = !quoted
      continue
    }
    if (char === delimiter && !quoted) {
      cells.push(current)
      current = ""
      continue
    }
    current += char
  }
  cells.push(current)
  return cells
}
