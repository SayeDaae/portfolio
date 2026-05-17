"use client"

import { useEffect, useRef, useState, useCallback, ReactNode } from "react"
import Link from "next/link"

type Tab = "curve" | "crowd" | "cost"
type SpeciesId = "human" | "saiyan" | "viltrumite" | "xenomorph" | "wookie"

interface SpeciesConfig {
  id: SpeciesId
  label: string
  icon: ReactNode
  theme: string
  blurb: string
  lore: string
  imageQuery: string
  maxAge: number
  defaultAge: number
  B: number
  c: number
}

const Icons = {
  Back: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>,
  Info: <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>,
  Database: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"/></svg>,
  Human: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="3"/><path d="M7 22V11a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v11"/><path d="M12 22v-9"/></svg>,
  Saiyan: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2l-2 6c-2-1-4-1-6 1 3 1 4 4 3 7 4-1 6 0 7 2 0-3 2-5 5-5 3 0 4 3 4 3-1-3-3-5-6-5 1-2 2-4 1-6-2 1-3 3-3 3s-1-4-3-6z"/></svg>,
  Viltrumite: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14l8 8 8-8M4 10h16M12 2v8"/></svg>,
  Xenomorph: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2c-4 0-8 3-8 8s4 12 8 12 8-7 8-12-4-8-8-8zm0 18c-3 0-5-4-5-8 0-2 2-3 5-3s5 1 5 3c0 4-2 8-5 8z"/><path d="M12 12v3"/></svg>,
  Wookie: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2h8a4 4 0 0 1 4 4v12a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4z"/><path d="M8 6h8M8 10h8M8 14h8M8 18h8"/></svg>,
  Curve: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M3 21c4-6 9-10 18-10"/></svg>,
  Crowd: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Cost: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
}

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

const TABS: { id: Tab; label: string; icon: ReactNode; desc: string }[] = [
  { id: "curve", label: "Lifetime Timeline",    icon: Icons.Curve, desc: "Dynamic trajectory of remaining years" },
  { id: "crowd", label: "The Crowd Test",        icon: Icons.Crowd, desc: "Track 1,000 newborn clones thinning over time" },
  { id: "cost",  label: "Protection Pool",       icon: Icons.Cost,  desc: "Cost to guarantee support if you pass early" },
]

const SPECIES_LIST: SpeciesConfig[] = [
  { id: "human",      label: "Human",      icon: Icons.Human,      theme: "#3b82f6", blurb: "Averages 80 earth cycles. Balanced biology.",                             lore: "Standard Terran carbon-based lifeforms. Highly vulnerable to cellular deterioration, gravitational stress, and linear temporal decay.",                                                                          imageQuery: "/images/human.jpg",      maxAge: 100,  defaultAge: 30,   B: 0.0001,   c: 1.09   },
  { id: "saiyan",     label: "Saiyan",     icon: Icons.Saiyan,     theme: "#eab308", blurb: "Peak battle condition for generations, then sharp drop.",                  lore: "Warrior race with engineered phenotypes. Possesses an elongated biological youth window to optimize active combat eras before sudden systemic drop-off.",                                                          imageQuery: "/images/saiyan.png",     maxAge: 200,  defaultAge: 40,   B: 0.00005,  c: 1.045  },
  { id: "viltrumite", label: "Viltrumite", icon: Icons.Viltrumite, theme: "#ef4444", blurb: "Aging decelerates across millennia. Near planetary lifespan.",             lore: "Apex humanoids with hyper-dense cell structures. Smart-atoms decelerate physical wear-and-tear exponentially over centuries, granting near-invulnerability.",                                                      imageQuery: "/images/viltrumite.jpg", maxAge: 5000, defaultAge: 1500, B: 0.000001, c: 1.0025 },
  { id: "xenomorph",  label: "Xenomorph",  icon: Icons.Xenomorph,  theme: "#22c55e", blurb: "Extremely violent and short-lived survival timeline.",                     lore: "Endoparasitic biomechanical life. Lacks conventional aging mechanisms; succumbs rapidly to extreme metabolic burn rates and highly hostile environmental lifecycles.",                                          imageQuery: "/images/xenomorph.png",  maxAge: 15,   defaultAge: 2,    B: 0.05,     c: 1.3    },
  { id: "wookie",     label: "Wookie",     icon: Icons.Wookie,     theme: "#a8a29e", blurb: "Deep space tree-dwellers. Slow, long, uniform physical decline.",          lore: "Arboreal mammalian bipeds. Highly efficient respiratory networks allow steady cardiovascular durability spanning multiple human centuries.",                                                                         imageQuery: "/images/wookie.png",     maxAge: 400,  defaultAge: 100,  B: 0.00002,  c: 1.025  },
]

