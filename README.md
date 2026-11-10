# Archivo 3030

Portal de visualización para un universo **cyberpunk / mecha**. El año en curso es 3030: el mundo quedó partido entre **Oroszlan** y **Polip**.

Los gráficos leen tres CSV:

- `src/data/csv/division-territorial-3030.csv` — ocupación mundial
- `src/data/csv/porcentaje-poblacional-por-pais-2730.csv` — simpatías por país
- `src/data/csv/tendencia-poblacional.csv` — población por región (2568–3030)

El **mapa** usa el atlas del continente. Cada tierra se apaga o se enciende con su censo:

- Rosa — Ostseeküste (Patriarchate of Heraria)
- Lima — Dunántúl (Protectorate of Panes)
- Menta — Nagy-Alföld (Hudevorian Empire)
- Naranja — Karpatenland (Diocese of Cordamilia)
- Azul claro — Alpenvorland (Grand Duchy of Avevaria)

## Cómo abrirlo en local

```bash
npm install
npm run dev
```

Abre [http://localhost:43127](http://localhost:43127).

## Página web (GitHub Pages)

Dirección: [https://cognitivearia.github.io/Visualizacion-Demo2/](https://cognitivearia.github.io/Visualizacion-Demo2/)

El repo es `cognitivearia/Visualizacion-Demo2`. Pages publica bajo ese nombre (`/Visualizacion-Demo2`), no bajo `Visualizacion-Demo`.

1. En GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. Cada push a `main` corre la acción *Deploy to GitHub Pages* y vuelve a publicar.
3. Para generar el mismo export en local:

```bash
npm run export:pages
```

Ese script fija `NEXT_PUBLIC_BASE_PATH=/Visualizacion-Demo2`.

## Paleta

- Azul: Oroszlan
- Morado: Polip
- Verde: otros / totales
- Fondos: grises púrpura
