"use client"

import { useEffect, useRef, useState, useCallback, ReactNode } from "react"
import Link from "next/link"

type Mode = "manual" | "butterfly" | "swarm"

const Icons = {
  Back: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>,
  Info: <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>,
  Manual: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 3 7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/><path d="m13 13 6 6"/></svg>,
  Butterfly: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/><path d="M12 6v12"/><path d="M8 10h8"/><path d="M8 14h8"/></svg>,
  Swarm: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/><path d="M9.88 9.88l4.24 4.24"/><path d="M14.12 9.88l-4.24 4.24"/></svg>,
  Play: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  Pause: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>,
  Reset: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
}

const NEON_COLORS = [
  "#00f5d4", "#f15bb5", "#fee440", "#9b5de5", "#00f3ff",
  "#ff00ea", "#39ff14", "#ff7300"
]

const MODES: { id: Mode; label: string; icon: ReactNode; desc: string }[] = [
  { id: "manual",    label: "Manual Override",    icon: Icons.Manual,    desc: "Drag the pendulum arm physically to set your own starting parameters." },
  { id: "butterfly", label: "The Butterfly Effect", icon: Icons.Butterfly, desc: "Two timelines start 0.01 degrees apart. Watch them rapidly diverge." },
  { id: "swarm",     label: "Entropy Swarm",       icon: Icons.Swarm,     desc: "7 alternate realities unleashed simultaneously to map pure, unadulterated chaos." },
]

function Explainer({ term, definition }: { term: string; definition: string }) {
  return (
    <span className="relative group inline-flex items-center gap-1 cursor-help border-b border-dashed border-cyan/40 text-cyan/80 hover:text-cyan transition-colors select-none mx-0.5">
      {term}
      <span className="text-cyan/40 group-hover:text-cyan/70 transition-colors">{Icons.Info}</span>
      <span className="pointer-events-none absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 p-3 bg-[#1a1a2e] border border-white/10 text-white/70 text-xs rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 font-sans font-normal text-center normal-case tracking-normal whitespace-normal block">
        {definition}
      </span>
    </span>
  )
}

interface Pendulum {
  a1: number; a2: number
  v1: number; v2: number
  trail: { x: number; y: number }[]
  color: string
}

function makePendulum(a1: number, a2: number, color: string): Pendulum {
  return { a1, a2, v1: 0, v2: 0, trail: [], color }
}

function stepPendulum(p: Pendulum, l1: number, l2: number, m1: number, m2: number, g: number, dt: number) {
  const { a1, a2, v1, v2 } = p
  const d = a1 - a2
  const cosD = Math.cos(d)
  const sinD = Math.sin(d)
  const denom = 2 * m1 + m2 - m2 * Math.cos(2 * d)
  const a1acc = (
    -g * (2 * m1 + m2) * Math.sin(a1)
    - m2 * g * Math.sin(a1 - 2 * a2)
    - 2 * sinD * m2 * (v2 * v2 * l2 + v1 * v1 * l1 * cosD)
  ) / (l1 * denom)
  const a2acc = (
    2 * sinD * (
      v1 * v1 * l1 * (m1 + m2)
      + g * (m1 + m2) * Math.cos(a1)
      + v2 * v2 * l2 * m2 * cosD
    )
  ) / (l2 * denom)
  p.v1 += a1acc * dt
  p.v2 += a2acc * dt
  p.a1 += p.v1 * dt
  p.a2 += p.v2 * dt
}