function instantRisk(x: number, B: number, c: number): number {
  return B * Math.pow(c, x)
}

function survivalProb(x: number, B: number, c: number): number {
  const steps = 60
  const dx = x / steps
  let logS = 0
  for (let i = 0; i < steps; i++) {
    const xi = (i + 0.5) * dx
    logS -= instantRisk(xi, B, c) * dx
  }
  return Math.exp(logS)
}

function chanceToSurvive(x: number, t: number, B: number, c: number): number {
  if (t <= 0) return 1
  const Sx = survivalProb(x, B, c)
  const Sxt = survivalProb(x + t, B, c)
  return Sx > 0 ? Sxt / Sx : 0
}

function useCanvas(draw: (ctx: CanvasRenderingContext2D, W: number, H: number) => void, deps: unknown[]) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")!
    const render = () => {
      const dpr = window.devicePixelRatio || 1
      const W = canvas.parentElement?.clientWidth || canvas.offsetWidth
      const H = canvas.parentElement?.clientHeight || canvas.offsetHeight
      if (canvas.width !== W * dpr || canvas.height !== H * dpr) {
        canvas.width = W * dpr
        canvas.height = H * dpr
        ctx.scale(dpr, dpr)
      }
      draw(ctx, W, H)
    }
    render()
    const observer = new ResizeObserver(() => render())
    if (canvas.parentElement) observer.observe(canvas.parentElement)
    return () => observer.disconnect()
  }, deps)
  return ref
}

function drawGridDark(ctx: CanvasRenderingContext2D, W: number, H: number, pad: number) {
  ctx.fillStyle = "#0a0a12"
  ctx.fillRect(0, 0, W, H)
  ctx.strokeStyle = "rgba(255,255,255,0.03)"
  ctx.lineWidth = 1
  const gridSize = 40
  for (let x = 0; x < W; x += gridSize) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke()
  }
  for (let y = 0; y < H; y += gridSize) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke()
  }
  ctx.strokeStyle = "rgba(255,255,255,0.1)"
  ctx.lineWidth = 1.2
  ctx.beginPath(); ctx.moveTo(pad, pad); ctx.lineTo(pad, H - pad); ctx.lineTo(W - pad, H - pad); ctx.stroke()
}

