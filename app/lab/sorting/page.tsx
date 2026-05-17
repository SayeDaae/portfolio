"use client"

import { useEffect, useRef, useState, useCallback, ReactNode } from "react"
import Link from "next/link"

type Algorithm = "bubble" | "merge" | "quick" | "heap"
type Status = "scrambled" | "processing" | "stabilized"

const Icons = {
  Back: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>,
  Info: <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>,
  Play: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  Pause: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>,
  Shuffle: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/><line x1="4" y1="4" x2="9" y2="9"/></svg>,
}

function Explainer({ term, definition }: { term: string; definition: string }) {
  return (
    <span className="relative group inline-flex items-center gap-1 cursor-help border-b border-dashed border-indigo-400 text-indigo-300 hover:text-white transition-colors select-none mx-0.5 z-50">
      {term}
      <span className="text-indigo-500/70 group-hover:text-indigo-300 transition-colors">{Icons.Info}</span>
      <span className="pointer-events-none absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 p-3 bg-neutral-900 border border-neutral-800 text-neutral-200 text-xs rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 font-sans font-normal text-left normal-case tracking-normal whitespace-normal block z-50">
        {definition}
      </span>
    </span>
  )
}

const ALGORITHMS: { id: Algorithm; label: string; term: string; desc: string; color: string }[] = [
  { id: "bubble", label: "Adjacent Sifting", term: "Bubble Sort", desc: "The brute-force method. Slowly bubbles the heaviest corrupted data to the end. Highly inefficient, computationally expensive.", color: "text-red-400" },
  { id: "merge", label: "Fractal Assembly", term: "Merge Sort", desc: "Divide and conquer. Shatters the data down to atomic, individual pieces before weaving them back together perfectly.", color: "text-cyan-400" },
  { id: "quick", label: "Pivot Isolation", term: "Quick Sort", desc: "Elects a central 'pivot' point and aggressively segregates data to either side. Fast, volatile, and highly efficient.", color: "text-pink-400" },
  { id: "heap", label: "Pyramid Extraction", term: "Heap Sort", desc: "Builds a strict, hierarchical 3D tree structure in memory, then harvests the largest elements one by one.", color: "text-yellow-400" },
]

// --- GENERATOR ALGORITHMS FOR FRAME-BY-FRAME ANIMATION ---

function* bubbleSort(arr: number[]) {
  const a = [...arr]
  const sorted: number[] = []
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < a.length - i - 1; j++) {
      yield { arr: [...a], active: [j, j + 1], type: 'compare', sorted: [...sorted] }
      if (a[j] > a[j + 1]) {
        const temp = a[j]; a[j] = a[j + 1]; a[j + 1] = temp;
        yield { arr: [...a], active: [j, j + 1], type: 'swap', sorted: [...sorted] }
      }
    }
    sorted.push(a.length - i - 1)
  }
  yield { arr: [...a], active: [], type: 'done', sorted: a.map((_, i) => i) }
}

function* mergeSort(arr: number[], l = 0, r = arr.length - 1): Generator<any, void, any> {
  if (l >= r) return
  let m = l + Math.floor((r - l) / 2)
  yield* mergeSort(arr, l, m)
  yield* mergeSort(arr, m + 1, r)
  
  // In-place merge visualization
  let start = l, start2 = m + 1
  if (arr[m] <= arr[start2]) return
  while (start <= m && start2 <= r) {
    yield { arr: [...arr], active: [start, start2], type: 'compare', sorted: [] }
    if (arr[start] <= arr[start2]) {
      start++
    } else {
      const value = arr[start2]
      let index = start2
      while (index !== start) {
        arr[index] = arr[index - 1]
        index--
      }
      arr[start] = value
      yield { arr: [...arr], active: [start, start2], type: 'swap', sorted: [] }
      start++; m++; start2++;
    }
  }
  if (l === 0 && r === arr.length - 1) yield { arr: [...arr], active: [], type: 'done', sorted: arr.map((_, i) => i) }
}

