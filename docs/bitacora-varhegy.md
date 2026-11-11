# Bitácora de Várhegy

Estado al 10 de noviembre de 2026. La spec sigue en `docs/spec-varhegy.md`. Esta bitácora cuenta qué se decidió en cada etapa y cómo se ve ahora.

Las capturas son del estado actual, tomadas en `http://127.0.0.1:43127/varhegy/`. No recuperan las versiones intermedias de bloques lisos: esas piezas ya son los sprites. En algunas ventanas aparece una pastilla roja que dice «1 Issue»: es del navegador de prueba, no de la página.

Los números marcados como borrador se editan en los CSV de `src/data/csv/`. La web los lee al arrancar.

## 1. La ciudad, no el mundo

El mapa protagonista es Várhegy, capital de Karpatenland, contada en cinco momentos. Es una ciudad de oposición (Polip) al régimen Oroszlan de 3030. Los datos del país y del continente son contexto.

Cinco momentos: 2568 prehistoria, 2730 primera civilización, 2945 incertidumbre, 2999 guerra, 3030 posguerra.

## 2. Los números

Los tres CSV originales del censo no se tocaron. Los de la ciudad son borrador.

Regla para que cuadren con el censo:

- En 2730 el país de Várhegy tiene 85 millones. El 70,1 % simpatiza con Oroszlan y el 29,9 % con Polip.
- En los otros años el país es el 10,95 % de Karpatenland.
- La ciudad es un porcentaje del país: 11 % en 2730, 15 % en 2945, 8 % en 2999, 10 % en 3030. En 2568 es una aldea de 18.000 personas.

## 3. El armazón

Una línea de tiempo de cinco marcas, la maqueta isométrica y un texto fijo por momento. La maqueta no se encoge cuando se abre un dato: lupa, calle, rifle y mapa del continente salen en una ventana encima.

## 4. 2568 · el suelo

Tierras baldías, tres chozas y matas de pasto. Clic en el suelo: una lupa con el corte de cinco capas. El Lenario está en el lecho cristalino.

![Maqueta de 2568, con chozas y el suelo resaltado](capturas/01-prehistoria.png)

![Lupa del corte de tierra](capturas/02-lupa.png)

Datos: `varhegy-estratos-2568.csv`.

## 5. 2730 · la calle y el consejo

Ciudad baja, ventanas cálidas. Clic en la calle: diez personas y un expediente con aspecto de documento clasificado.

Antes de elegir a alguien se ve el consejo de la ciudad: 18 escaños de Oroszlan y 7 de Polip. Es el gobierno local. No repite el 70,1 % del censo del país.

![Ciudad de 2730](capturas/03-ciudad-2730.png)

![Consejo de 18 y 7 escaños](capturas/04-consejo-2730.png)

Datos: `varhegy-habitantes.csv` y `varhegy-vida-urbana.csv`.

## 6. 2945 · la calle, el mecha y el rifle

Edificios altos, ventanas cian y un LUPINE en la plaza. Hay dos zonas tocables.

La calle repite el expediente y suma horas, medicinas y la torta mecánico / natural. El consejo queda 13 a 12. La ciudad, en conjunto, trabaja 61 h por semana y la ración es de 2 al día. Esas dos cifras acompañan cada ficha.

LUPINE abre la comparativa de tamaño (persona 1,7 m, rifle 7,2 m, edificio 19 m, mecha 30 m) y el despiece del rifle AMR-652-4. El botón Disparar cierra la ventana y pasa a 2999.

![Ciudad de 2945 con LUPINE](capturas/05-ciudad-2945.png)

![Comparativa de tamaño](capturas/06-lupine-tamano.png)

La altura del mecha es borrador en `varhegy-escala.csv`. Las piezas del rifle están en `src/data/varhegy-rifle.ts`.

## 7. Los sprites

Un solo kit, reteñido por momento: edificio con ventanas y antena, choza, escombros, fuego, LUPINE, pasto o piedras, y marcas de calle. Vive en `src/components/varhegy/sprites.tsx`. Se ve en las capturas de cada año.

## 8. 2999 · la guerra

Seis fuegos, uno por zona. El color es el bando: azul régimen, morado oposición, naranja frente, gris campamentos.

Al tocar un fuego se abre el mapa del continente, el mismo de la visualización de población. El negro es quien estaba en 2945 y ya no está en 2999. Al lado, los muertos de ese bando. Esos muertos son borrador y suman los 17.582.000 que faltan en la ciudad. El censo no cuenta muertos: cuenta quién falta.

![Fuegos por bando](capturas/07-guerra-2999.png)

![Mapa del continente en 2999](capturas/08-mapa-2999.png)

Datos: `varhegy-bajas-2999.csv`. El número de cada fila es el total del bando, no de una sola zona.

| Región | Falta en 2999 |
|---|---|
| Nagy-Alföld | 38 % |
| Dunántúl | 54 % |
| Karpatenland | 65 % |
| Alpenvorland | 83 % |
| Ostseeküste | 89 % |

## 9. 3030 · un solo azul

La ciudad es azul Oroszlan. Hay varios LUPINE, banderas y gente uniformada, sin expedientes.

En la calle, de 12 murales quedan 2 visibles. El resto está tapado de azul.

![Ciudad de 3030](capturas/09-ciudad-3030.png)

![Calle con dos murales visibles](capturas/10-murales-3030.png)

Datos: la fila 3030 de `varhegy-vida-urbana.csv`.

## 10. Qué falta

- La escala ciudad / país / región dentro del suelo de la calle. Se acordó hacerla dentro del mundo, no como barra en el texto.
- Sonido, revisión en móvil y publicación.
- Retoque a mano de sprites y de los textos del blurb, que siguen en borrador.

## Dónde está cada cosa

| Qué | Dónde |
|---|---|
| Escenas, textos y colores | `src/data/varhegy.ts` |
| Maqueta | `src/components/varhegy/iso-stage.tsx` |
| Sprites | `src/components/varhegy/sprites.tsx` |
| CSV editables | `src/data/csv/varhegy-*.csv` |
