# Spec: Várhegy en 5 momentos

Estado: **APROBADA por Mari.** Los datos de la ciudad están en borrador y se pueden editar en los CSV.

## 1. Qué es

Una página con la historia de **Várhegy**, capital de Karpatenland, contada en 5 momentos.
Es una ciudad de **oposición (Polip)** al régimen militar **Oroszlan** que dominará en 3030.

- **Pieza principal:** una ciudad isométrica en pixel-art. Referente estilístico: *Into the Breach*.
- **Acompañan:** una línea de tiempo (5 ticks) y un **blurb** de texto fijo, uno por momento.
- **Idea clave:** la ciudad es el escenario; los datos de Karpatenland y del mundo son el contexto.

## 2. Reglas generales

- La ciudad se ve **entera** en isométrico; las interacciones hacen **zoom** hacia dentro (lupa, calle, objeto).
- Cada momento cambia la estética, el tipo de dato y la interacción.
- Pocos datos, bien visualizados. Mejor 10 personas bien hechas que 800 sin sentido.
- Los datos de la ciudad viven en CSV (`src/data/csv/`), no escritos dentro de componentes.
- Teclado y `prefers-reduced-motion` respetados en todas las interacciones.
- Sprites: un **kit pequeño y consistente**, reutilizado y retiñido por momento, más piezas únicas.
- Referencias de estilo: *Into the Breach*, VOTOMS (para LUPINE) y las capturas de pixel-art isométrico de Mari.

## 3. Los 5 momentos

### 1. Prehistoria · 2568
- **Ciudad:** tierras baldías, chozas de palo, pequeñas tribus indígenas. Sin edificios.
- **Interacción:** clic en el suelo → **lupa** con un **corte vertical** de la tierra.
- **Dato:** composición por capas (5) y sus minerales. Destaca el **Lenario**, el metal precioso responsable del avance tecnológico futuro (3 % del lecho cristalino).
- **Contexto real:** Karpatenland 649.984.210 habitantes.
- **Blurb:** el territorio antes de la colonización.

### 2. Primera civilización · 2730
- **Ciudad:** parecida a Bogotá 2024; edificios pequeños, vida corriente.
- **Interacción:** clic en las calles → zoom a la calle con personas.
- **Dato:** ficha por persona con aspecto de **documento clasificado**: nombre, edad, género, integrantes de la familia, un dato aleatorio.
- **Contexto real:** el país de Várhegy tiene 85 M; 70,1 % simpatiza con Oroszlan y 29,9 % con la oposición Polip (censo 2730).
- **Blurb:** esta primera civilización.

### 3. Incertidumbre política · 2945
- **Ciudad:** más avanzada, edificios altos, se acerca a una *night city*. Aparece **LUPINE**, un mecha.
- **Interacción A (calle):** como el momento 2, con otros datos.
- **Dato por persona:** horas por semana, medicinas diarias, **gráfica de torta** (% mecánico / % natural), # familiares, asociación política.
- **Interacción B (LUPINE):** tocar a LUPINE → **comparativa de tamaño** (LUPINE vs humanos vs edificios).
- **Interacción C (rifle):** **despiece interactivo** del rifle AMR-652-4 (ver sección 6).
- **Avance:** el espectador pulsa el botón de **disparo** para pasar al momento 4.
- **Contexto real:** Karpatenland en su **pico**, 1.319.469.878 habitantes.
- **Blurb:** de dónde vienen los problemas que llevan a la guerra.

### 4. Guerra · 2999
- **Ciudad:** destruida, fuego, zona de guerra. El tono cambia de "Hobbit" a *Into the Breach*.
- **Interacción:** visualización de la **división política y poblacional** de la ciudad.
- **Contexto real:** Karpatenland cae a 467.799.438 (−65 % vs 2945).
- **Blurb:** el porqué de la guerra.

### 5. Posguerra · 3030
- **Ciudad:** estado totalitario, **un solo color: el azul de Oroszlan** (el color del rey). Cambio completo de estética. Varios LUPINE. Personas uniformadas.
- **Interacción:** zoom a la calle: gente uniformada, militantes, colores, banderas. **Sin datos** de personas.
- **Contexto real:** Karpatenland 361.441.805. Ocupación mundial: Oroszlan 48,8 %, Polip 48,4 %, Otros 2,8 %.
- **Blurb:** la situación actual.