function CountdownTab({ species, currentAge }: { species: SpeciesConfig; currentAge: number }) {
  const canvasSx = useCanvas((ctx, W, H) => {
    const pad = 50
    drawGridDark(ctx, W, H, pad)

    ctx.font = "11px monospace"
    ctx.fillStyle = "#555577"
    ctx.textAlign = "center"
    for (let i = 0; i <= 5; i++) {
      const age = Math.round(currentAge + (i / 5) * (species.maxAge - currentAge))
      const sx = pad + (i / 5) * (W - pad * 2)
      ctx.fillText(`${age} yrs`, sx, H - pad + 18)
    }
    ctx.textAlign = "right"
    for (let i = 0; i <= 4; i++) {
      const val = i * 25
      const sy = H - pad - (i / 4) * (H - pad * 2)
      ctx.fillText(`${val}%`, pad - 12, sy + 4)
    }

    // Glow under curve
    const grad = ctx.createLinearGradient(0, pad, 0, H - pad)
    grad.addColorStop(0, species.theme + "40")
    grad.addColorStop(1, species.theme + "00")
    ctx.beginPath()
    let first = true
    for (let age = currentAge; age <= species.maxAge; age += (species.maxAge - currentAge) / 100) {
      const t = age - currentAge
      const y_prob = chanceToSurvive(currentAge, t, species.B, species.c)
      const sx = pad + ((age - currentAge) / (species.maxAge - currentAge)) * (W - pad * 2)
      const sy = H - pad - y_prob * (H - pad * 2)
      if (first) { ctx.moveTo(sx, sy); first = false } else ctx.lineTo(sx, sy)
    }
    ctx.lineTo(W - pad, H - pad)
    ctx.lineTo(pad, H - pad)
    ctx.closePath()
    ctx.fillStyle = grad
    ctx.fill()

    // Main curve
    ctx.beginPath()
    ctx.strokeStyle = species.theme
    ctx.lineWidth = 2.5
    first = true
    for (let age = currentAge; age <= species.maxAge; age += (species.maxAge - currentAge) / 100) {
      const t = age - currentAge
      const y_prob = chanceToSurvive(currentAge, t, species.B, species.c)
      const sx = pad + ((age - currentAge) / (species.maxAge - currentAge)) * (W - pad * 2)
      const sy = H - pad - y_prob * (H - pad * 2)
      if (first) { ctx.moveTo(sx, sy); first = false } else ctx.lineTo(sx, sy)
    }
    ctx.stroke()

    // Median line
    let medianAge = currentAge
    for (let t = 0; t < species.maxAge; t += (species.maxAge / 200)) {
      if (chanceToSurvive(currentAge, t, species.B, species.c) < 0.5) {
        medianAge = currentAge + t
        break
      }
    }
    const mx = pad + ((medianAge - currentAge) / (species.maxAge - currentAge)) * (W - pad * 2)
    ctx.strokeStyle = "rgba(255,255,255,0.2)"
    ctx.setLineDash([4, 4])
    ctx.beginPath(); ctx.moveTo(mx, pad); ctx.lineTo(mx, H - pad); ctx.stroke()
    ctx.setLineDash([])
    ctx.fillStyle = "rgba(255,255,255,0.6)"
    ctx.textAlign = "left"
    ctx.font = "11px monospace"
    ctx.fillText("50/50 · Age " + Math.round(medianAge), mx + 8, pad + 15)
  }, [species, currentAge])

  return (
    <div className="flex flex-col gap-3 h-full min-h-0">
      <p className="text-xs flex-shrink-0" style={{ color: "#5a5a7a" }}>
        Tracks your <Explainer term="odds of staying alive" definition="Your personalized percentage chance of surviving from your current age to any point in the future." /> as time marches forward.
      </p>
      <div className="flex-1 min-h-0 w-full relative rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
        <canvas ref={canvasSx} className="absolute inset-0 w-full h-full" />
      </div>
    </div>
  )
}

