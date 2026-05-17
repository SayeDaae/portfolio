"use client"

import { useState, useEffect, useRef, useCallback, ReactNode } from "react"
import Link from "next/link"

type Tab = "coin" | "dice" | "monty" | "birthday"

const Icons = {
  Back: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>,
  Info: <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>,
  Coin: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>,
  Dice: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><circle cx="15.5" cy="8.5" r="1.5"/><circle cx="15.5" cy="15.5" r="1.5"/><circle cx="8.5" cy="15.5" r="1.5"/></svg>,
  Monty: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14"/><path d="M2 20h20"/><path d="M14 12v.01"/></svg>,
  Birthday: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4"/><path d="M12 18v4"/><path d="M4.93 4.93l2.83 2.83"/><path d="M16.24 16.24l2.83 2.83"/><path d="M2 12h4"/><path d="M18 12h4"/><path d="M4.93 19.07l2.83-2.83"/><path d="M16.24 7.76l2.83-2.83"/></svg>,
}

function Explainer({ term, definition }: { term: string; definition: string }) {
  return (
    <span className="relative group inline-flex items-center gap-1 cursor-help border-b border-dashed border-indigo-300 text-indigo-600 hover:text-indigo-800 transition-colors select-none mx-0.5 z-50">
      {term}
      <span className="text-indigo-400 group-hover:text-indigo-600 transition-colors">{Icons.Info}</span>
      <span className="pointer-events-none absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 p-3 bg-white border border-gray-100 text-gray-600 text-xs rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 font-sans font-normal text-left normal-case tracking-normal whitespace-normal block z-50">
        {definition}
      </span>
    </span>
  )
}

const TABS: { id: Tab; label: string; icon: ReactNode }[] = [
  { id: "coin", label: "Coin Flip", icon: Icons.Coin },
  { id: "dice", label: "Dice Rolls", icon: Icons.Dice },
  { id: "monty", label: "Monty Hall", icon: Icons.Monty },
  { id: "birthday", label: "Birthday Paradox", icon: Icons.Birthday },
]