## 4. Datos (CSV en `src/data/csv/`)

Los 3 CSV originales **no se modifican**. Los nuevos están en **borrador editable**.

| Archivo | Contenido | Momento |
|---|---|---|
| `varhegy-estratos-2568.csv` | 5 capas, materiales y %, con el Lenario destacado | 1 |
| `varhegy-habitantes.csv` | 10 personas en 2730 y 10 en 2945 | 2 y 3 |
| `varhegy-division-2999.csv` | 6 zonas de la ciudad y quién las controla | 4 |
| `varhegy-demografia.csv` | población de Karpatenland, país y ciudad por momento | todos (blurb) |

### Regla para que los números cuadren con los censos originales
1. **Várhegy 2730:** el país tiene **85.000.000** (dato de Mari). Los porcentajes originales del censo (70,1 % / 29,9 %) se aplican sobre esa cifra: **59.585.000** Oroszlan y **25.415.000** Polip.
2. **Otros años:** el país sigue la curva real de Karpatenland. Es siempre el **10,95 %** de la población de Karpatenland en `tendencia-poblacional.csv` (85 M ÷ 775.912.340).
3. **Ciudad:** un % del país, editable (columna `pct_pais_en_ciudad`): 11 % en 2730, 15 % en 2945, 8 % en 2999, 10 % en 3030. En 2568 es una aldea de 18.000 personas.
4. **Muestras:** 7 de 10 personas simpatizan con Oroszlan en 2730 (≈ 70,1 %). En 2945 son 6 de 10, sin dato original: es un supuesto.
5. **2999:** las 6 zonas suman exactamente la población de la ciudad (4.100.000).

Aviso: las cifras del censo 2730 son de otra escala que las regionales (en `porcentaje-poblacional-por-pais-2730.csv` los 3 países de Karpatenland suman 8.246 unidades, y la región tiene 775,9 M). Se usan solo sus **porcentajes**, no sus valores absolutos.

## 5. Sonido (fase final)

- Momentos 1-3: sintetizador, tonos mayores, clic-clac en las interacciones.
- Momentos 4-5: darkwave, tonos menores, gritos a bajo volumen.
- Los navegadores solo reproducen audio tras una acción del usuario: el sonido arranca con un clic.

## 6. Referencias en el repo

- Despiece del rifle: `public/referencias/rifle-amr-652-4-despiece.jpg`.
  - Rifle **AMR-652-4**, antimaterial, 7,2 m. Dispara plasma humano polarizado, ~1,7 MW.
  - Piezas: cámara espectrográfica (sensores LiDAR, UV, IR, UAV), lente teleobjetivo 35-400 mm, ATF aid (auto tracking focus), membrana de tejido orgánico, reserva de plasma, condensador, boca del arma, plasma condensado, placas polarizadoras.
  - Es un dibujo: las piezas se **redibujarán en SVG** para poder separarlas.
- Los 7,2 m del rifle sirven de escala para la comparativa de tamaño de LUPINE.

## 7. Fuera de alcance por ahora

- Más ciudades o países.
- Mapa mundial interactivo (el actual en `/graficos/mapa` queda como está).
- Rediseño de las otras 4 gráficas de la web actual.

## 8. Decisiones tomadas

1. Nombre del metal precioso: **Lenario**.
2. El momento 5 es **3030**.
3. El país de Várhegy tiene **85 millones** en 2730 (ver regla en la sección 4).
4. El "color del rey" es el **azul de Oroszlan**.
5. El despiece del rifle es la imagen de la sección 6.
6. LUPINE: sin diseño fijo; referencias VOTOMS e *Into the Breach*.
7. El blurb es **texto fijo** por momento.

## 9. Plan de construcción

1. ~~Aprobar esta spec.~~ Hecho.
2. ~~CSV en borrador y sincronizar los CSV con `world.ts`.~~ Hecho.
3. Armazón: línea de tiempo, escenario y blurb, con escenas en colores planos.
4. Escenas en orden: 1 (lupa), 2 (calle), 3 (LUPINE y rifle), 4, 5.
5. Sprites definitivos y retoque visual.
6. Sonido, accesibilidad y publicación.
