# Spec: casillas de la calle

Estado: **paso 1 en revisión.** 2945 ya usa las cinco casillas. No se construye el paso 2 hasta ver este en el navegador.

La base ya aprobada es 2730: cinco casillas, dos personas en cada una, y Anterior / Siguiente dentro de la ventana. 2945 y 3030 siguen mostrando la calle entera.

## Regla de este trabajo

Un paso = un cambio visible. Se mira en `http://127.0.0.1:43127/varhegy/`. Si la calle o las personas dejan de leerse, el paso no pasa.

## Paso 1 · 2945 usa las mismas cinco casillas

Solo la calle de 2945. El LUPINE del mapa no se toca: sigue abriendo el tamaño y el rifle.

- Las diez personas de 2945 se reparten de dos en dos, en el mismo orden de tramos que 2730.
- Cada casilla del mapa abre su tramo. Dentro de la ventana se pasa a la casilla de al lado.
- El expediente, las horas, la ración y el consejo quedan como están.
- En esta calle no entra ningún robot.

Criterio para darlo por bueno: en la casilla se reconocen las dos personas y los edificios, sin un cielo vacío que se coma la calle.

## Paso 2 · silueta en 2730

Todavía no se construye.

La silueta aparece en una sola casilla, la 5, de pie en la calle. Las dos personas de esa casilla siguen viéndose enteras a sus pies.

El archivo dice que LUPINE mide 30 m y una persona 1,7 m. Puesto así, el robot llena la ventana y la calle desaparece. Esa prueba ya se vio y no sirve.

Propuesta para que se vea bien: en la casilla, la silueta es unas tres veces una persona. Se lee más alta que la gente y que el edificio de al lado, y cabeza, hombros y piernas caben en la misma vista. La medida real de 30 m sigue en la ventana de tamaño de 2945.

## Paso 3 · robots en 3030

Todavía no se construye. Usa el tamaño que se apruebe en el paso 2.

- 3030 también se parte en cinco casillas.
- Hay un robot en cada una.
- El civil de esa casilla está en la esquina opuesta al robot. El soldado puede quedar más cerca.
- Personas y robot se ven enteros, sin tener que bajar una ventana larguísima.