// --- MODULE 1: COIN FLIP ---
function CoinFlip({ sidebarPortal }: { sidebarPortal: (node: ReactNode) => void }) {
  const [heads, setHeads] = useState(0)
  const [tails, setTails] = useState(0)
  const [lastResult, setLastResult] = useState<"H" | "T" | null>(null)
  const [autoRunning, setAutoRunning] = useState(false)
  const autoRef = useRef<NodeJS.Timeout | null>(null)
  const total = heads + tails

  const flip = useCallback((count = 1) => {
    let h = 0, t = 0
    for (let i = 0; i < count; i++) {
      Math.random() < 0.5 ? h++ : t++
    }
    setLastResult(h > t || (h === t && Math.random() < 0.5) ? "H" : "T")
    setHeads(prev => prev + h)
    setTails(prev => prev + t)
  }, [])

  const toggleAuto = () => {
    if (autoRunning) {
      clearInterval(autoRef.current!)
      setAutoRunning(false)
    } else {
      setAutoRunning(true)
      autoRef.current = setInterval(() => flip(10), 50)
    }
  }

  useEffect(() => () => { if (autoRef.current) clearInterval(autoRef.current) }, [])
  const reset = () => { setHeads(0); setTails(0); setLastResult(null); setAutoRunning(false); clearInterval(autoRef.current!) }

  const headsW = total === 0 ? 50 : (heads / total) * 100
  const tailsW = total === 0 ? 50 : (tails / total) * 100

  useEffect(() => {
    sidebarPortal(
      <div className="flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
          Simulation Controls
        </span>
        <button onClick={() => flip(1)} className="w-full px-4 py-3 rounded-xl text-sm font-bold transition-all bg-gray-900 text-white hover:bg-gray-800 shadow-sm active:scale-95">Flip Once</button>
        <button onClick={() => flip(100)} className="w-full px-4 py-3 rounded-xl text-sm font-bold transition-all bg-gray-900 text-white hover:bg-gray-800 shadow-sm active:scale-95">Flip 100x</button>
        <button onClick={toggleAuto} className={`w-full px-4 py-3 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95 border ${autoRunning ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100" : "bg-white text-gray-900 border-gray-200 hover:bg-gray-50"}`}>
          {autoRunning ? "Stop Auto-Flip" : "Start Auto-Flip"}
        </button>
        <div className="h-px bg-gray-200 w-full my-2" />
        <button onClick={reset} className="w-full px-4 py-3 rounded-xl text-sm font-bold transition-all text-gray-500 hover:text-gray-900 hover:bg-gray-100">Reset Data</button>
      </div>
    )
  }, [flip, autoRunning, sidebarPortal])

  return (
    <div className="flex flex-col h-full items-center justify-center gap-12 w-full max-w-2xl mx-auto">
      <div className="text-center flex flex-col items-center">
        <div
          className="w-40 h-40 rounded-full border-[6px] border-gray-900 flex items-center justify-center text-6xl font-black cursor-pointer select-none transition-all duration-150 active:scale-95 shadow-lg"
          style={{ background: lastResult === "H" ? "#fde68a" : lastResult === "T" ? "#a5f3fc" : "#f3f4f6", color: "#111" }}
          onClick={() => flip(1)}
        >
          {lastResult ?? "?"}
        </div>
        <p className="text-sm text-gray-400 mt-6 font-medium">Click to flip</p>
      </div>

      <div className="flex flex-col gap-4 w-full px-8">
        <div className="flex justify-between text-sm font-mono font-bold tracking-wide">
          <span className="text-amber-600">Heads {heads} ({total ? ((heads/total)*100).toFixed(1) : "0.0"}%)</span>
          <span className="text-cyan-600">Tails {tails} ({total ? ((tails/total)*100).toFixed(1) : "0.0"}%)</span>
        </div>
        <div className="w-full h-4 rounded-full overflow-hidden flex bg-gray-100 shadow-inner">
          <div className="h-full transition-all duration-300 bg-amber-200" style={{ width: `${headsW}%` }} />
          <div className="h-full transition-all duration-300 bg-cyan-200" style={{ width: `${tailsW}%` }} />
        </div>
        <p className="text-center text-sm text-gray-500 font-mono mt-2">
          {total.toLocaleString()} total flips
          <br/><span className="text-xs mt-2 block opacity-75 font-sans">Watch the <Explainer term="Law of Large Numbers" definition="As the number of trials increases, the actual observed ratio will mathematically force itself closer and closer to the theoretical 50/50 probability." /> stabilize the chart.</span>
        </p>
      </div>
    </div>
  )
}