export default function ChaosEnginePage() {
  const canvasRef     = useRef<HTMLCanvasElement>(null)
  const containerRef  = useRef<HTMLDivElement>(null)

  const [mode, setMode]           = useState<Mode>("manual")
  const [running, setRunning]     = useState(true)
  const [trailLength, setTrailLength] = useState(400)
  const [speed, setSpeed]         = useState(2)
  const [gravity, setGravity]     = useState(9.8)

  const modeRef     = useRef(mode)
  const runningRef  = useRef(running)
  const trailRef    = useRef(trailLength)
  const speedRef    = useRef(speed)
  const gravityRef  = useRef(gravity)
  const pendulums   = useRef<Pendulum[]>([])
  const dragging    = useRef(false)
  const rafRef      = useRef<number | null>(null)

  useEffect(() => { modeRef.current = mode },        [mode])
  useEffect(() => { runningRef.current = running },  [running])
  useEffect(() => { trailRef.current = trailLength },[trailLength])
  useEffect(() => { speedRef.current = speed },      [speed])
  useEffect(() => { gravityRef.current = gravity },  [gravity])
  useEffect(() => {
  const mood = !running ? "idle" : mode === "swarm" ? "terror" : mode === "butterfly" ? "panic" : "focus"
  window.dispatchEvent(new CustomEvent("lab-mood", { detail: mood }))
}, [running, mode])

  // Derive creature mood
  const creatureMood = !running
    ? "idle"
    : mode === "swarm"
    ? "panic"
    : "focus"

  const initPendulums = useCallback((m: Mode) => {
    if (m === "manual") {
      pendulums.current = [makePendulum(Math.PI / 2, Math.PI / 2 + 0.1, NEON_COLORS[0])]
    } else if (m === "butterfly") {
      pendulums.current = [
        makePendulum(Math.PI / 2, Math.PI / 2, NEON_COLORS[0]),
        makePendulum(Math.PI / 2 + 0.01, Math.PI / 2, NEON_COLORS[1]),
      ]
    } else {
      pendulums.current = Array.from({ length: 7 }, (_, i) =>
        makePendulum(Math.PI / 2 + i * 0.005, Math.PI / 2, NEON_COLORS[i % NEON_COLORS.length])
      )
    }
  }, [])

  useEffect(() => { initPendulums(mode) }, [mode, initPendulums])

  useEffect(() => {
    const canvas    = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    const ctx = canvas.getContext("2d")!

    let W = 0, H = 0
    const dpr = window.devicePixelRatio || 1

    const resizeCanvas = () => {
      W = container.clientWidth
      H = container.clientHeight
      canvas.width  = W * dpr
      canvas.height = H * dpr
      ctx.scale(dpr, dpr)
    }

    const observer = new ResizeObserver(resizeCanvas)
    observer.observe(container)
    resizeCanvas()

    const L1 = 120, L2 = 120, M1 = 10, M2 = 10
    // Slightly lighter dark bg — not pure black
    const BG = "#0f0f1a"

    const getPos = (p: Pendulum) => {
      const cx = W / 2
      const cy = H / 2 - 60
      const x1 = cx + L1 * Math.sin(p.a1)
      const y1 = cy + L1 * Math.cos(p.a1)
      const x2 = x1 + L2 * Math.sin(p.a2)
      const y2 = y1 + L2 * Math.cos(p.a2)
      return { cx, cy, x1, y1, x2, y2 }
    }

    const loop = () => {
      ctx.fillStyle = BG
      ctx.fillRect(0, 0, W, H)

      // Subtle grid
      ctx.strokeStyle = "rgba(255,255,255,0.03)"
      ctx.lineWidth = 1
      const gridSize = 40
      for (let x = 0; x < W; x += gridSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke()
      }
      for (let y = 0; y < H; y += gridSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke()
      }

      const g       = gravityRef.current
      const steps   = speedRef.current
      const maxTrail = trailRef.current

      for (const p of pendulums.current) {
        if (runningRef.current) {
          for (let s = 0; s < steps; s++) {
            stepPendulum(p, L1, L2, M1, M2, g, 0.03)
          }
        }

        const pos = getPos(p)

        if (runningRef.current || dragging.current) {
          p.trail.push({ x: pos.x2, y: pos.y2 })
          if (p.trail.length > maxTrail) p.trail.shift()
        }

        if (p.trail.length > 1) {
          ctx.lineCap = "round"
          ctx.lineJoin = "round"
          ctx.lineWidth = modeRef.current === "swarm" ? 1.5 : 2.5
          for (let i = 1; i < p.trail.length; i++) {
            const alpha = i / p.trail.length
            ctx.globalAlpha = alpha * alpha
            ctx.beginPath()
            ctx.strokeStyle = p.color
            ctx.moveTo(p.trail[i - 1].x, p.trail[i - 1].y)
            ctx.lineTo(p.trail[i].x, p.trail[i].y)
            ctx.stroke()
          }
          ctx.globalAlpha = 1.0
        }

        if (modeRef.current !== "swarm") {
          // Rod
          ctx.beginPath()
          ctx.strokeStyle = "rgba(255,255,255,0.15)"
          ctx.lineWidth = 1.5
          ctx.moveTo(pos.cx, pos.cy)
          ctx.lineTo(pos.x1, pos.y1)
          ctx.lineTo(pos.x2, pos.y2)
          ctx.stroke()

          // Pivot
          ctx.beginPath()
          ctx.fillStyle = "rgba(255,255,255,0.6)"
          ctx.arc(pos.cx, pos.cy, 4, 0, Math.PI * 2)
          ctx.fill()

          // Bob 1 — glow
          ctx.beginPath()
          ctx.fillStyle = p.color + "33"
          ctx.arc(pos.x1, pos.y1, 16, 0, Math.PI * 2)
          ctx.fill()
          ctx.beginPath()
          ctx.fillStyle = p.color
          ctx.arc(pos.x1, pos.y1, 8, 0, Math.PI * 2)
          ctx.fill()

          // Bob 2 — glow
          ctx.beginPath()
          ctx.fillStyle = p.color + "33"
          ctx.arc(pos.x2, pos.y2, 20, 0, Math.PI * 2)
          ctx.fill()
          ctx.beginPath()
          ctx.fillStyle = p.color
          ctx.arc(pos.x2, pos.y2, 10, 0, Math.PI * 2)
          ctx.fill()

          // Specular
          ctx.beginPath()
          ctx.fillStyle = "rgba(255,255,255,0.4)"
          ctx.arc(pos.x2, pos.y2 - 3, 3, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      rafRef.current = requestAnimationFrame(loop)
    }

    loop()
    return () => {
      observer.disconnect()
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const handleMouseDown = () => { if (mode === "manual") dragging.current = true }
  const handleMouseUp   = () => { dragging.current = false }
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging.current || mode !== "manual") return
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    const mx = e.clientX - rect.left
    const my = e.clientY - rect.top
    const W  = canvas.offsetWidth
    const H  = canvas.offsetHeight
    const cx = W / 2, cy = H / 2 - 60
    const p  = pendulums.current[0]
    p.a1 = Math.atan2(mx - cx, my - cy)
    p.v1 = 0; p.v2 = 0; p.trail = []
  }

  const reset = () => initPendulums(mode)
  const activeModeData = MODES.find(m => m.id === mode)!

  return (
    <main className="h-screen w-screen flex overflow-hidden antialiased font-sans"
      style={{ background: "#0f0f1a", color: "#e8e8f0" }}
    >

      {/* LEFT PANEL */}
      <div className="w-72 flex-shrink-0 flex flex-col justify-between p-5 z-20"
        style={{ background: "#13131f", borderRight: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex flex-col gap-5">

          {/* Header */}
          <div className="flex items-center gap-3">
            <Link href="/lab"
              className="p-2 rounded-xl transition-colors"
              style={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.08)", color: "#a0a0b8" }}
            >
              {Icons.Back}
            </Link>
            <div>
              <h1 className="text-sm font-bold tracking-tight" style={{ color: "#e8e8f0" }}>The Chaos Engine</h1>
              <p className="text-[10px]" style={{ color: "#5a5a7a" }}>Non-linear Physics Sandbox</p>
            </div>
          </div>

          <div style={{ height: "1px", background: "rgba(255,255,255,0.05)" }} />

          {/* Mode selector */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#5a5a7a" }}>
              Timeline Mode
            </span>
            {MODES.map(m => (
              <div key={m.id} className="relative group overflow-visible z-30 hover:z-50">
                <button
                  onClick={() => setMode(m.id)}
                  className="w-full px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-3"
                  style={mode === m.id
                    ? { background: "#00f5d4", color: "#0a0a0a", border: "1px solid #00f5d4" }
                    : { background: "#1a1a2e", color: "#6a6a8a", border: "1px solid rgba(255,255,255,0.05)" }
                  }
                >
                  <span style={mode === m.id ? { color: "#0a0a0a" } : { color: "#4a4a6a" }}>{m.icon}</span>
                  {m.label}
                </button>
                <div className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 w-56 p-3 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 text-xs text-left"
                  style={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.08)", color: "#a0a0c0" }}
                >
                  <span className="font-bold block mb-1" style={{ color: "#e8e8f0" }}>{m.label}</span>
                  {m.desc}
                </div>
              </div>
            ))}
          </div>

          <div style={{ height: "1px", background: "rgba(255,255,255,0.05)" }} />

          {/* Sliders */}
          <div className="flex flex-col gap-4">
            {[
              { label: "Gravity", value: gravity, min: 1, max: 25, step: 0.1, onChange: setGravity, accent: "#00f5d4", display: `${gravity.toFixed(1)} G`, sub: ["Moon 1.6", "Earth 9.8", "Jupiter 24.7"] },
              { label: "Trail Length", value: trailLength, min: 50, max: 1000, step: 50, onChange: setTrailLength, accent: "#f15bb5", display: `${trailLength}ms` },
              { label: "Time Dilation", value: speed, min: 1, max: 10, step: 1, onChange: setSpeed, accent: "#fee440", display: `${speed}×` },
            ].map(s => (
              <div key={s.label} className="flex flex-col gap-1.5">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                  <span style={{ color: "#5a5a7a" }}>{s.label}</span>
                  <span style={{ color: s.accent, fontFamily: "monospace" }}>{s.display}</span>
                </div>
                <input type="range" min={s.min} max={s.max} step={s.step} value={s.value}
                  onChange={e => s.onChange(Number(e.target.value))}
                  className="w-full cursor-pointer"
                  style={{ accentColor: s.accent }}
                />
                {s.sub && (
                  <div className="flex justify-between text-[9px] font-mono" style={{ color: "#3a3a5a" }}>
                    {s.sub.map(t => <span key={t}>{t}</span>)}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Controls */}
          <div className="flex gap-2">
            <button onClick={() => setRunning(r => !r)}
              className="flex-1 px-3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              style={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.08)", color: "#e8e8f0" }}
            >
              {running ? Icons.Pause : Icons.Play}
              {running ? "Pause" : "Resume"}
            </button>
            <button onClick={reset}
              className="px-3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              style={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.05)", color: "#5a5a7a" }}
            >
              {Icons.Reset}
            </button>
          </div>

        </div>

        {/* Footer */}
        <p className="text-[9px] font-mono pt-4" style={{ color: "#2a2a4a", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
          CHAOS_ENGINE · NON_LINEAR_ENTROPY
        </p>
      </div>

      {/* MAIN CANVAS AREA */}
      <div className="flex-1 flex flex-col min-w-0 p-5 gap-4 overflow-hidden">

        {/* Info bar */}
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl flex-shrink-0"
          style={{ background: "#13131f", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <span className="p-1.5 rounded-lg" style={{ background: "#1a1a2e", color: "#a0a0c0" }}>
            {activeModeData.icon}
          </span>
          <div>
            <span className="text-xs font-bold" style={{ color: "#e8e8f0" }}>{activeModeData.label}</span>
            <p className="text-xs" style={{ color: "#5a5a7a" }}>
              Visualizing a{" "}
              <Explainer
                term="Double Pendulum"
                definition="A physical system that exhibits rich, unpredictable, and highly sensitive dynamic behavior. A prime example of chaos theory."
              />
              {" "}— {running ? "simulation running" : "simulation paused"}
            </p>
          </div>
        </div>

        {/* Canvas */}
        <div ref={containerRef} className="flex-1 relative rounded-2xl overflow-hidden"
          style={{ border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            style={{ cursor: mode === "manual" ? "crosshair" : "default" }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
        </div>
      </div>
    </main>
  )
}