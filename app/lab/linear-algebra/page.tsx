"use client"

import { useEffect, useRef, useState, ReactNode } from "react"
import Link from "next/link"

type AppMode = "presets" | "manual"

const Icons = {
  Back: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>,
  Info: <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>,
  Presets: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
  Manual: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/></svg>,
  ZoomIn: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>,
  ZoomOut: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>,
  Target: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="2"/><line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/><line x1="20" y1="12" x2="22" y2="12"/><line x1="2" y1="12" x2="4" y2="12"/></svg>
}

// Updated Theme Colors to match your deep void aesthetic
const THEME = {
  bgMain: "#0f0f1a",
  bgPanel: "#13131f",
  bgElement: "#1a1a2e",
  cyan: "#00f5d4",
  pink: "#f15bb5",
  yellow: "#fee440",
  textMuted: "#5a5a7a",
  textMain: "#e8e8f0"
}

function Explainer({ term, definition }: { term: string; definition: string }) {
  return (
    <span className="relative group inline-flex items-center gap-1 cursor-help border-b border-dashed border-[#00f5d4]/40 text-[#00f5d4]/80 hover:text-[#00f5d4] transition-colors select-none mx-0.5 z-50">
      {term}
      <span className="text-[#00f5d4]/40 group-hover:text-[#00f5d4]/70 transition-colors">{Icons.Info}</span>
      <span className="pointer-events-none absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 p-3 bg-[#1a1a2e] border border-white/10 text-white/70 text-xs rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 font-sans font-normal text-left normal-case tracking-normal whitespace-normal block">
        {definition}
      </span>
    </span>
  )
}

const PRESETS = [
  { id: "identity", label: "Stable Reality", desc: "Baseline physics. The X and Y dimensions are perfectly isolated. [1, 0, 0, 1] means 'Right stays Right, Up stays Up.'", mat: [1, 0, 0, 1] },
  { id: "shear", label: "The Slant (Shear)", desc: "A dimensional cross-breeze. Pushes the top of reality to the right while locking the ground perfectly in place.", mat: [1, 1, 0, 1] },
  { id: "mirror", label: "Mirror Dimension", desc: "Inverts the X-axis into negative space (-1). You are now looking at the universe completely backwards.", mat: [-1, 0, 0, 1] },
  { id: "rotate", label: "Temporal Shift", desc: "Rotates space exactly 90 degrees counter-clockwise. What used to be 'Forward' is now 'Up'.", mat: [0, -1, 1, 0] },
  { id: "collapse", label: "Singularity", desc: "Total dimensional failure. Both X and Y axes crash onto the exact same line, destroying all 2D area (Determinant = 0).", mat: [1, 1, 1, 1] },
]

function getEigenvectors(a: number, b: number, c: number, d: number) {
  const trace = a + d
  const det = a * d - b * c
  const discriminant = trace * trace - 4 * det

  if (discriminant < -0.0001) return []

  const root = Math.sqrt(Math.max(0, discriminant))
  const l1 = (trace + root) / 2
  const l2 = (trace - root) / 2

  const vecs: {x: number, y: number, l: number}[] = []

  const addVec = (lambda: number) => {
    let x = 0, y = 0
    if (Math.abs(b) > 1e-5) {
      x = b; y = lambda - a
    } else if (Math.abs(c) > 1e-5) {
      x = lambda - d; y = c
    } else {
      x = Math.abs(lambda - a) < 1e-5 ? 1 : 0
      y = Math.abs(lambda - d) < 1e-5 ? 1 : 0
    }
    const mag = Math.hypot(x, y)
    if (mag > 1e-5) vecs.push({ x: x/mag, y: y/mag, l: lambda })
  }

  addVec(l1)
  if (Math.abs(l1 - l2) > 1e-5) addVec(l2)
  return vecs
}

