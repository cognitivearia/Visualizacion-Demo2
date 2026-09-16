export function formatPeople(value: number) {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toLocaleString("es-ES", {
      maximumFractionDigits: 2,
    })} mil millones`
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toLocaleString("es-ES", {
      maximumFractionDigits: 1,
    })} M`
  }
  return value.toLocaleString("es-ES", { maximumFractionDigits: 1 })
}

export function toMillions(value: number) {
  return Math.round(value / 1_000_000)
}
