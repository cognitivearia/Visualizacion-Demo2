"use client"

import { useState } from "react"
import { PixelSky } from "@/components/mundo/pixel-sky"
import { WorldShell } from "@/components/mundo/world-shell"

export function MundoExperience() {
  const [year, setYear] = useState(2568)

  return (
    <>
      <PixelSky year={year} />
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-6 sm:px-6 sm:py-8">
        <WorldShell onYear={setYear} />
      </div>
    </>
  )
}