function* quickSort(arr: number[], start = 0, end = arr.length - 1, sorted: number[] = []): Generator<any, void, any> {
  if (start >= end) {
    if (start === end) sorted.push(start)
    if (sorted.length === arr.length) yield { arr: [...arr], active: [], type: 'done', sorted: [...sorted] }
    return
  }
  let pivotIndex = start
  const pivotValue = arr[end]
  for (let i = start; i < end; i++) {
    yield { arr: [...arr], active: [i, end], type: 'compare', sorted: [...sorted] }
    if (arr[i] < pivotValue) {
      const temp = arr[i]; arr[i] = arr[pivotIndex]; arr[pivotIndex] = temp;
      yield { arr: [...arr], active: [i, pivotIndex], type: 'swap', sorted: [...sorted] }
      pivotIndex++
    }
  }
  const temp = arr[pivotIndex]; arr[pivotIndex] = arr[end]; arr[end] = temp;
  yield { arr: [...arr], active: [pivotIndex, end], type: 'swap', sorted: [...sorted] }
  sorted.push(pivotIndex)

  yield* quickSort(arr, start, pivotIndex - 1, sorted)
  yield* quickSort(arr, pivotIndex + 1, end, sorted)
}

function* heapSort(arr: number[]): Generator<any, void, any> {
  const n = arr.length
  const sorted: number[] = []
  
  function* heapify(a: number[], n: number, i: number): Generator<any, void, any> {
    let largest = i
    const l = 2 * i + 1, r = 2 * i + 2
    if (l < n && a[l] > a[largest]) largest = l
    if (r < n && a[r] > a[largest]) largest = r
    if (largest !== i) {
      const temp = a[i]; a[i] = a[largest]; a[largest] = temp;
      yield { arr: [...a], active: [i, largest], type: 'swap', sorted: [...sorted] }
      yield* heapify(a, n, largest)
    }
  }

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) yield* heapify(arr, n, i)
  for (let i = n - 1; i > 0; i--) {
    const temp = arr[0]; arr[0] = arr[i]; arr[i] = temp;
    sorted.push(i)
    yield { arr: [...arr], active: [0, i], type: 'swap', sorted: [...sorted] }
    yield* heapify(arr, i, 0)
  }
  sorted.push(0)
  yield { arr: [...arr], active: [], type: 'done', sorted: [...sorted] }
}