export default function SpatialWarpPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const [mode, setMode] = useState<AppMode>("presets")
  const [targetMatrix, setTargetMatrix] = useState<number[]>([1, 0, 0, 1])
  
  const [showGhost, setShowGhost] = useState(true)
  const [showVectors, setShowVectors] = useState(true)
  const [showAnchors, setShowAnchors] = useState(true)
  
  // Panning & Zoom State
  const [zoom, setZoom] = useState(50) 
  const zoomRef = useRef(zoom)
  const offsetRef = useRef({ x: 0, y: 0 })
  const isDraggingRef = useRef(false)
  const dragStartRef = useRef({ x: 0, y: 0 })
  const [isGrabbing, setIsGrabbing] = useState(false) // just for the CSS cursor

  const [mInputs, setMInputs] = useState<string[]>(["1", "0", "0", "1"])

  const currentMatRef = useRef<number[]>([1, 0, 0, 1])
  const animRafRef = useRef<number | null>(null)
  const drawRafRef = useRef<number | null>(null)

  const determinant = currentMatRef.current[0] * currentMatRef.current[3] - currentMatRef.current[1] * currentMatRef.current[2]

  useEffect(() => { zoomRef.current = zoom }, [zoom])

  // --- CREATURE MOOD LOGIC (Swapped Terror/Panic) ---
  useEffect(() => {
    const matStr = targetMatrix.join(",")
    let mood = "focus"
    
    const targetDet = targetMatrix[0] * targetMatrix[3] - targetMatrix[1] * targetMatrix[2]
    
    if (Math.abs(targetDet) < 0.001) mood = "terror" // Singularity = Terror
    else if (matStr === "-1,0,0,1" || matStr === "0,-1,1,0") mood = "panic" // Mirror / Temporal = Panic
    else if (matStr === "1,1,0,1") mood = "idle" // Slant = Idle
    else if (matStr === "1,0,0,1") mood = "normal" // Stable = Normal
    
    window.dispatchEvent(new CustomEvent("lab-mood", { detail: mood }))
  }, [targetMatrix])

  const applyMatrix = (mat: number[]) => {
    setTargetMatrix(mat)
    setMInputs(mat.map(String))
  }

  const handleManualInput = (idx: number, val: string) => {
    const newInputs = [...mInputs]
    newInputs[idx] = val
    setMInputs(newInputs)

    const parsed = newInputs.map(s => {
      const n = parseFloat(s)
      return isNaN(n) ? 0 : n
    })
    setTargetMatrix(parsed)
  }

  // --- PANNING & ZOOM HANDLERS ---
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true
    setIsGrabbing(true)
    dragStartRef.current = {
      x: e.clientX - offsetRef.current.x,
      y: e.clientY - offsetRef.current.y
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return
    offsetRef.current = {
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y
    }
  }

  const handleMouseUpOrLeave = () => {
    isDraggingRef.current = false
    setIsGrabbing(false)
  }

  // Handle Trackpad/Mouse Wheel Zoom
  const handleWheel = (e: React.WheelEvent) => {
    // Smooth out the scroll delta into a zoom factor
    const zoomSensitivity = 0.05
    setZoom(z => {
      const newZoom = z - e.deltaY * zoomSensitivity
      // Clamp between 15 (zoomed out) and 150 (zoomed in)
      return Math.max(15, Math.min(150, newZoom))
    })
  }

  const resetView = () => {
    offsetRef.current = { x: 0, y: 0 }
    setZoom(50)
  }

  useEffect(() => {
    const startMat = [...currentMatRef.current]
    const endMat = targetMatrix
    const startTime = performance.now()
    const duration = 700 

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

    const animateTransition = (time: number) => {
      let t = (time - startTime) / duration
      if (t > 1) t = 1
      const easeT = easeOutCubic(t)

      currentMatRef.current = startMat.map((val, i) => val + (endMat[i] - val) * easeT)

      if (t < 1) {
        animRafRef.current = requestAnimationFrame(animateTransition)
      }
    }

    if (animRafRef.current) cancelAnimationFrame(animRafRef.current)
    animRafRef.current = requestAnimationFrame(animateTransition)

    return () => { if (animRafRef.current) cancelAnimationFrame(animRafRef.current) }
  }, [targetMatrix])

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    const ctx = canvas.getContext("2d")!

    let W = 0, H = 0
    let dpr = window.devicePixelRatio || 1

    const resize = () => {
      W = container.clientWidth
      H = container.clientHeight
      canvas.width = W * dpr
      canvas.height = H * dpr
      ctx.scale(dpr, dpr)
    }
    const observer = new ResizeObserver(resize)
    observer.observe(container)
    resize()

    const loop = () => {
      ctx.fillStyle = THEME.bgMain
      ctx.fillRect(0, 0, W, H)

      // Apply drag offsets to the center point
      const cx = (W / 2) + offsetRef.current.x
      const cy = (H / 2) + offsetRef.current.y
      const scale = zoomRef.current 

      // Dynamically calculate grid bounds so it always reaches the edges of the screen while panning
      const maxDistX = Math.max(cx, W - cx)
      const maxDistY = Math.max(cy, H - cy)
      const maxBound = Math.ceil(Math.max(maxDistX, maxDistY) / scale) + 2

      const project = (x: number, y: number, mat: number[]) => {
        const px = mat[0] * x + mat[1] * y
        const py = mat[2] * x + mat[3] * y
        return { sx: cx + px * scale, sy: cy - py * scale } 
      }

      if (showGhost) {
        ctx.strokeStyle = "rgba(255,255,255,0.03)"
        ctx.lineWidth = 1
        for (let i = -maxBound; i <= maxBound; i++) {
          ctx.beginPath()
          ctx.moveTo(cx + i * scale, 0)
          ctx.lineTo(cx + i * scale, H)
          ctx.stroke()
          ctx.beginPath()
          ctx.moveTo(0, cy - i * scale)
          ctx.lineTo(W, cy - i * scale)
          ctx.stroke()
        }
      }

      const m = currentMatRef.current

      const drawLine = (x1: number, y1: number, x2: number, y2: number, color: string, width: number) => {
        const p1 = project(x1, y1, m)
        const p2 = project(x2, y2, m)
        ctx.beginPath()
        ctx.moveTo(p1.sx, p1.sy)
        ctx.lineTo(p2.sx, p2.sy)
        ctx.strokeStyle = color
        ctx.lineWidth = width
        ctx.stroke()
      }

      // Draw Warped Grid
      for (let i = -maxBound; i <= maxBound; i++) {
        const isAxis = i === 0
        const color = isAxis ? "rgba(255,255,255,0.15)" : THEME.cyan + "20"
        const w = isAxis ? 2 : 1
        drawLine(i, -maxBound, i, maxBound, color, w) 
        drawLine(-maxBound, i, maxBound, i, color, w) 
      }

      ctx.shadowBlur = 0

      if (showVectors) {
        const pI = project(1, 0, m)
        const pJ = project(0, 1, m)

        // I hat (Cyan)
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(pI.sx, pI.sy)
        ctx.strokeStyle = THEME.cyan; ctx.lineWidth = 3; 
        ctx.shadowColor = THEME.cyan; ctx.shadowBlur = 12; ctx.stroke()
        ctx.beginPath(); ctx.arc(pI.sx, pI.sy, 5, 0, Math.PI*2); ctx.fillStyle = THEME.cyan; ctx.fill()

        // J hat (Pink)
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(pJ.sx, pJ.sy)
        ctx.strokeStyle = THEME.pink; ctx.lineWidth = 3; 
        ctx.shadowColor = THEME.pink; ctx.shadowBlur = 12; ctx.stroke()
        ctx.beginPath(); ctx.arc(pJ.sx, pJ.sy, 5, 0, Math.PI*2); ctx.fillStyle = THEME.pink; ctx.fill()
      }

      if (showAnchors) {
        const anchors = getEigenvectors(m[0], m[1], m[2], m[3])
        anchors.forEach((anc) => {
          const p1 = project(anc.x * maxBound * 2, anc.y * maxBound * 2, [1, 0, 0, 1]) 
          const p2 = project(-anc.x * maxBound * 2, -anc.y * maxBound * 2, [1, 0, 0, 1])
          
          ctx.beginPath()
          ctx.moveTo(p1.sx, p1.sy)
          ctx.lineTo(p2.sx, p2.sy)
          ctx.strokeStyle = THEME.yellow + "90" 
          ctx.lineWidth = 2
          ctx.setLineDash([8, 8])
          ctx.shadowColor = THEME.yellow
          ctx.shadowBlur = 10
          ctx.stroke()
          ctx.setLineDash([])
        })
      }

      ctx.shadowBlur = 0
      ctx.beginPath()
      ctx.arc(cx, cy, 5, 0, Math.PI * 2)
      ctx.fillStyle = "#ffffff"
      ctx.fill()

      drawRafRef.current = requestAnimationFrame(loop)
    }

    loop()
    return () => { observer.disconnect(); if (drawRafRef.current) cancelAnimationFrame(drawRafRef.current) }
  }, [showGhost, showVectors, showAnchors])

  return (
    <main className="h-screen w-screen flex overflow-hidden antialiased font-sans"
      style={{ background: THEME.bgMain, color: THEME.textMain }}
    >
      {/* LEFT PANEL */}
      <div className="w-72 flex-shrink-0 flex flex-col justify-between p-5 z-20"
        style={{ background: THEME.bgPanel, borderRight: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex flex-col gap-5 min-h-0 flex-1 overflow-visible">
          
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link href="/lab" 
              className="p-2 rounded-xl transition-colors"
              style={{ background: THEME.bgElement, border: "1px solid rgba(255,255,255,0.08)", color: "#a0a0b8" }}
            >
              {Icons.Back}
            </Link>
            <div>
              <h1 className="text-sm font-bold tracking-tight" style={{ color: THEME.textMain }}>Dimension Weaver</h1>
              <p className="text-[10px]" style={{ color: THEME.textMuted }}>Spatial Transformation Sandbox</p>
            </div>
          </div>

          <div style={{ height: "1px", background: "rgba(255,255,255,0.05)" }} />

          {/* Mode Toggle */}
          <div className="flex flex-col gap-2 flex-shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: THEME.textMuted }}>
              Control Interface
            </span>
            <div className="flex p-1 rounded-xl gap-1" style={{ background: THEME.bgMain, border: "1px solid rgba(255,255,255,0.05)" }}>
              <button
                onClick={() => setMode("presets")}
                className="flex-1 py-2 text-xs font-bold transition-all rounded-lg flex items-center justify-center gap-2"
                style={mode === "presets" ? { background: THEME.cyan, color: "#0a0a0a" } : { color: THEME.textMuted }}
              >
                {Icons.Presets} Presets
              </button>
              <button
                onClick={() => setMode("manual")}
                className="flex-1 py-2 text-xs font-bold transition-all rounded-lg flex items-center justify-center gap-2"
                style={mode === "manual" ? { background: THEME.cyan, color: "#0a0a0a" } : { color: THEME.textMuted }}
              >
                {Icons.Manual} Manual
              </button>
            </div>
          </div>

          <div style={{ height: "1px", background: "rgba(255,255,255,0.05)" }} />

          {/* DYNAMIC MODE SETTINGS */}
          {mode === "presets" ? (
            <div className="flex flex-col gap-2 flex-shrink-0 overflow-visible">
              <span className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: THEME.textMuted }}>
                Dimensional Presets
              </span>
              <div className="flex flex-col gap-2 overflow-visible">
                {PRESETS.map(p => (
                  <div key={p.id} className="relative group overflow-visible z-30 hover:z-50">
                    <button
                      onClick={() => applyMatrix(p.mat)}
                      className="w-full px-4 py-3 rounded-xl text-left font-bold text-xs transition-all flex items-center justify-between"
                      style={JSON.stringify(targetMatrix) === JSON.stringify(p.mat)
                        ? { background: THEME.bgElement, border: `1px solid ${THEME.cyan}60`, color: THEME.textMain }
                        : { background: THEME.bgMain, border: "1px solid rgba(255,255,255,0.05)", color: "#6a6a8a" }
                      }
                    >
                      {p.label}
                    </button>
                    {/* Hover Explainer */}
                    <div className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 w-64 p-3 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 font-sans text-left text-xs"
                      style={{ background: THEME.bgElement, border: "1px solid rgba(255,255,255,0.08)", color: "#a0a0c0" }}
                    >
                      <span className="font-bold block mb-1" style={{ color: THEME.textMain }}>{p.label}</span>
                      {p.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4 flex-shrink-0 animate-in fade-in zoom-in-95 duration-200 overflow-visible">
              <div className="flex flex-col gap-2 overflow-visible">
                <span className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: THEME.textMuted }}>
                  Manual <Explainer term="Warp Coordinates" definition="A 2x2 matrix acts as the steering wheel for reality. It dictates exactly how the X (Left/Right) and Y (Up/Down) dimensions stretch or tilt." />
                </span>
                
                {/* 2x2 Matrix Input Grid */}
                <div className="grid grid-cols-2 gap-3 p-4 rounded-xl relative" style={{ background: THEME.bgMain, border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="absolute left-2 top-2 bottom-2 w-2 border-l-2 border-t-2 border-b-2 rounded-l-md" style={{ borderColor: "rgba(255,255,255,0.15)" }} />
                  <div className="absolute right-2 top-2 bottom-2 w-2 border-r-2 border-t-2 border-b-2 rounded-r-md" style={{ borderColor: "rgba(255,255,255,0.15)" }} />
                  
                  <input title="X-Stretch (Cyan)" value={mInputs[0]} onChange={e => handleManualInput(0, e.target.value)} className="w-full text-center text-sm font-mono p-2 rounded focus:outline-none transition-colors z-20" style={{ background: THEME.bgElement, border: "1px solid rgba(255,255,255,0.05)", color: THEME.cyan }} />
                  <input title="Y-Tilt (Pink)" value={mInputs[1]} onChange={e => handleManualInput(1, e.target.value)} className="w-full text-center text-sm font-mono p-2 rounded focus:outline-none transition-colors z-20" style={{ background: THEME.bgElement, border: "1px solid rgba(255,255,255,0.05)", color: THEME.pink }} />
                  <input title="X-Tilt (Cyan)" value={mInputs[2]} onChange={e => handleManualInput(2, e.target.value)} className="w-full text-center text-sm font-mono p-2 rounded focus:outline-none transition-colors z-20" style={{ background: THEME.bgElement, border: "1px solid rgba(255,255,255,0.05)", color: THEME.cyan }} />
                  <input title="Y-Stretch (Pink)" value={mInputs[3]} onChange={e => handleManualInput(3, e.target.value)} className="w-full text-center text-sm font-mono p-2 rounded focus:outline-none transition-colors z-20" style={{ background: THEME.bgElement, border: "1px solid rgba(255,255,255,0.05)", color: THEME.pink }} />
                </div>

                {/* Matrix Decoder Hover Trigger */}
                <div className="relative group mt-1 z-30 hover:z-50">
                  <div className="p-3 rounded-xl flex items-center justify-center gap-2 cursor-help text-[10px] font-bold uppercase tracking-widest transition-colors"
                    style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", color: THEME.textMuted }}
                  >
                    {Icons.Info} Matrix Decoder Ring
                  </div>
                  <div className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 w-72 p-4 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 font-sans text-left text-xs"
                    style={{ background: THEME.bgElement, border: "1px solid rgba(255,255,255,0.08)", color: "#a0a0c0" }}
                  >
                    <span className="font-bold block mb-3 uppercase tracking-widest text-[10px]" style={{ color: THEME.textMain }}>How to steer reality:</span>
                    <div className="flex flex-col gap-3">
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 rounded-full mt-1 flex-shrink-0" style={{ background: THEME.cyan }} />
                          <div className="leading-relaxed">
                            <strong style={{ color: THEME.cyan }}>Left Column (Cyan):</strong> Controls the "Right" direction (X-axis). Top box stretches it horizontally, bottom box tilts it vertically.
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 rounded-full mt-1 flex-shrink-0" style={{ background: THEME.pink }} />
                          <div className="leading-relaxed">
                            <strong style={{ color: THEME.pink }}>Right Column (Pink):</strong> Controls the "Up" direction (Y-axis). Top box tilts it horizontally, bottom box stretches it vertically.
                          </div>
                        </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Visibility Toggles */}
          <div className="flex flex-col gap-3 mt-auto flex-shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: THEME.textMuted }}>HUD Overlays</span>
            <label className="flex items-center gap-3 text-xs cursor-pointer group" style={{ color: "#a0a0c0" }}>
              <input type="checkbox" checked={showVectors} onChange={e => setShowVectors(e.target.checked)} className="w-4 h-4 cursor-pointer" style={{ accentColor: THEME.cyan }} />
              <span className="group-hover:text-white transition-colors">Show Base Coordinates</span>
            </label>
            <label className="flex items-center gap-3 text-xs cursor-pointer group" style={{ color: "#a0a0c0" }}>
              <input type="checkbox" checked={showGhost} onChange={e => setShowGhost(e.target.checked)} className="w-4 h-4 cursor-pointer" style={{ accentColor: THEME.cyan }} />
              <span className="group-hover:text-white transition-colors">Show Static Background Grid</span>
            </label>
            <label className="flex items-center gap-3 text-xs cursor-pointer group" style={{ color: "#a0a0c0" }}>
              <input type="checkbox" checked={showAnchors} onChange={e => setShowAnchors(e.target.checked)} className="w-4 h-4 cursor-pointer" style={{ accentColor: THEME.yellow }} />
              <span className="group-hover:text-white transition-colors">Show <Explainer term="Anchor Lines" definition="Mathematically called Eigenvectors. When reality warps, everything gets knocked off its path. These glowing lasers are the only structures in the universe that refuse to bend." /></span>
            </label>
          </div>

        </div>

        <div className="text-[9px] font-mono pt-4 text-center" style={{ color: "#3a3a5a", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
          MATRIX_RENDER · DEEP_VOID_V2
        </div>
      </div>

      {/* RIGHT MAIN CANVAS VIEWPORT */}
      <div className="flex-1 flex flex-col min-w-0 p-5 gap-4 overflow-hidden relative">
        
        <div className="flex items-center justify-between gap-4 px-4 py-3 rounded-xl flex-shrink-0 shadow-sm relative z-20"
          style={{ background: THEME.bgPanel, border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex flex-col">
            <span className="text-xs font-bold" style={{ color: THEME.textMain }}>Live Spatial Telemetry</span>
            <span className="text-xs" style={{ color: THEME.textMuted }}>
              Monitoring grid geometry and scaling ratios.
            </span>
          </div>

          <div className="flex gap-4">
            <div className="flex flex-col items-end pr-4 z-50" style={{ borderRight: "1px solid rgba(255,255,255,0.06)" }}>
              <span className="text-[9px] uppercase font-bold tracking-widest mb-1" style={{ color: THEME.textMuted }}>
                <Explainer term="Dimensional Density" definition="Mathematically known as the Determinant. It calculates how much the 2D grid expands or shrinks. If it hits exactly 0, space has collapsed into a flat 1D line." />
              </span>
              <span className="text-lg font-mono font-black transition-colors duration-300" style={{ color: Math.abs(determinant) < 0.01 ? THEME.pink : THEME.textMain }}>
                {Math.abs(determinant) < 0.01 ? "COLLAPSE" : `${determinant.toFixed(2)}x`}
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[9px] uppercase font-bold tracking-widest mb-1" style={{ color: THEME.textMuted }}>Status</span>
              <span className="text-xs font-mono font-bold transition-colors duration-300" style={{ color: Math.abs(determinant) < 0.01 ? THEME.pink : THEME.cyan }}>
                {Math.abs(determinant) < 0.01 ? "CRITICAL" : "STABLE"}
              </span>
            </div>
          </div>
        </div>

        {/* Draggable Viewport Container */}
        <div 
          ref={containerRef} 
          className={`flex-1 relative rounded-2xl overflow-hidden shadow-inner ${isGrabbing ? 'cursor-grabbing' : 'cursor-grab'}`} 
          style={{ border: "1px solid rgba(255,255,255,0.06)" }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          onWheel={handleWheel}
        >
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

          {/* Floating Camera Controls */}
          <div className="absolute bottom-6 right-6 flex rounded-xl shadow-lg z-10 overflow-hidden backdrop-blur"
            style={{ background: "rgba(19,19,31,0.8)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <button 
              onClick={() => setZoom(z => Math.max(15, z - 10))} 
              className="p-3 transition-colors hover:bg-white/5" 
              style={{ color: "#a0a0c0" }}
              title="Zoom Out"
            >
              {Icons.ZoomOut}
            </button>
            <div className="w-px" style={{ background: "rgba(255,255,255,0.08)" }} />
            <button 
              onClick={resetView} 
              className="p-3 transition-colors hover:bg-white/5" 
              style={{ color: "#a0a0c0" }}
              title="Reset View"
            >
              {Icons.Target}
            </button>
            <div className="w-px" style={{ background: "rgba(255,255,255,0.08)" }} />
            <button 
              onClick={() => setZoom(z => Math.min(150, z + 10))} 
              className="p-3 transition-colors hover:bg-white/5" 
              style={{ color: "#a0a0c0" }}
              title="Zoom In"
            >
              {Icons.ZoomIn}
            </button>
          </div>

        </div>
      </div>
    </main>
  )
}