#!/usr/bin/env python3
"""Trace the continent PNG into SVG region paths for Archivo 3030."""

from __future__ import annotations

import json
from pathlib import Path

import cv2
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "public" / "maps" / "continente.png"
OUT_TS = ROOT / "src" / "data" / "map-geometry.ts"
DEBUG_DIR = Path("/tmp")

LAND = {
    "Ostseeküste": np.array([235, 203, 229], dtype=np.float32),
    "Dunántúl": np.array([209, 234, 185], dtype=np.float32),
    "Nagy-Alföld": np.array([184, 226, 217], dtype=np.float32),
    "Karpatenland": np.array([244, 204, 190], dtype=np.float32),
    "Alpenvorland": np.array([198, 211, 231], dtype=np.float32),
}

WATER = np.array(
    [
        [145, 168, 204],
        [138, 163, 201],
        [135, 165, 220],
        [111, 176, 185],
        [110, 134, 172],
        [85, 109, 147],
        [77, 100, 135],
        [235, 246, 250],
        [220, 236, 242],
        [160, 184, 230],
        [125, 152, 195],
        [94, 122, 165],
        [123, 145, 178],
    ],
    dtype=np.float32,
)

LABELS = {
    "Ostseeküste": (248, 118),
    "Dunántúl": (402, 248),
    "Nagy-Alföld": (678, 438),
    "Karpatenland": (886, 392),
    "Alpenvorland": (948, 92),
}

REALMS = {
    "Ostseeküste": "Patriarchate of Heraria",
    "Dunántúl": "Protectorate of Panes",
    "Nagy-Alföld": "Hudevorian Empire",
    "Karpatenland": "Diocese of Cordamilia",
    "Alpenvorland": "Grand Duchy of Avevaria",
}

COUNTRIES = [
    ("Székesvár", "Dunántúl", 398, 198),
    ("Győrhely", "Dunántúl", 352, 278),
    ("Pannonburg", "Dunántúl", 392, 338),
    ("Debrecenfeld", "Nagy-Alföld", 618, 148),
    ("Szegedvár", "Nagy-Alföld", 792, 248),
    ("Hortobágy", "Nagy-Alföld", 638, 458),
    ("Königsfeld", "Karpatenland", 868, 338),
    ("Lichtenau", "Karpatenland", 928, 378),
    ("Várhegy", "Karpatenland", 878, 428),
    ("Stralsundheim", "Ostseeküste", 508, 48),
    ("Kielerholm", "Ostseeküste", 188, 158),
    ("Bergheim", "Alpenvorland", 932, 68),
    ("Innsbrucktal", "Alpenvorland", 968, 128),
]


def classify(im: np.ndarray) -> np.ndarray:
    h, w = im.shape[:2]
    pix = im.astype(np.float32)
    names = list(LAND)
    land_c = np.stack([LAND[n] for n in names], axis=0)
    d_land = np.sqrt(((pix[:, :, None, :] - land_c[None, None, :, :]) ** 2).sum(-1))
    d_water = np.sqrt(((pix[:, :, None, :] - WATER[None, None, :, :]) ** 2).sum(-1)).min(-1)
    best = d_land.argmin(-1)
    best_d = d_land.min(-1)
    assign = np.full((h, w), -1, dtype=np.int16)
    xs = np.arange(w)[None, :]
    for i, name in enumerate(names):
        ok = (best == i) & (best_d < 42) & (best_d + 6 < d_water)
        if name == "Alpenvorland":
            ok = (best == i) & (best_d < 32) & (best_d + 10 < d_water) & (xs > 780)
        if name == "Karpatenland":
            ok = (best == i) & (best_d < 42) & (best_d + 6 < d_water) & (xs > 760) & (np.arange(h)[:, None] > 250)
        assign[ok] = i
    return assign


def contour_path(cnt: np.ndarray, epsilon: float) -> str | None:
    approx = cv2.approxPolyDP(cnt, epsilon, True)
    if len(approx) < 4:
        return None
    pts = approx.reshape(-1, 2)
    return "M " + " L ".join(f"{int(x)} {int(y)}" for x, y in pts) + " Z"


def large_water_mask(assign: np.ndarray, min_area: float = 70) -> np.ndarray:
    water = (assign < 0).astype(np.uint8) * 255
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
    water = cv2.morphologyEx(water, cv2.MORPH_OPEN, kernel, iterations=1)
    num, labels, stats, _ = cv2.connectedComponentsWithStats(water, connectivity=8)
    keep = np.zeros_like(water)
    for i in range(1, num):
        if stats[i, cv2.CC_STAT_AREA] >= min_area:
            keep[labels == i] = 255
    return keep


