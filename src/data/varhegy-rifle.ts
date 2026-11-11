/**
 * Piezas del rifle antimaterial AMR-652-4 (referencia: public/referencias/rifle-amr-652-4-despiece.jpg).
 * Los nombres y datos numéricos salen de la hoja de Mari. Las descripciones cortas son
 * BORRADOR (deducidas del dibujo): Mari las corrige aquí.
 */

export type RiflePartId =
  | "placas"
  | "plasma"
  | "boca"
  | "condensador"
  | "reserva"
  | "membrana"
  | "cuerpo"
  | "atf"
  | "camara"
  | "lente"

export type RiflePart = {
  id: RiflePartId
  name: string
  description: string
  /** Cuánto se desplaza la pieza al abrir el despiece al máximo (en unidades del dibujo). */
  explode: { dx: number; dy: number }
}

export const rifle = {
  name: "AMR-652-4",
  kind: "Rifle antimaterial",
  lengthM: 7.2,
  powerMW: 1.7,
}

export const rifleParts: RiflePart[] = [
  {
    id: "placas",
    name: "Placas polarizadoras",
    description:
      "Dos placas que rodean el plasma. Lo polarizan para que pueda liberarse como descarga.",
    explode: { dx: -30, dy: 0 },
  },
  {
    id: "plasma",
    name: "Plasma condensado",
    description: "El plasma ya condensado: es la munición del rifle antes de salir por la boca.",
    explode: { dx: -70, dy: 0 },
  },
  {
    id: "boca",
    name: "Boca de arma",
    description: "Por aquí sale la descarga de plasma.",
    explode: { dx: -5, dy: 0 },
  },
  {
    id: "condensador",
    name: "Condensador",
    description: "Condensa el plasma entre la reserva y la boca del arma.",
    explode: { dx: 25, dy: 0 },
  },
  {
    id: "reserva",
    name: "Reserva de plasma",
    description:
      "El rifle utiliza plasma humano como munición principal. Al ser polarizado, permite una descarga energética de aproximadamente 1,7 MW.",
    explode: { dx: 55, dy: 0 },
  },
  {
    id: "membrana",
    name: "Membrana de tejido orgánico",
    description: "Tejido orgánico en el extremo de la reserva de plasma.",
    explode: { dx: 105, dy: 0 },
  },
  {
    id: "cuerpo",
    name: "Cuerpo del rifle",
    description: "La estructura que sostiene el ATF aid y la cámara. El arma completa mide 7,2 m.",
    explode: { dx: 40, dy: -30 },
  },
  {
    id: "atf",
    name: "ATF aid",
    description: "Auto tracking focus: ayuda de enfoque automático para seguir el objetivo.",
    explode: { dx: 40, dy: -75 },
  },
  {
    id: "camara",
    name: "Cámara espectrográfica",
    description: "Reúne los sensores: LiDAR, UV, IR y UAV (sensor topográfico).",
    explode: { dx: 85, dy: -75 },
  },
  {
    id: "lente",
    name: "Lente teleobjetivo",
    description: "Lente de 35 mm a 400 mm.",
    explode: { dx: 125, dy: -75 },
  },
]