// --- MODULE 2: DICE ROLLS ---
function DiceRolls({ sidebarPortal }: { sidebarPortal: (node: ReactNode) => void }) {
  const [counts, setCounts] = useState([0, 0, 0, 0, 0, 0])
  const [lastRoll, setLastRoll] = useState<number | null>(null)
  const [autoRunning, setAutoRunning] = useState(false)
  const autoRef = useRef<NodeJS.Timeout | null>(null)
  
  const total = counts.reduce((a, b) => a + b, 0)
  const max = Math.max(...counts, 1)

  const roll = useCallback((n = 1) => {
    const next = [...counts]
    let last = 0
    for (let i = 0; i < n; i++) {
      last = Math.floor(Math.random() * 6)
      next[last]++
    }
    setCounts([...next])
    setLastRoll(last + 1)
  }, [counts])

  const toggleAuto = () => {
    if (autoRunning) { clearInterval(autoRef.current!); setAutoRunning(false) }
    else { setAutoRunning(true); autoRef.current = setInterval(() => roll(20), 50) }
  }

  useEffect(() => () => { if (autoRef.current) clearInterval(autoRef.current) }, [])
  const reset = () => { setCounts([0,0,0,0,0,0]); setLastRoll(null); setAutoRunning(false); clearInterval(autoRef.current!) }

  const faces = ["⚀","⚁","⚂","⚃","⚄","⚅"]
  const colors = ["#fca5a5","#fdba74","#fde68a","#86efac","#93c5fd","#c4b5fd"]

  useEffect(() => {
    sidebarPortal(
      <div className="flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
          Simulation Controls
        </span>
        <button onClick={() => roll(1)} className="w-full px-4 py-3 rounded-xl text-sm font-bold transition-all bg-gray-900 text-white hover:bg-gray-800 shadow-sm active:scale-95">Roll Once</button>
        <button onClick={() => roll(100)} className="w-full px-4 py-3 rounded-xl text-sm font-bold transition-all bg-gray-900 text-white hover:bg-gray-800 shadow-sm active:scale-95">Roll 100x</button>
        <button onClick={toggleAuto} className={`w-full px-4 py-3 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95 border ${autoRunning ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100" : "bg-white text-gray-900 border-gray-200 hover:bg-gray-50"}`}>
          {autoRunning ? "Stop Auto-Roll" : "Start Auto-Roll"}
        </button>
        <div className="h-px bg-gray-200 w-full my-2" />
        <button onClick={reset} className="w-full px-4 py-3 rounded-xl text-sm font-bold transition-all text-gray-500 hover:text-gray-900 hover:bg-gray-100">Reset Data</button>
      </div>
    )
  }, [roll, autoRunning, sidebarPortal])

  return (
    <div className="flex flex-col h-full items-center justify-center gap-12 w-full max-w-3xl mx-auto">
      <div className="text-center flex flex-col items-center">
        <div 
          className="text-8xl select-none cursor-pointer transition-all active:scale-90 text-gray-900" 
          onClick={() => roll(1)}
        >
          {lastRoll ? faces[lastRoll - 1] : "🎲"}
        </div>
        <p className="text-sm text-gray-400 mt-4 font-medium">Click to roll</p>
      </div>

      <div className="flex items-end gap-4 h-56 justify-center w-full px-8">
        {counts.map((c, i) => (
          <div key={i} className="flex flex-col items-center gap-2 flex-1 group">
            <span className="text-xs font-mono text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">{total ? ((c/total)*100).toFixed(1) : "0"}%</span>
            <span className="text-sm font-mono font-bold text-gray-600">{c}</span>
            <div
              className="w-full rounded-t-md transition-all duration-300"
              style={{ height: `${(c / max) * 160}px`, background: colors[i], minHeight: c > 0 ? 4 : 0 }}
            />
            <span className="text-2xl text-gray-800">{faces[i]}</span>
          </div>
        ))}
      </div>
      <p className="text-center text-sm text-gray-500 font-mono">
        {total.toLocaleString()} total rolls
      </p>
    </div>
  )
}