def paths_for(mask: np.ndarray, water: np.ndarray, min_land: float, min_hole: float) -> str:
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
    filled = cv2.dilate(mask, kernel, iterations=1)
    filled = cv2.morphologyEx(filled, cv2.MORPH_CLOSE, kernel, iterations=1)
    filled[water > 0] = 0
    contours, hierarchy = cv2.findContours(filled, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_NONE)
    if hierarchy is None:
        return ""
    hier = hierarchy[0]
    chunks: list[tuple[float, str]] = []
    for i, cnt in enumerate(contours):
        parent = hier[i][3]
        area = cv2.contourArea(cnt)
        if parent == -1:
            if area < min_land:
                continue
            path = contour_path(cnt, 1.25)
        else:
            if area < min_hole:
                continue
            path = contour_path(cnt, 1.4)
        if path:
            chunks.append((area if parent == -1 else area * 0.01, path))
    chunks.sort(key=lambda item: -item[0])
    return " ".join(item[1] for item in chunks)


def ts_escape(value: str) -> str:
    return value.replace("\\", "\\\\").replace("`", "\\`")


def main() -> None:
    im = np.array(Image.open(SRC).convert("RGB"))
    h, w = im.shape[:2]
    assign = classify(im)
    names = list(LAND)

    debug = np.zeros_like(im)
    palette = {
        0: (235, 160, 210),
        1: (170, 210, 90),
        2: (80, 190, 175),
        3: (240, 150, 110),
        4: (150, 190, 230),
    }
    for i, col in palette.items():
        debug[assign == i] = col
    Image.fromarray(debug).save(DEBUG_DIR / "map-class.png")

    min_land = {
        "Ostseeküste": 90,
        "Dunántúl": 80,
        "Nagy-Alföld": 90,
        "Karpatenland": 70,
        "Alpenvorland": 45,
    }
    min_hole = {
        "Ostseeküste": 55,
        "Dunántúl": 40,
        "Nagy-Alföld": 70,
        "Karpatenland": 40,
        "Alpenvorland": 40,
    }

    shapes = []
    overlay = im.copy()
    water = large_water_mask(assign, 70)
    for i, name in enumerate(names):
        mask = (assign == i).astype(np.uint8) * 255
        d = paths_for(mask, water, min_land[name], min_hole[name])
        lx, ly = LABELS[name]
        shapes.append({"id": name, "d": d, "labelX": lx, "labelY": ly})
        overlay[mask > 0] = palette[i]
        print(name, "path chars", len(d), "pixels", int((assign == i).sum()))

    Image.fromarray(overlay).save(DEBUG_DIR / "map-overlay.png")
    (DEBUG_DIR / "map-shapes.json").write_text(json.dumps({s["id"]: len(s["d"]) for s in shapes}))

    shape_blocks = []
    for shape in shapes:
        realm = REALMS[shape["id"]]
        shape_blocks.append(
            "  {\n"
            f'    id: "{shape["id"]}",\n'
            f'    realm: "{realm}",\n'
            f"    labelX: {shape['labelX']},\n"
            f"    labelY: {shape['labelY']},\n"
            f"    d: `{ts_escape(shape['d'])}`,\n"
            "  }"
        )

    country_blocks = ",\n".join(
        f'  {{ name: "{n}", region: "{r}", x: {x}, y: {y} }}' for n, r, x, y in COUNTRIES
    )

    shapes_joined = ",\n".join(shape_blocks)

    ts = f"""import type {{ RegionName }} from "@/data/world"

export type MapShape = {{
  id: RegionName
  realm: string
  d: string
  labelX: number
  labelY: number
}}

export const mapViewBox = "0 0 {w} {h}"
export const mapWidth = {w}
export const mapHeight = {h}

export const atlasColors: Record<RegionName, string> = {{
  Ostseeküste: "#ebb0e0",
  Dunántúl: "#c8e88a",
  "Nagy-Alföld": "#8fd8cc",
  Karpatenland: "#f0b496",
  Alpenvorland: "#bcd0e8",
}}

export const mapShapes: MapShape[] = [
{shapes_joined}
]

export const countryMarks: Array<{{
  name: string
  region: RegionName
  x: number
  y: number
}}> = [
{country_blocks},
]
"""
    OUT_TS.write_text(ts)
    print("wrote", OUT_TS, "chars", len(ts))


if __name__ == "__main__":
    main()
