"use client"

import { useState, useEffect } from "react"
import { LabCreature } from "@/components/LabCreature"
import type { CreatureMood } from "@/components/LabCreature"

export default function LabLayout({ children }: { children: React.ReactNode }) {
  const [creatureMood, setCreatureMood] = useState<CreatureMood>("idle")

  useEffect(() => {
    const handler = (e: Event) => {
      setCreatureMood((e as CustomEvent).detail)
    }
    window.addEventListener("lab-mood", handler)
    return () => window.removeEventListener("lab-mood", handler)
  }, [])

  return (
    <>
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 9999 }}
      />
      <div style={{ position: "relative", zIndex: 10000 }}>
        {children}
      </div>
      <div style={{ zIndex: 10001, position: "relative" }}>
        <LabCreature mood={creatureMood} />
      </div>
    </>
  )
}