export default function EntropyReversalPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const [algo, setAlgo] = useState<Algorithm>("quick")
  const [size, setSize] = useState(100)
  const [speed, setSpeed] = useState(50)
  
  const [status, setStatus] = useState<Status>("scrambled")
  const [stats, setStats] = useState({ compares: 0, swaps: 0 })

  const arrStateRef = useRef<{ arr: number[], active: number[], type: string, sorted: number[] }>({
    arr: [], active: [], type: 'none', sorted: []
  })
  
  const generatorRef = useRef<Generator<any, void, any> | null>(null)
  const rafRef = useRef<number | null>(null)
  const statsRef = useRef({ compares: 0, swaps: 0 })
  const statusRef = useRef<Status>("scrambled")
  const speedRef = useRef(speed)

  useEffect(() => { speedRef.current = speed }, [speed])
  useEffect(() => { statusRef.current = status }, [status])

  const generateArray = useCallback((len: number) => {
    const arr = Array.from({ length: len }, () => Math.floor(Math.random() * 100) + 10)
    arrStateRef.current = { arr, active: [], type: 'none', sorted: [] }
    statsRef.current = { compares: 0, swaps: 0 }
    setStats({ compares: 0, swaps: 0 })
    setStatus("scrambled")
    generatorRef.current = null
  }, [])

  useEffect(() => { generateArray(size) }, [size, generateArray])

  const startSort = () => {
    if (status === "stabilized") generateArray(size)
    
    setStatus("processing")
    const currentArr = arrStateRef.current.arr
    
    if (algo === "bubble") generatorRef.current = bubbleSort([...currentArr])
    else if (algo === "merge") generatorRef.current = mergeSort([...currentArr])
    else if (algo === "quick") generatorRef.current = quickSort([...currentArr])
    else if (algo === "heap") generatorRef.current = heapSort([...currentArr])
  }

  const pauseSort = () => setStatus(prev => prev === "processing" ? "scrambled" : "processing")

  // Canvas Drawing & Animation Loop
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

    let lastDrawTime = performance.now()

    const loop = (time: number) => {
      ctx.fillStyle = "#0a0a0a"
      ctx.fillRect(0, 0, W, H)

      // 1. Advance Generator if processing
      if (statusRef.current === "processing" && generatorRef.current) {
        // Speed logic: if speed is 100, do multiple steps per frame. If 1, do 1 step every 100ms.
        const s = speedRef.current
        const stepsPerFrame = s > 80 ? 10 : s > 50 ? 3 : 1
        const frameDelay = s < 50 ? (50 - s) * 2 : 0

        if (time - lastDrawTime > frameDelay) {
          lastDrawTime = time
          let done = false
          for (let i = 0; i < stepsPerFrame; i++) {
            const { value, done: isDone } = generatorRef.current.next()
            if (value) {
              arrStateRef.current = value
              if (value.type === 'compare') statsRef.current.compares++
              if (value.type === 'swap') statsRef.current.swaps++
            }
            if (isDone) {
              done = true; break
            }
          }
          setStats({ ...statsRef.current })
          if (done) {
             setStatus("stabilized")
             generatorRef.current = null
          }
        }
      }

      // 2. Render Array
      const { arr, active, type, sorted } = arrStateRef.current
      const barWidth = W / arr.length
      const gap = barWidth > 3 ? 1 : 0
      const maxVal = 110 // based on random generation

      for (let i = 0; i < arr.length; i++) {
        const val = arr[i]
        const h = (val / maxVal) * (H - 20)
        
        let color = "#3b2c5e" // Dull Corrupted Purple
        
        if (statusRef.current === "stabilized" || sorted.includes(i)) {
          color = "#39ff14" // Neon Green (Stabilized)
        } else if (active.includes(i)) {
          if (type === "compare") color = "#00f3ff" // Cyan (Reading)
          if (type === "swap") color = "#ff00ea"    // Pink (Writing/Moving)
        }

        ctx.fillStyle = color
        ctx.fillRect(i * barWidth, H - h, Math.max(1, barWidth - gap), h)

        // Glow cap
        if (color !== "#3b2c5e") {
           ctx.fillStyle = "#ffffff80"
           ctx.fillRect(i * barWidth, H - h, Math.max(1, barWidth - gap), 2)
        }
      }

      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)
    return () => { observer.disconnect(); if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [])

  const activeAlgoData = ALGORITHMS.find(a => a.id === algo)!

  return (
    <main className="fixed inset-0 m-0 p-0 z-50 flex bg-neutral-950 text-neutral-100 antialiased font-sans overflow-hidden">
      
      {/* 1. LEFT COMMAND CONSOLE */}
      <div className="w-80 border-r border-neutral-800 bg-neutral-900/40 p-6 flex flex-col justify-between flex-shrink-0 z-20">
        <div className="flex flex-col gap-6 min-h-0 flex-1 overflow-visible">
          
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link href="/lab" className="p-2 rounded-xl bg-neutral-900 text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition-colors border border-neutral-800">
              {Icons.Back}
            </Link>
            <div>
              <h1 className="text-md font-bold tracking-tight text-neutral-100">The Defragmenter</h1>
              <p className="text-[11px] text-neutral-500">Entropy Reversal Protocol</p>
            </div>
          </div>

          <div className="h-px bg-neutral-800 w-full flex-shrink-0" />

          {/* Protocol Selection */}
          <div className="flex flex-col gap-2 flex-shrink-0 overflow-visible">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
              Select Restoration Protocol
            </span>
            <div className="flex flex-col gap-2 overflow-visible">
              {ALGORITHMS.map(a => (
                <div key={a.id} className="relative group overflow-visible z-30 hover:z-50">
                  <button
                    onClick={() => { setAlgo(a.id); generateArray(size) }}
                    className={`w-full px-4 py-3 rounded-xl text-left font-bold text-xs transition-all border flex items-center justify-between ${
                      algo === a.id 
                        ? "bg-neutral-800 border-neutral-600 text-neutral-100 shadow-md" 
                        : "bg-neutral-950 border-neutral-900 text-neutral-500 hover:text-neutral-300 hover:border-neutral-700"
                    }`}
                  >
                    {a.label}
                    {algo === a.id && <span className={`w-1.5 h-1.5 rounded-full bg-current ${a.color}`} />}
                  </button>
                  {/* Lore Tooltip */}
                  <div className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 w-64 p-3 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 font-sans text-left text-xs text-neutral-300">
                    <span className={`font-bold block mb-1 ${a.color}`}>{a.term}</span>
                    {a.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="h-px bg-neutral-800 w-full flex-shrink-0" />

          {/* Engine Parameters */}
          <div className="flex flex-col gap-6 flex-shrink-0">
            <div className="flex flex-col gap-2">
              <label className="flex justify-between text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                <span>Data Volume (Array Size):</span>
                <span className="text-pink-400 font-mono">{size} Blocks</span>
              </label>
              <input 
                type="range" min="10" max="200" step="5" value={size} 
                onChange={e => setSize(Number(e.target.value))} 
                className="w-full accent-pink-500 cursor-pointer" 
                disabled={status === "processing"}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="flex justify-between text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                <span>Clock Speed:</span>
                <span className="text-cyan-400 font-mono">{speed}%</span>
              </label>
              <input 
                type="range" min="1" max="100" step="1" value={speed} 
                onChange={e => setSpeed(Number(e.target.value))} 
                className="w-full accent-cyan-500 cursor-pointer" 
              />
            </div>
          </div>

          <div className="flex gap-2 mt-auto">
            <button
              onClick={() => generateArray(size)}
              className="px-4 py-3 rounded-xl border border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900 transition-all flex items-center justify-center"
              title="Scramble Data"
            >
              {Icons.Shuffle}
            </button>
            <button
              onClick={status === "processing" ? pauseSort : startSort}
              className={`flex-1 px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border ${
                status === "processing" 
                  ? "border-red-900/50 bg-red-950/20 text-red-400 hover:bg-red-900/40" 
                  : "border-emerald-500/50 bg-emerald-950/30 text-emerald-400 hover:bg-emerald-900/50"
              }`}
            >
              {status === "processing" ? Icons.Pause : Icons.Play}
              {status === "processing" ? "Halt Protocol" : status === "stabilized" ? "Re-Scramble & Run" : "Execute Protocol"}
            </button>
          </div>

        </div>

        <div className="text-[10px] text-neutral-600 font-mono pt-4 border-t border-neutral-900/60 flex-shrink-0">
          SYSTEM STATUS: {status.toUpperCase()}<br />
          CONT_LOG: ENTROPY_REVERSAL_V1
        </div>
      </div>

      {/* 2. RIGHT MAIN CANVAS VIEWPORT */}
      <div className="flex-1 flex flex-col min-w-0 p-6 overflow-hidden">
        
        <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl mb-6 px-6 py-4 flex items-center justify-between gap-4 flex-shrink-0 shadow-sm z-20">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${status === "processing" ? "bg-pink-500 animate-pulse" : status === "stabilized" ? "bg-emerald-500" : "bg-neutral-600"}`} />
              <span className="text-sm font-bold text-neutral-100">{activeAlgoData.term} Target Locked</span>
            </div>
            <span className="text-xs text-neutral-400 mt-1 max-w-lg">
              {activeAlgoData.desc} Hover logic for <Explainer term="Time Complexity" definition="How efficiency scales as data grows. Bubble is O(n²), making it terrible for large arrays. Merge and Quick are O(n log n), making them vastly superior." />.
            </span>
          </div>

          <div className="flex gap-6">
            <div className="flex flex-col items-end border-r border-neutral-800 pr-6">
              <span className="text-[9px] uppercase font-bold text-cyan-500 tracking-widest mb-1">
                Read Cycles (Comparisons)
              </span>
              <span className="text-2xl font-mono font-black text-neutral-100">
                {stats.compares.toLocaleString()}
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[9px] uppercase font-bold text-pink-500 tracking-widest mb-1">
                Write Cycles (Swaps)
              </span>
              <span className="text-2xl font-mono font-black text-neutral-100">
                {stats.swaps.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div 
          ref={containerRef} 
          className="flex-1 relative bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden shadow-inner flex items-end justify-center px-4 pt-4"
        >
          {/* Canvas renders bottom-aligned equalizer bars */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
          />
        </div>
      </div>
    </main>
  )
}