"use client"

import { useEffect, useRef, useState } from "react"

const MOODS = {
  idle: {
    bg: "bg-card/50",
    border: "border-border",
    eye: "#00e5ff",
    cheek: false,
    mouth: "neutral",
    label: "idle",
  },
  nearby: {
    bg: "bg-cyan/5",
    border: "border-cyan/40",
    eye: "#00e5ff",
    cheek: false,
    mouth: "smile",
    label: "hi there :)",
  },
  hover: {
    bg: "bg-purple/10",
    border: "border-purple/50",
    eye: "#c084fc",
    cheek: true,
    mouth: "happy",
    label: "hehe~",
  },
  patting: {
    bg: "bg-pink/10",
    border: "border-pink/50",
    eye: "#ff6b6b",
    cheek: true,
    mouth: "uwu",
    label: "pats received!",
  },
} as const

type MoodKey = keyof typeof MOODS

const S = 5

function drawFace(
  ctx: CanvasRenderingContext2D,
  eye: string,
  cheek: boolean,
  mouth: string,
  eyeX: number,
  eyeY: number,
  blink: boolean,
  pulse: number
) {
  ctx.clearRect(0, 0, 80, 80)

  const px = (x: number, y: number, color: string) => {
    ctx.fillStyle = color
    ctx.fillRect(x * S, y * S, S, S)
  }

  for (let x = 3; x <= 12; x++)
    for (let y = 2; y <= 13; y++)
      px(x, y, "rgba(255,255,255,0.03)")

  const ex = Math.round(eyeX)
  const ey = Math.round(eyeY)

  if (blink || mouth === "uwu") {
    [[4], [12]].forEach(([lx]) => {
      px(lx + ex, 5 + ey, eye)
      px(lx + 1 + ex, 5 + ey, eye)
    })
  } else if (mouth === "happy" || pulse > 0.5) {
    [[4], [12]].forEach(([lx]) => {
      for (let dy = 0; dy < 2; dy++)
        for (let dx = 0; dx < 2; dx++)
          px(lx + dx + ex, 5 + dy + ey, eye)
    })
  } else {
    [[4], [12]].forEach(([lx]) => {
      for (let dy = 0; dy < 2; dy++)
        for (let dx = 0; dx < 2; dx++)
          px(lx + dx + ex, 5 + dy + ey, eye)
    })
  }

  if (cheek) {
    px(3, 8, "#ff6eb4"); px(4, 8, "#ff6eb4")
    px(12, 8, "#ff6eb4"); px(13, 8, "#ff6eb4")
  }

  if (mouth === "neutral") {
    for (let x = 6; x <= 10; x++) px(x, 11, eye)
  } else if (mouth === "smile") {
    px(6, 11, eye); px(7, 12, eye); px(8, 12, eye); px(9, 12, eye); px(10, 11, eye)
  } else if (mouth === "happy") {
    px(5, 10, eye); px(6, 11, eye); px(7, 12, eye)
    px(8, 12, eye); px(9, 12, eye); px(10, 11, eye); px(11, 10, eye)
  } else if (mouth === "uwu") {
    px(6, 11, eye); px(7, 10, eye); px(8, 11, eye); px(9, 10, eye); px(10, 11, eye)
  }
}

export function PixelFaceCard() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const boxRef = useRef<HTMLDivElement>(null)
  const [moodKey, setMoodKey] = useState<MoodKey>("idle")
  const [patting, setPatting] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const box = boxRef.current
    if (!canvas || !box) return
    const ctx = canvas.getContext("2d")!

    let mouseX = 0, mouseY = 0
    let isHover = false, isPatting = false
    let eyeX = 0, eyeY = 0
    let frame = 0, blinkTimer = 0, blinking = false

    const onMouseMove = (e: MouseEvent) => { mouseX = e.clientX; mouseY = e.clientY }
    const onEnter = () => { isHover = true }
    const onLeave = () => { isHover = false; isPatting = false; setPatting(false) }
    const onDown = () => { isPatting = true; setPatting(true) }
    const onUp = () => { isPatting = false; setPatting(false) }

    document.addEventListener("mousemove", onMouseMove)
    box.addEventListener("mouseenter", onEnter)
    box.addEventListener("mouseleave", onLeave)
    box.addEventListener("mousedown", onDown)
    box.addEventListener("mouseup", onUp)

    let rafId: number

    const loop = () => {
      frame++
      blinkTimer++

      if (blinkTimer > 120 && !isHover && !isPatting) {
        blinking = true
        if (blinkTimer > 125) { blinking = false; blinkTimer = 0 }
      }

      const rect = box.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = mouseX - cx
      const dy = mouseY - cy
      const dist = Math.hypot(dx, dy)
      const maxOff = 1.5
      const targetX = dist === 0 ? 0 : (dx / dist) * Math.min(dist / 80, 1) * maxOff
      const targetY = dist === 0 ? 0 : (dy / dist) * Math.min(dist / 80, 1) * maxOff

      eyeX += (targetX - eyeX) * 0.2
      eyeY += (targetY - eyeY) * 0.2

      const key: MoodKey = isPatting ? "patting" : isHover ? "hover" : dist < 400 ? "nearby" : "idle"
      const mood = MOODS[key]
      const pulse = isHover || isPatting ? (Math.sin(frame * 0.15) + 1) / 2 : 0

      setMoodKey(key)
      drawFace(ctx, mood.eye, mood.cheek, mood.mouth, eyeX, eyeY, blinking, pulse)

      rafId = requestAnimationFrame(loop)
    }

    loop()

    return () => {
      cancelAnimationFrame(rafId)
      document.removeEventListener("mousemove", onMouseMove)
      box.removeEventListener("mouseenter", onEnter)
      box.removeEventListener("mouseleave", onLeave)
      box.removeEventListener("mousedown", onDown)
      box.removeEventListener("mouseup", onUp)
    }
  }, [])

  const mood = MOODS[moodKey]

  return (
    <div
      ref={boxRef}
      style={{ transform: patting ? "scale(0.95)" : "scale(1)" }}
      className={`md:col-span-2 rounded-2xl border ${mood.border} ${mood.bg} transition-all duration-200 flex flex-col items-center justify-center gap-3 cursor-pointer select-none min-h-[140px]`}
    >
      <canvas
        ref={canvasRef}
        width={80}
        height={80}
        style={{ width: 100, height: 100, imageRendering: "pixelated" }}
      />
      <span className="text-xs text-muted-foreground uppercase tracking-widest">
        {mood.label}
      </span>
    </div>
  )
}