function CrowdTestTab({ species, onSurvivorCount }: { species: SpeciesConfig; onSurvivorCount: (n: number) => void }) {
  const initialCrowd = 1000
  const stepSize = Math.max(1, Math.round(species.maxAge / 8))
  const intervals = Array.from({ length: 9 }, (_, i) => i * stepSize)

  const rows = intervals.map(x => {
    const survivors = Math.round(initialCrowd * survivalProb(x, species.B, species.c))
    const surviveNextPhase = chanceToSurvive(x, Math.max(1, stepSize / 4), species.B, species.c) * 100
    let bonusYears = 0
    const resolution = species.maxAge > 1000 ? 5 : 0.5
    for (let t = resolution; t <= species.maxAge - x; t += resolution) {
      bonusYears += chanceToSurvive(x, t, species.B, species.c) * resolution
    }
    return { x, survivors, surviveNextPhase, bonusYears }
  })

  useEffect(() => {
    const minSurvivors = Math.min(...rows.map(r => r.survivors))
    onSurvivorCount(minSurvivors)
  }, [species])

  return (
    <div className="flex flex-col h-full overflow-hidden gap-3 min-h-0">
      <p className="text-xs flex-shrink-0" style={{ color: "#5a5a7a" }}>
        Tracking a population of <Explainer term="1,000 newborn clones" definition="Actuaries observe huge groups of individuals at once to predict survival headcount trends instead of guessing for a single person." /> over their lifetime.
      </p>
      <div className="overflow-auto flex-1 rounded-xl" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
        <table className="w-full text-xs text-left" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#13131f", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              {["Age Milestone", "Survivors", "Expected Life Remaining", "Odds of Next Milestone"].map(h => (
                <th key={h} className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider" style={{ color: "#5a5a7a" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.x} style={{ background: i % 2 === 0 ? "#0a0a12" : "#0f0f1a", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                <td className="px-5 py-3 font-mono" style={{ color: "#a0a0c0" }}>Age {r.x}</td>
                <td className="px-5 py-3 font-bold font-mono" style={{ color: r.survivors < 100 ? "#ff4444" : r.survivors < 500 ? "#fee440" : species.theme }}>
                  {r.survivors} / {initialCrowd}
                </td>
                <td className="px-5 py-3 font-mono" style={{ color: "#00f5d4" }}>+{Math.round(r.bonusYears)} cycles</td>
                <td className="px-5 py-3 font-mono" style={{ color: "#6a6a8a" }}>
                  {r.survivors === 0 ? "0.0%" : `${Math.min(100, r.surviveNextPhase).toFixed(1)}%`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function ProtectionCostTab({ species, currentAge }: { species: SpeciesConfig; currentAge: number }) {
  const [coverageTerm, setCoverageTerm] = useState(Math.max(1, Math.floor(species.maxAge / 10)))
  const [payout, setPayout] = useState(500000)

  useEffect(() => {
    if (coverageTerm >= species.maxAge - currentAge) {
      setCoverageTerm(Math.max(1, Math.floor((species.maxAge - currentAge) / 2)))
    }
  }, [species, currentAge, coverageTerm])

  const calculateCost = useCallback(() => {
    const growthRate = 0.04
    const discount = (t: number) => Math.exp(-growthRate * t)
    const step = species.maxAge > 1000 ? 1 : 0.05
    let riskPool = 0, costPool = 0
    for (let t = 0; t < coverageTerm; t += step) {
      const activeProb = chanceToSurvive(currentAge, t, species.B, species.c)
      const instantRiskVal = instantRisk(currentAge + t, species.B, species.c)
      riskPool += discount(t) * activeProb * instantRiskVal * step
      costPool += discount(t) * activeProb * step
    }
    return { yearlyCost: costPool > 0 ? (riskPool / costPool) * payout : 0 }
  }, [species, currentAge, coverageTerm, payout])

  const pricing = calculateCost()

  return (
    <div className="flex flex-col gap-4 h-full justify-between min-h-0 overflow-auto">
      <p className="text-xs flex-shrink-0" style={{ color: "#5a5a7a" }}>
        Annual contribution required for a <Explainer term="Shared Safety Pool" definition="A communal reserve. Everyone pays a fair rate based on their risk, guaranteeing full fund availability if a member passes away." />.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-shrink-0">
        {[
          { label: "Years of Protection", value: coverageTerm, min: 1, max: Math.max(2, Math.floor(species.maxAge - currentAge - 1)), step: 1, set: setCoverageTerm, display: `${coverageTerm} yrs`, accent: "#00f5d4" },
          { label: "Emergency Payout", value: payout, min: 10000, max: 2000000, step: 10000, set: setPayout, display: `$${payout.toLocaleString()}`, accent: "#f15bb5" },
        ].map(p => (
          <div key={p.label} className="flex flex-col gap-2 p-4 rounded-xl" style={{ background: "#13131f", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
              <span style={{ color: "#5a5a7a" }}>{p.label}</span>
              <span style={{ color: p.accent, fontFamily: "monospace" }}>{p.display}</span>
            </div>
            <input type="range" min={p.min} max={p.max} step={p.step} value={p.value}
              onChange={e => p.set(Number(e.target.value))}
              className="w-full cursor-pointer" style={{ accentColor: p.accent }} />
          </div>
        ))}
      </div>

      <div className="p-6 rounded-xl text-center relative overflow-hidden flex-shrink-0 my-auto"
        style={{ background: "#13131f", border: `1px solid ${species.theme}30` }}
      >
        <div className="absolute top-0 left-0 w-full h-0.5" style={{ backgroundColor: species.theme }} />
        <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#5a5a7a" }}>Galactic Pool Agreement</p>
        <p className="text-xs mt-1 max-w-sm mx-auto" style={{ color: "#6a6a8a" }}>
          Securing ${payout.toLocaleString()} over {coverageTerm} cycles.
        </p>
        <div className="mt-5">
          <p className="text-[10px] uppercase tracking-widest font-bold" style={{ color: "#5a5a7a" }}>Your Balanced Contribution</p>
          <p className="text-4xl font-black font-mono mt-1" style={{ color: species.theme }}>
            ${pricing.yearlyCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            <span className="text-xs font-normal ml-1" style={{ color: "#5a5a7a" }}>/ year</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function UniversalSandboxPage() {
  const [tab, setTab] = useState<Tab>("curve")
  const [selectedId, setSelectedId] = useState<SpeciesId>("human")
  const [userAge, setUserAge] = useState<number>(30)
  const [minSurvivors, setMinSurvivors] = useState(1000)

  const activeSpecies = SPECIES_LIST.find(s => s.id === selectedId) || SPECIES_LIST[0]

  const handleSpeciesSelector = (id: SpeciesId) => {
    setSelectedId(id)
    const target = SPECIES_LIST.find(s => s.id === id)!
    setUserAge(target.defaultAge)
  }

  // Creature mood logic
  useEffect(() => {
    let mood = "focus"
    if (selectedId === "xenomorph") mood = "panic"
    else if (selectedId === "viltrumite") mood = "focus"
    else if (tab === "crowd" && minSurvivors === 0) mood = "terror"
    else if (tab === "crowd" && minSurvivors < 100) mood = "panic"
    window.dispatchEvent(new CustomEvent("lab-mood", { detail: mood }))
  }, [selectedId, tab, minSurvivors])

  return (
    <main className="h-screen w-screen flex overflow-hidden antialiased font-sans"
      style={{ background: "#0f0f1a", color: "#e8e8f0" }}
    >
      {/* LEFT PANEL */}
      <div className="w-72 flex-shrink-0 flex flex-col justify-between p-5 z-20"
        style={{ background: "#13131f", borderRight: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex flex-col gap-5 min-h-0 flex-1 overflow-visible">

          {/* Header */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link href="/lab"
              className="p-2 rounded-xl transition-colors"
              style={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.08)", color: "#a0a0b8" }}
            >
              {Icons.Back}
            </Link>
            <div>
              <h1 className="text-sm font-bold tracking-tight" style={{ color: "#e8e8f0" }}>Probability Engine</h1>
              <p className="text-[10px]" style={{ color: "#5a5a7a" }}>Demographic Sandboxing Console</p>
            </div>
          </div>

          <div style={{ height: "1px", background: "rgba(255,255,255,0.05)" }} />

          {/* Species selector */}
          <div className="flex flex-col gap-2 flex-1 overflow-visible">
            <span className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 flex-shrink-0" style={{ color: "#5a5a7a" }}>
              {Icons.Database} Select Target Specimen
            </span>
            <div className="flex flex-col gap-1.5 flex-shrink-0 overflow-visible">
              {SPECIES_LIST.map(s => (
                <div key={s.id} className="relative group z-30 hover:z-50 overflow-visible">
                  <button
                    onClick={() => handleSpeciesSelector(s.id)}
                    className="w-full px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between"
                    style={selectedId === s.id
                      ? { background: "#1a1a2e", border: `1px solid ${s.theme}60`, color: "#e8e8f0" }
                      : { background: "#0f0f1a", border: "1px solid rgba(255,255,255,0.05)", color: "#6a6a8a" }
                    }
                  >
                    <div className="flex items-center gap-3">
                      <span style={{ color: selectedId === s.id ? s.theme : "#4a4a6a" }}>{s.icon}</span>
                      <span>{s.label}</span>
                    </div>
                    {selectedId === s.id && (
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.theme }} />
                    )}
                  </button>

                  {/* Hover dossier */}
                  <div className="pointer-events-none absolute left-full top-0 ml-3 w-64 p-4 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"
                    style={{ background: "#13131f", border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span style={{ color: s.theme }}>{s.icon}</span>
                      <h4 className="text-sm font-bold" style={{ color: "#e8e8f0" }}>{s.label} Dossier</h4>
                    </div>
                    <div className="w-full h-28 rounded-lg mb-3 overflow-hidden" style={{ background: "#0a0a12", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <img src={s.imageQuery} alt={s.label} className="w-full h-full object-cover opacity-80" />
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: "#6a6a8a" }}>{s.lore}</p>
                    <div className="mt-3 pt-2 flex justify-between text-[10px] font-mono" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", color: "#5a5a7a" }}>
                      <span>Max Lifespan:</span>
                      <span style={{ color: s.theme }}>~{s.maxAge} yrs</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[10px] mt-1 leading-normal" style={{ color: "#3a3a5a" }}>Hover any card to inspect biological blueprints.</p>
          </div>

          <div style={{ height: "1px", background: "rgba(255,255,255,0.05)" }} />

          {/* Age slider */}
          <div className="flex flex-col gap-3 p-4 rounded-xl flex-shrink-0"
            style={{ background: "#0f0f1a", border: "1px solid rgba(255,255,255,0.05)" }}
          >
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
              <span style={{ color: "#5a5a7a" }}>Specimen Age Window</span>
              <span className="font-mono" style={{ color: "#00f5d4" }}>{userAge} cycles</span>
            </div>
            <input type="range" min="0" max={Math.floor(activeSpecies.maxAge * 0.8)} step="1" value={userAge}
              onChange={e => setUserAge(Number(e.target.value))}
              className="w-full cursor-pointer" style={{ accentColor: "#00f5d4" }} />
            <div className="flex justify-between text-[9px] font-mono" style={{ color: "#3a3a5a" }}>
              <span>0 yrs</span>
              <span>Max: {Math.floor(activeSpecies.maxAge * 0.8)} yrs</span>
            </div>
          </div>
        </div>

        <p className="text-[9px] font-mono pt-4" style={{ color: "#2a2a4a", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
          PROBABILITY_ENGINE · GOMPERTZ_V4
        </p>
      </div>

      {/* RIGHT CONTENT */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Species bar */}
        <div className="flex items-center justify-between gap-4 px-6 py-4 flex-shrink-0"
          style={{ background: "#13131f", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center gap-3">
            <span style={{ color: activeSpecies.theme }}>{activeSpecies.icon}</span>
            <div>
              <span className="text-sm font-bold" style={{ color: "#e8e8f0" }}>{activeSpecies.label}</span>
              <p className="text-xs" style={{ color: "#5a5a7a" }}>{activeSpecies.blurb}</p>
            </div>
          </div>
          <div className="px-2.5 py-1 rounded-md text-[10px] font-mono uppercase tracking-widest"
            style={{ background: "#0f0f1a", border: "1px solid rgba(255,255,255,0.06)", color: "#5a5a7a" }}
          >
            {activeSpecies.id}-node
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 px-6 py-3 flex-shrink-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
              style={tab === t.id
                ? { background: "#00f5d4", color: "#0a0a0a", border: "1px solid #00f5d4" }
                : { background: "#1a1a2e", color: "#6a6a8a", border: "1px solid rgba(255,255,255,0.05)" }
              }
            >
              {t.icon}
              {t.label}
            </button>
          ))}
          <span className="ml-4 text-xs hidden lg:inline" style={{ color: "#3a3a5a" }}>
            {TABS.find(t => t.id === tab)?.desc}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden p-6 flex flex-col min-h-0">
          <div className="flex-1 rounded-2xl p-6 flex flex-col overflow-hidden min-h-0"
            style={{ background: "#13131f", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            {tab === "curve" && <CountdownTab species={activeSpecies} currentAge={userAge} />}
            {tab === "crowd" && <CrowdTestTab species={activeSpecies} onSurvivorCount={setMinSurvivors} />}
            {tab === "cost"  && <ProtectionCostTab species={activeSpecies} currentAge={userAge} />}
          </div>
        </div>
      </div>
    </main>
  )
}