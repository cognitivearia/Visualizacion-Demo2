<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Proyecto: Archivo 3030

Página web que funciona como **archivo de visualización de datos de una obra de ficción**.
Punto focal: un **mapa isométrico en estilo pixelscape** + un **blurb informativo** con datos y visualizaciones.
Idioma de la UI y del contenido: español. Responder a Mari en español, claro y directo.

## Stack fijo (no cambiar sin avisar)

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS 4 + shadcn/ui (`src/components/ui/`) + `@base-ui/react`
- Recharts para gráficos, `motion` para animación de UI
- Datos en `src/data/` (CSV en `src/data/csv/`, catálogo en `catalog.ts`)
- Despliegue estático (GitHub Pages) vía `npm run export:pages`

## Herramientas: qué usar, por qué y cómo

### Usar siempre

| Herramienta | Por qué | Cómo |
|---|---|---|
| **Rules** (`.cursor/rules/`) | Es lo que más consistencia da al diseño | Guardar tokens (colores en `src/lib/palette.ts`, tipografías, escala de espaciado), stack y reglas del mapa pixel-art. Mantener cortas |
| **Navegador integrado de Cursor** | El agente ve lo que construye | Tras cada cambio visual: abrir `http://127.0.0.1:43127`, capturar y corregir. Probar móvil (390px) y escritorio (1440px) |
| **Plan mode** | Evita rehacer el mapa | Usar antes de cambios grandes: capas del mapa, secciones del blurb, nuevas visualizaciones |
| **shadcn/ui + Tailwind** | Componentes y sistema de diseño coherentes | Reutilizar `src/components/ui/`; no crear componentes propios si shadcn ya tiene uno. Añadir con `npx shadcn add <componente>` |
| **Recharts** | Ya instalado, encaja con los CSV | Un componente por gráfico en `src/components/charts/`, envuelto en `chart-frame.tsx` |
| **Context7 (MCP)** | Next 16, React 19 y Tailwind 4 cambiaron APIs | Consultar docs actuales antes de usar una API dudosa. Complementa (no sustituye) la guía en `node_modules/next/dist/docs/` |
| **Subagentes** | Mantienen limpio el chat principal | Delegar auditorías: accesibilidad, responsive, rendimiento del mapa |
| **Skill `frontend-design`** (Anthropic) | Evita estética genérica | Leerla antes de instalarla. Aplicarla al blurb y a las tarjetas, respetando la dirección pixel-art |

### Usar con criterio

| Herramienta | Cuándo |
|---|---|
| **Skill `canvas` / `visualize`** | Bocetos rápidos de layout o de un gráfico antes de implementarlo. Son desechables, no son código del proyecto |
| **GenerateImage** | Referencias de mood, tiles o sprites conceptuales del pixelscape. Es imagen, no código: los assets finales se revisan a mano |
| **GSAP** | Solo si el mapa necesita animación compleja (cámara, transiciones entre zonas, scroll). Para microinteracciones basta `motion` |
| **Playwright MCP** | Capturas automáticas en varios tamaños; útil si el navegador integrado se queda corto |
| **SDD / OpenSpec** | Solo para features grandes (p. ej. mapa interactivo con zonas clicables). Primero specs en texto, Mari aprueba, luego se implementa |

### No usar en este proyecto

- **Figma MCP**: no hay diseños de Figma que implementar (reconsiderar si aparecen).
- **Remotion, Motion Canvas, Manim, Lottie, ffmpeg, v0**: son para video o generación de UI externa; no aplican a una web de datos.
- **Mermaid / matplotlib / plotly**: los gráficos finales van en Recharts dentro de la web. Solo usar Mermaid para diagramas de planeación en el chat.
- **Hooks y MCPs adicionales**: no añadir sin necesidad real.

## Skills y MCPs recomendados que van de la mano

- **Skill de Next.js / React best practices** (p. ej. de Vercel): rendimiento y buenas prácticas de App Router.
- **Skill de accesibilidad (a11y)**: contraste, foco, `aria-label` en gráficos y mapa, `prefers-reduced-motion`.
- **shadcn MCP**: buscar y añadir componentes sin salir del chat.
- **Context7 MCP**: documentación al día (ver arriba).
- **Playwright MCP** (opcional): pruebas visuales multi-resolución.
- **GitHub MCP / `gh`**: ramas y PRs para publicar en GitHub Pages.

## El mapa isométrico pixelscape

- Vive en `src/components/charts/population-map.tsx`; la geometría en `src/data/map-geometry.ts`.
- Mantener **pixel-perfect**: `image-rendering: pixelated`, sin escalados fraccionarios, rejilla de tiles consistente.
- Preferir SVG o canvas; si hay sprites, un único atlas por capa.
- Cada zona debe ser accesible por teclado y tener texto alternativo.
- Respetar `prefers-reduced-motion` en cualquier animación del mapa.
- Los datos del mapa salen de los CSV; no hardcodear cifras en el componente.

## Flujo de trabajo

1. **Referencia primero**: pedir a Mari una captura o sitio de referencia (GSAP showcase, otros pixelscapes).
2. **Plan** corto (3–5 pasos) antes de cambios grandes; esperar OK.
3. **Implementar** con cambios mínimos y revisables.
4. **Verificar** en el navegador integrado: móvil y escritorio, captura y ajuste.
5. **Compactar o abrir chat nuevo** al terminar una sección.

## Límites

- El agente **no ve el movimiento**: puede capturar frames, pero Mari valida tiempos y easing.
- Antes de borrar, migrar dependencias, publicar o tocar secretos: avisar a Mari.
- Después de editar, ejecutar `npm run lint`.
- Explicar los cambios en lenguaje humano; detalle técnico solo si Mari lo pide.