// --- MODULE 3: MONTY HALL ---
function MontyHall({ sidebarPortal }: { sidebarPortal: (node: ReactNode) => void }) {
  const [phase, setPhase] = useState<"pick" | "reveal" | "result">("pick")
  const [doors, setDoors] = useState([0, 1, 2])
  const [carDoor, setCarDoor] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [revealed, setRevealed] = useState<number | null>(null)
  const [switched, setSwitched] = useState<boolean | null>(null)
  const [stats, setStats] = useState({ switchWins: 0, switchLoss: 0, stayWins: 0, stayLoss: 0 })

  const start = useCallback(() => {
    setCarDoor(Math.floor(Math.random() * 3))
    setPhase("pick")
    setPicked(null)
    setRevealed(null)
    setSwitched(null)
  }, [])

  useEffect(() => { start() }, [start])

  const pickDoor = (d: number) => {
    if (phase !== "pick") return
    setPicked(d)
    const goat = doors.find(x => x !== d && x !== carDoor)!
    setRevealed(goat)
    setPhase("reveal")
  }

  const decide = (sw: boolean) => {
    if (phase !== "reveal" || picked === null) return
    setSwitched(sw)
    const finalPick = sw ? doors.find(x => x !== picked && x !== revealed)! : picked
    const won = finalPick === carDoor
    setStats(prev => ({
      ...prev,
      switchWins: sw && won ? prev.switchWins + 1 : prev.switchWins,
      switchLoss: sw && !won ? prev.switchLoss + 1 : prev.switchLoss,
      stayWins: !sw && won ? prev.stayWins + 1 : prev.stayWins,
      stayLoss: !sw && !won ? prev.stayLoss + 1 : prev.stayLoss,
    }))
    setPhase("result")
  }

  const switchWinRate = stats.switchWins + stats.switchLoss > 0 ? ((stats.switchWins / (stats.switchWins + stats.switchLoss)) * 100).toFixed(1) : "0.0"
  const stayWinRate = stats.stayWins + stats.stayLoss > 0 ? ((stats.stayWins / (stats.stayWins + stats.stayLoss)) * 100).toFixed(1) : "0.0"

  useEffect(() => {
    sidebarPortal(
      <div className="flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
          Paradox Analytics
        </span>
        
        <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm flex flex-col gap-1">
          <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">Switching</span>
          <span className="text-3xl font-mono font-black text-gray-900">{switchWinRate}%</span>
          <span className="text-xs text-gray-400 font-mono">Wins: {stats.switchWins} | Losses: {stats.switchLoss}</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm flex flex-col gap-1">
          <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">Staying</span>
          <span className="text-3xl font-mono font-black text-gray-900">{stayWinRate}%</span>
          <span className="text-xs text-gray-400 font-mono">Wins: {stats.stayWins} | Losses: {stats.stayLoss}</span>
        </div>

        <div className="h-px bg-gray-200 w-full my-2" />
        
        {phase === "result" && (
           <button onClick={start} className="w-full px-4 py-3 rounded-xl text-sm font-bold transition-all bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm active:scale-95">Play Next Round</button>
        )}
        <button onClick={() => setStats({ switchWins: 0, switchLoss: 0, stayWins: 0, stayLoss: 0 })} className="w-full px-4 py-3 rounded-xl text-sm font-bold transition-all text-gray-500 hover:text-gray-900 hover:bg-gray-100">Reset Scoreboard</button>
      </div>
    )
  }, [stats, switchWinRate, stayWinRate, phase, start, sidebarPortal])

  const doorEmoji = (d: number) => {
    if (phase === "result") return d === carDoor ? "🚗" : "🐐"
    if (d === revealed) return "🐐"
    return "🚪"
  }

  return (
    <div className="flex flex-col h-full items-center justify-center gap-12 w-full max-w-3xl mx-auto">
      <div className="text-center flex flex-col items-center w-full">
        <div className="h-16 flex items-center justify-center">
          {phase === "pick" && <p className="text-lg font-bold text-gray-900">Pick a door to start.</p>}
          {phase === "reveal" && <p className="text-lg font-bold text-indigo-600">A goat is revealed. Switch or stay?</p>}
          {phase === "result" && (
            <p className={`text-xl font-bold ${doors.find(x => x !== picked && x !== revealed) === carDoor && switched ? "text-emerald-600" : picked === carDoor && !switched ? "text-emerald-600" : "text-gray-600"}`}>
              {doors.find(x => x !== picked && x !== revealed) === carDoor && switched ? "🎉 You switched and won!" : picked === carDoor && !switched ? "🎉 You stayed and won!" : "😬 You lost."}
            </p>
          )}
        </div>

        <div className="flex gap-8 justify-center mt-6 w-full max-w-lg">
          {doors.map(d => (
            <button
              key={d}
              onClick={() => phase === "pick" ? pickDoor(d) : undefined}
              className={`flex-1 aspect-[2/3] rounded-2xl border-2 text-6xl flex items-center justify-center transition-all duration-300 font-bold bg-white
                ${d === picked ? "border-indigo-600 shadow-[0_8px_30px_rgba(79,70,229,0.2)] -translate-y-2" : "border-gray-200 shadow-sm"}
                ${d === revealed ? "opacity-50 border-gray-200 bg-gray-50" : ""}
                ${phase === "pick" ? "hover:border-indigo-400 hover:shadow-md cursor-pointer" : "cursor-default"}
              `}
            >
              {doorEmoji(d)}
            </button>
          ))}
        </div>
      </div>

      <div className="h-16 flex items-center justify-center w-full">
        {phase === "reveal" && (
          <div className="flex gap-4 w-full max-w-sm">
            <button onClick={() => decide(true)} className="flex-1 py-4 rounded-xl bg-indigo-600 text-white text-sm font-bold shadow-md hover:bg-indigo-700 hover:shadow-lg transition-all active:scale-95">
              Switch Door
            </button>
            <button onClick={() => decide(false)} className="flex-1 py-4 rounded-xl bg-white border-2 border-gray-200 text-gray-700 text-sm font-bold shadow-sm hover:border-gray-300 hover:bg-gray-50 transition-all active:scale-95">
              Stay Put
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// --- MODULE 4: BIRTHDAY PARADOX ---
function BirthdayParadox({ sidebarPortal }: { sidebarPortal: (node: ReactNode) => void }) {
  const [groupSize, setGroupSize] = useState(23)

  const exact = (n: number) => {
    let p = 1
    for (let i = 0; i < n; i++) p *= (365 - i) / 365
    return 1 - p
  }

  const prob = exact(groupSize)
  const points = Array.from({ length: 70 }, (_, i) => ({ x: i + 1, y: exact(i + 1) }))
  const W = 600, H = 250
  const px = (x: number) => ((x - 1) / 69) * W
  const py = (y: number) => H - y * H

  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${px(p.x)} ${py(p.y)}`).join(" ")
  const current = points[groupSize - 1]

  useEffect(() => {
    sidebarPortal(
      <div className="flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex flex-col gap-3">
          <label className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-wider">
            <span>Group Size:</span>
            <span className="text-indigo-600 font-mono font-bold">{groupSize} people</span>
          </label>
          <input
            type="range" min={2} max={70} value={groupSize}
            onChange={e => setGroupSize(Number(e.target.value))}
            className="w-full accent-indigo-600"
          />
          <div className="flex justify-between text-xs text-gray-400 font-mono">
            <span>2</span><span>70</span>
          </div>
        </div>

        <div className="h-px bg-gray-200 w-full" />

        <div className="flex flex-col gap-3">
           <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
            Paradox Milestones
          </span>
          <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50 border border-gray-100">
            <span className="text-sm font-mono text-gray-600">23 People</span>
            <span className="text-sm font-bold text-gray-900">50.7% Chance</span>
          </div>
          <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50 border border-gray-100">
            <span className="text-sm font-mono text-gray-600">57 People</span>
            <span className="text-sm font-bold text-gray-900">99.0% Chance</span>
          </div>
          <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50 border border-gray-100">
            <span className="text-sm font-mono text-gray-600">365 People</span>
            <span className="text-sm font-bold text-gray-900">100% Chance</span>
          </div>
        </div>
      </div>
    )
  }, [groupSize, sidebarPortal])

  return (
    <div className="flex flex-col h-full items-center justify-center gap-12 w-full max-w-3xl mx-auto px-8">
      <div className="text-center">
        <p className="text-7xl font-[family-name:var(--font-playfair)] font-black text-gray-900">{(prob * 100).toFixed(1)}%</p>
        <p className="text-sm text-gray-500 mt-4 font-medium">
          Chance of a shared birthday in a group of {groupSize}. <br/><span className="text-xs opacity-75 mt-1 block">Due to math combinations, the <Explainer term="odds skyrocket" definition="You aren't checking if someone matches YOUR birthday. You are checking every single person against every OTHER person. In a group of 23, that's 253 different pairs being checked!" /> much faster than human intuition expects.</span>
        </p>
      </div>

      <div className="w-full relative px-4">
        {/* Graph rendering */}
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible" style={{ height: H }}>
          <defs>
            <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#4f46e5" />
            </linearGradient>
          </defs>
          
          {/* Grid lines */}
          <line x1="0" y1={H/2} x2={W} y2={H/2} stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="0" y1={H} x2={W} y2={H} stroke="#d1d5db" strokeWidth="1" />
          <line x1="0" y1="0" x2="0" y2={H} stroke="#d1d5db" strokeWidth="1" />

          {/* Data Path */}
          <path d={`${pathD} L ${W} ${H} L 0 ${H} Z`} fill="url(#fill)" />
          <path d={pathD} fill="none" stroke="url(#lineGrad)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          
          {/* Active Marker */}
          <line x1={px(current.x)} y1="0" x2={px(current.x)} y2={H} stroke="#a5b4fc" strokeWidth="2" strokeDasharray="4 4" />
          <circle cx={px(current.x)} cy={py(current.y)} r="7" fill="#ffffff" stroke="#4f46e5" strokeWidth="3" className="shadow-md" />
          
          {/* Axis Labels */}
          <text x="-25" y={H} fontSize="12" fill="#9ca3af" className="font-mono">0%</text>
          <text x="-35" y={10} fontSize="12" fill="#9ca3af" className="font-mono">100%</text>
          <text x={W - 10} y={H + 20} fontSize="12" fill="#9ca3af" className="font-mono">70 People</text>
        </svg>
      </div>
    </div>
  )
}

// --- MASTER LAYOUT ---
export default function CozyProbabilityPage() {
  const [tab, setTab] = useState<Tab>("coin")
  const [sidebarContent, setSidebarContent] = useState<ReactNode>(null)

  const activeTabConfig = TABS.find(t => t.id === tab)!

  return (
    // The "fixed inset-0 m-0 p-0" entirely overrides any global layout wrapper bleeding into this page
    <main className="fixed inset-0 m-0 p-0 flex bg-[#f9f9f7] text-gray-900 antialiased font-sans overflow-hidden z-50">
      
      {/* 1. LEFT SIDEBAR CONSOLE */}
      <div className="w-80 border-r border-gray-200 bg-white p-6 flex flex-col justify-between flex-shrink-0 z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="flex flex-col gap-6 min-h-0 flex-1 overflow-visible">
          
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link href="/lab" className="p-2 rounded-xl bg-gray-50 text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors border border-gray-200">
              {Icons.Back}
            </Link>
            <div>
              <h1 className="text-lg font-[family-name:var(--font-playfair)] font-bold tracking-tight text-gray-900">Probability Lab</h1>
              <p className="text-xs text-gray-500">Statistics & Paradoxes</p>
            </div>
          </div>

          <div className="h-px bg-gray-100 w-full flex-shrink-0" />

          {/* Module Selector */}
          <div className="flex flex-col gap-2 flex-shrink-0">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
              Select Experiment
            </span>
            <div className="flex flex-col gap-1.5">
              {TABS.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`w-full px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-between border ${
                    tab === t.id 
                      ? "bg-white border-gray-200 text-gray-900 shadow-sm" 
                      : "bg-transparent border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={tab === t.id ? "text-indigo-600" : "text-gray-400"}>{t.icon}</span> 
                    <span>{t.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-gray-100 w-full flex-shrink-0" />

          {/* Dynamic Sidebar injected by active module */}
          <div className="flex-1 overflow-y-auto">
             {sidebarContent}
          </div>

        </div>

        <div className="text-[10px] text-gray-400 font-mono pt-4 border-t border-gray-100 flex-shrink-0 text-center">
          part of jesu.dev/lab
        </div>
      </div>

      {/* 2. RIGHT MAIN CONTENT WORKSPACE VIEWPORT */}
      <div className="flex-1 flex flex-col min-w-0 p-8 overflow-hidden bg-[#f9f9f7]">
        
        {/* Dynamic Context Header */}
        <div className="bg-white border border-gray-200 rounded-2xl mb-8 px-8 py-5 flex items-center justify-between gap-4 flex-shrink-0 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <span className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-600">
              {activeTabConfig.icon}
            </span>
            <div className="flex flex-col">
              <span className="text-lg font-[family-name:var(--font-playfair)] font-bold text-gray-900">{activeTabConfig.label}</span>
              <span className="text-sm text-gray-500">
                Run thousands of trials and watch the mathematical laws play out in real time.
              </span>
            </div>
          </div>
        </div>

        {/* Viewport Render Area */}
        <div className="flex-1 relative bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm flex items-center justify-center p-8">
           {tab === "coin" && <CoinFlip sidebarPortal={setSidebarContent} />}
           {tab === "dice" && <DiceRolls sidebarPortal={setSidebarContent} />}
           {tab === "monty" && <MontyHall sidebarPortal={setSidebarContent} />}
           {tab === "birthday" && <BirthdayParadox sidebarPortal={setSidebarContent} />}
        </div>
      </div>
    </main>
  )
}