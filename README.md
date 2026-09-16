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

Origin guarda el código, pero no publica el sitio. La web sale por **GitHub Pages**.

Dirección: [https://cognitvearia.github.io/Visualizacion-Demo/](https://cognitvearia.github.io/Visualizacion-Demo/)

1. Crea en GitHub un repo vacío llamado `Visualizacion-Demo`.
2. Desde WSL, en la carpeta del proyecto:

```bash
git remote add github https://github.com/cognitivemari/Visualizacion-Demo.git
git push -u github main
```

3. En GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
4. Espera a que termine la acción *Deploy to GitHub Pages*. Cada push a `main` vuelve a publicar.

## Paleta

- Azul: Oroszlan
- Morado: Polip
- Verde: otros / totales
- Fondos: grises púrpura
