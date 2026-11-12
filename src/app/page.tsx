import type { Metadata } from "next"
import VarhegyPage from "./varhegy/page"

export const metadata: Metadata = {
  title: "Várhegy",
  description:
    "La historia de Várhegy, capital de Karpatenland, en cinco momentos: de la prehistoria al estado totalitario de 3030.",
}

export default function HomePage() {
  return <VarhegyPage />
}
