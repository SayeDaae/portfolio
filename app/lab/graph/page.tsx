"use client"

import { useEffect, useRef, useState, useCallback, ReactNode } from "react"
import Link from "next/link"

type AppMode = "architect" | "traversal"
type BuildTool = "place" | "link" | "delete"
type Algorithm = "bfs" | "dfs" | "dijkstra"
type SelectionPhase = "origin" | "target"

interface Node {
  id: string
  x: number
  y: number
}

interface Edge {
  id: string
  source: string
  target: string
  weight: number
}

interface AnimFrame {
  activeNode: string | null
  activeEdge: string | null
  visitedNodes: string[]
  finalPath: string[]
}

const Icons = {
  Back: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>,
  Info: <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>,
  Architect: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>,
  Traversal: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m16 10-4 4-4-4"/></svg>,
  Play: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  Stop: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/></svg>,
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

function getDistance(n1: Node, n2: Node) {
  return Math.sqrt(Math.pow(n2.x - n1.x, 2) + Math.pow(n2.y - n1.y, 2))
}

function generateInitialGraph(W: number, H: number) {
  const cx = W / 2, cy = H / 2
  const nodes: Node[] = [
    { id: "A", x: cx - 150, y: cy - 100 },
    { id: "B", x: cx + 150, y: cy - 100 },
    { id: "C", x: cx - 200, y: cy + 100 },
    { id: "D", x: cx + 200, y: cy + 100 },
    { id: "E", x: cx, y: cy },
    { id: "F", x: cx, y: cy + 180 },
  ]
  const edges: Edge[] = [
    { id: "A-B", source: "A", target: "B", weight: getDistance(nodes[0], nodes[1]) },
    { id: "A-E", source: "A", target: "E", weight: getDistance(nodes[0], nodes[4]) },
    { id: "B-E", source: "B", target: "E", weight: getDistance(nodes[1], nodes[4]) },
    { id: "C-E", source: "C", target: "E", weight: getDistance(nodes[2], nodes[4]) },
    { id: "D-E", source: "D", target: "E", weight: getDistance(nodes[3], nodes[4]) },
    { id: "C-F", source: "C", target: "F", weight: getDistance(nodes[2], nodes[5]) },
    { id: "D-F", source: "D", target: "F", weight: getDistance(nodes[3], nodes[5]) },
  ]
  return { nodes, edges }
}

export default function NexusGridPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const [mode, setMode] = useState<AppMode>("architect")
  const [buildTool, setBuildTool] = useState<BuildTool>("place")
  const [algo, setAlgo] = useState<Algorithm>("bfs")
  const [speed, setSpeed] = useState(3)
  const [selectionPhase, setSelectionPhase] = useState<SelectionPhase>("origin")

  const nodesRef = useRef<Node[]>([])
  const edgesRef = useRef<Edge[]>([])
  const nextNodeId = useRef(7)

  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [startNode, setStartNode] = useState<string | null>("A")
  const [targetNode, setTargetNode] = useState<string | null>("F")

  const dragStartRef = useRef<string | null>(null)
  const mousePosRef = useRef<{ x: number; y: number } | null>(null)
  const modeRef = useRef(mode)
  const buildToolRef = useRef(buildTool)

  // Node dragging
  const draggingNodeRef = useRef<string | null>(null)
  const dragOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })

  const framesRef = useRef<AnimFrame[]>([])
  const currentFrameIdx = useRef(0)
  const [isRunning, setIsRunning] = useState(false)
  const animTimerRef = useRef<number>(0)

  useEffect(() => { modeRef.current = mode }, [mode])
  useEffect(() => { buildToolRef.current = buildTool }, [buildTool])

  // Creature mood — panic on execute, then back to focus
  const fireMood = (m: string) => window.dispatchEvent(new CustomEvent("lab-mood", { detail: m }))

  useEffect(() => {
    fireMood("focus")
  }, [])

  useEffect(() => {
    fireMood("focus")
  }, [mode])

  useEffect(() => {
    if (isRunning) {
      fireMood("panic")
      const t = setTimeout(() => fireMood("focus"), 1200)
      return () => clearTimeout(t)
    }
  }, [isRunning])

  useEffect(() => {
    setTimeout(() => {
      if (containerRef.current) {
        const { nodes, edges } = generateInitialGraph(containerRef.current.clientWidth, containerRef.current.clientHeight)
        nodesRef.current = nodes
        edgesRef.current = edges
      }
    }, 100)
  }, [])

  const generateFrames = useCallback(() => {
    if (!startNode || !targetNode) return
    const nodes = nodesRef.current
    const edges = edgesRef.current

    const adj = new Map<string, { target: string; id: string; weight: number }[]>()
    nodes.forEach(n => adj.set(n.id, []))
    edges.forEach(e => {
      adj.get(e.source)?.push({ target: e.target, id: e.id, weight: e.weight })
      adj.get(e.target)?.push({ target: e.source, id: e.id, weight: e.weight })
    })

    const frames: AnimFrame[] = []
    const pushFrame = (activeNode: string | null, activeEdge: string | null, visited: Set<string>, path: string[] = []) => {
      frames.push({ activeNode, activeEdge, visitedNodes: Array.from(visited), finalPath: [...path] })
    }

    const visited = new Set<string>()

    if (algo === "bfs") {
      const queue = [[startNode]]
      visited.add(startNode)
      pushFrame(startNode, null, visited)
      let found = false
      while (queue.length > 0 && !found) {
        const path = queue.shift()!
        const curr = path[path.length - 1]
        pushFrame(curr, null, visited)
        if (curr === targetNode) { pushFrame(null, null, visited, path); found = true; break }
        for (const neighbor of adj.get(curr) || []) {
          pushFrame(curr, neighbor.id, visited)
          if (!visited.has(neighbor.target)) {
            visited.add(neighbor.target)
            queue.push([...path, neighbor.target])
            pushFrame(neighbor.target, neighbor.id, visited)
          }
        }
      }
    } else if (algo === "dfs") {
      let found = false
      const dfs = (curr: string, path: string[]) => {
        if (found) return
        visited.add(curr)
        pushFrame(curr, null, visited)
        if (curr === targetNode) { found = true; pushFrame(null, null, visited, path); return }
        for (const neighbor of adj.get(curr) || []) {
          if (found) break
          pushFrame(curr, neighbor.id, visited)
          if (!visited.has(neighbor.target)) dfs(neighbor.target, [...path, neighbor.target])
        }
      }
      dfs(startNode, [startNode])
    } else if (algo === "dijkstra") {
      const dist = new Map<string, number>()
      const prev = new Map<string, { node: string; edge: string }>()
      const pq: string[] = []
      nodes.forEach(n => dist.set(n.id, Infinity))
      dist.set(startNode, 0)
      pq.push(startNode)
      while (pq.length > 0) {
        pq.sort((a, b) => dist.get(a)! - dist.get(b)!)
        const curr = pq.shift()!
        visited.add(curr)
        pushFrame(curr, null, visited)
        if (curr === targetNode) break
        for (const neighbor of adj.get(curr) || []) {
          pushFrame(curr, neighbor.id, visited)
          const alt = dist.get(curr)! + neighbor.weight
          if (alt < dist.get(neighbor.target)!) {
            dist.set(neighbor.target, alt)
            prev.set(neighbor.target, { node: curr, edge: neighbor.id })
            if (!pq.includes(neighbor.target)) pq.push(neighbor.target)
          }
        }
      }
      const finalPath = []
      let curr: string | undefined = targetNode
      if (prev.has(curr) || curr === startNode) {
        while (curr) { finalPath.unshift(curr); curr = prev.get(curr)?.node }
      }
      pushFrame(null, null, visited, finalPath)
    }

    framesRef.current = frames
    currentFrameIdx.current = 0
    setIsRunning(true)
  }, [algo, startNode, targetNode])

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    const ctx = canvas.getContext("2d")!

    let W = 0, H = 0
    let raf: number
    const dpr = window.devicePixelRatio || 1

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
      // Background
      ctx.fillStyle = "#0f0f1a"
      ctx.fillRect(0, 0, W, H)

      // Grid
      ctx.strokeStyle = "rgba(255,255,255,0.03)"
      ctx.lineWidth = 1
      for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke() }
      for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke() }

      const frame = framesRef.current[Math.floor(currentFrameIdx.current)] || {
        activeNode: null, activeEdge: null, visitedNodes: [], finalPath: []
      }

      const themeColor = algo === "bfs" ? "#00f5d4" : algo === "dfs" ? "#f15bb5" : "#fee440"

      // Edges
      edgesRef.current.forEach(e => {
        const s = nodesRef.current.find(n => n.id === e.source)
        const t = nodesRef.current.find(n => n.id === e.target)
        if (!s || !t) return
        const inPath = frame.finalPath.includes(s.id) && frame.finalPath.includes(t.id) &&
          Math.abs(frame.finalPath.indexOf(s.id) - frame.finalPath.indexOf(t.id)) === 1
        ctx.beginPath()
        ctx.moveTo(s.x, s.y)
        ctx.lineTo(t.x, t.y)
        if (inPath) {
          ctx.strokeStyle = themeColor
          ctx.lineWidth = 3
          ctx.globalAlpha = 1
          // Glow
          ctx.shadowColor = themeColor
          ctx.shadowBlur = 8
        } else if (frame.activeEdge === e.id) {
          ctx.strokeStyle = "#ffffff"
          ctx.lineWidth = 2.5
          ctx.globalAlpha = 0.7
          ctx.shadowBlur = 0
        } else {
          ctx.strokeStyle = "rgba(255,255,255,0.12)"
          ctx.lineWidth = 1.5
          ctx.globalAlpha = 1
          ctx.shadowBlur = 0
        }
        ctx.stroke()
        ctx.shadowBlur = 0
        ctx.globalAlpha = 1

        // Weight label
        if (frame.finalPath.length > 0 && algo === "dijkstra") {
          const mx = (s.x + t.x) / 2
          const my = (s.y + t.y) / 2
          ctx.fillStyle = "rgba(255,255,255,0.25)"
          ctx.font = "10px monospace"
          ctx.textAlign = "center"
          ctx.textBaseline = "middle"
          ctx.fillText(Math.round(e.weight).toString(), mx, my)
        }
      })

      // Tentative link line
      const activeStartNodeId = dragStartRef.current || selectedNode
      if (modeRef.current === "architect" && buildToolRef.current === "link" && activeStartNodeId && mousePosRef.current) {
        const startN = nodesRef.current.find(n => n.id === activeStartNodeId)
        if (startN) {
          ctx.beginPath()
          ctx.moveTo(startN.x, startN.y)
          ctx.lineTo(mousePosRef.current.x, mousePosRef.current.y)
          ctx.strokeStyle = "rgba(255,255,255,0.4)"
          ctx.lineWidth = 1.5
          ctx.setLineDash([6, 6])
          ctx.stroke()
          ctx.setLineDash([])
        }
      }

      // Nodes
      nodesRef.current.forEach(n => {
        const isVisited = frame.visitedNodes.includes(n.id)
        const isActive = frame.activeNode === n.id
        const inPath = frame.finalPath.includes(n.id)
        const isSelected = selectedNode === n.id
        const isStart = startNode === n.id
        const isTarget = targetNode === n.id

        // Glow ring
        if (inPath || isActive) {
          ctx.beginPath()
          ctx.arc(n.x, n.y, 26, 0, Math.PI * 2)
          ctx.fillStyle = (inPath ? themeColor : "#ffffff") + "18"
          ctx.fill()
          ctx.shadowColor = inPath ? themeColor : "#ffffff"
          ctx.shadowBlur = 12
        }

        ctx.beginPath()
        ctx.arc(n.x, n.y, 18, 0, Math.PI * 2)
        if (inPath) ctx.fillStyle = themeColor
        else if (isActive) ctx.fillStyle = "#ffffff"
        else if (isVisited) ctx.fillStyle = themeColor + "30"
        else ctx.fillStyle = "#13131f"
        ctx.fill()
        ctx.shadowBlur = 0

        ctx.lineWidth = isSelected ? 2.5 : 1.5
        ctx.strokeStyle = isStart ? "#00f5d4"
          : isTarget ? "#f15bb5"
          : isSelected ? "#ffffff"
          : inPath ? themeColor
          : "rgba(255,255,255,0.2)"
        ctx.stroke()

        ctx.fillStyle = inPath || isActive ? "#0a0a0a" : "#e8e8f0"
        ctx.font = "bold 13px monospace"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(n.id, n.x, n.y)
      })

      // Animation progression
      if (isRunning && framesRef.current.length > 0) {
        animTimerRef.current += 1
        const threshold = 15 - speed * 2.5
        if (animTimerRef.current > threshold) {
          currentFrameIdx.current += 1
          animTimerRef.current = 0
          if (currentFrameIdx.current >= framesRef.current.length) {
            setIsRunning(false)
            currentFrameIdx.current = framesRef.current.length - 1
          }
        }
      }

      raf = requestAnimationFrame(loop)
    }

    loop()
    return () => { observer.disconnect(); cancelAnimationFrame(raf) }
  }, [algo, selectedNode, startNode, targetNode, speed, isRunning])

  const handleCreateEdge = (id1: string, id2: string) => {
    const exists = edgesRef.current.some(e =>
      (e.source === id1 && e.target === id2) || (e.target === id1 && e.source === id2)
    )
    if (!exists && id1 !== id2) {
      const n1 = nodesRef.current.find(n => n.id === id1)
      const n2 = nodesRef.current.find(n => n.id === id2)
      if (n1 && n2) {
        edgesRef.current.push({ id: `${id1}-${id2}`, source: id1, target: id2, weight: getDistance(n1, n2) })
      }
    }
  }

  const getCanvasPos = (e: React.MouseEvent) => {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const getNodeAt = (x: number, y: number) =>
    nodesRef.current.find(n => Math.sqrt(Math.pow(n.x - x, 2) + Math.pow(n.y - y, 2)) < 25)

  const handleMouseDown = (e: React.MouseEvent) => {
    const { x, y } = getCanvasPos(e)
    const clickedNode = getNodeAt(x, y)

    if (mode === "architect") {
      if (buildTool === "place" && clickedNode) {
        // Start dragging existing node
        draggingNodeRef.current = clickedNode.id
        dragOffsetRef.current = { x: x - clickedNode.x, y: y - clickedNode.y }
      } else if (buildTool === "link" && clickedNode) {
        dragStartRef.current = clickedNode.id
      }
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    const { x, y } = getCanvasPos(e)
    mousePosRef.current = { x, y }

    // Drag node
    if (draggingNodeRef.current && mode === "architect" && buildTool === "place") {
      const node = nodesRef.current.find(n => n.id === draggingNodeRef.current)
      if (node) {
        node.x = x - dragOffsetRef.current.x
        node.y = y - dragOffsetRef.current.y
        // Update edge weights
        edgesRef.current.forEach(edge => {
          if (edge.source === node.id || edge.target === node.id) {
            const n1 = nodesRef.current.find(n => n.id === edge.source)
            const n2 = nodesRef.current.find(n => n.id === edge.target)
            if (n1 && n2) edge.weight = getDistance(n1, n2)
          }
        })
      }
    }
  }

  const handleMouseUp = (e: React.MouseEvent) => {
    const { x, y } = getCanvasPos(e)

    // If we were dragging a node, stop
    if (draggingNodeRef.current) {
      draggingNodeRef.current = null
      dragStartRef.current = null
      return
    }

    setIsRunning(false)
    framesRef.current = []

    const clickedNode = getNodeAt(x, y)

    if (mode === "architect") {
      if (buildTool === "place") {
        if (!clickedNode) {
          const id = String.fromCharCode(65 + (nextNodeId.current++ % 26))
          nodesRef.current.push({ id, x, y })
        }
      } else if (buildTool === "delete") {
        if (clickedNode) {
          nodesRef.current = nodesRef.current.filter(n => n.id !== clickedNode.id)
          edgesRef.current = edgesRef.current.filter(e => e.source !== clickedNode.id && e.target !== clickedNode.id)
          if (startNode === clickedNode.id) setStartNode(null)
          if (targetNode === clickedNode.id) setTargetNode(null)
        }
      } else if (buildTool === "link") {
        if (clickedNode) {
          if (dragStartRef.current && dragStartRef.current !== clickedNode.id) {
            handleCreateEdge(dragStartRef.current, clickedNode.id)
            setSelectedNode(null)
          } else if (selectedNode && selectedNode !== clickedNode.id) {
            handleCreateEdge(selectedNode, clickedNode.id)
            setSelectedNode(null)
          } else {
            setSelectedNode(selectedNode === clickedNode.id ? null : clickedNode.id)
          }
        } else {
          setSelectedNode(null)
        }
      }
    } else {
      if (clickedNode) {
        if (selectionPhase === "origin") {
          setStartNode(clickedNode.id)
          setSelectionPhase("target")
        } else {
          setTargetNode(clickedNode.id)
        }
      }
    }

    dragStartRef.current = null
  }

  const handleMouseLeave = () => {
    dragStartRef.current = null
    draggingNodeRef.current = null
    mousePosRef.current = null
  }

  const clearGrid = () => {
    setIsRunning(false)
    framesRef.current = []
    nodesRef.current = []
    edgesRef.current = []
    setStartNode(null)
    setTargetNode(null)
    nextNodeId.current = 0
  }

  const themeColor = algo === "bfs" ? "#00f5d4" : algo === "dfs" ? "#f15bb5" : "#fee440"

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
              <h1 className="text-sm font-bold tracking-tight" style={{ color: "#e8e8f0" }}>The Nexus Grid</h1>
              <p className="text-[10px]" style={{ color: "#5a5a7a" }}>Routing & Topology Sandbox</p>
            </div>
          </div>

          <div style={{ height: "1px", background: "rgba(255,255,255,0.05)" }} />

          {/* Mode Toggle */}
          <div className="flex flex-col gap-2 flex-shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#5a5a7a" }}>
              System Interface
            </span>
            <div className="flex p-1 rounded-xl gap-1" style={{ background: "#0f0f1a", border: "1px solid rgba(255,255,255,0.05)" }}>
              {[
                { id: "architect", label: "Architect", icon: Icons.Architect },
                { id: "traversal", label: "Traversal", icon: Icons.Traversal },
              ].map(m => (
                <button key={m.id}
                  onClick={() => { setMode(m.id as AppMode); setIsRunning(false); framesRef.current = [] }}
                  className="flex-1 py-2 text-xs font-bold transition-all rounded-lg flex items-center justify-center gap-2"
                  style={mode === m.id
                    ? { background: "#00f5d4", color: "#0a0a0a" }
                    : { color: "#5a5a7a" }
                  }
                >
                  {m.icon} {m.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ height: "1px", background: "rgba(255,255,255,0.05)" }} />

          {mode === "architect" ? (
            <div className="flex flex-col gap-3 flex-shrink-0">
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#5a5a7a" }}>
                Construction Tools
              </span>
              {[
                { id: "place",  label: "Spawn Hubs",      desc: "Click empty space to create. Drag existing nodes to move." },
                { id: "link",   label: "Forge Links",      desc: "Drag from one hub to another to connect." },
                { id: "delete", label: "Deconstruct",      desc: "Click any hub to remove it." },
              ].map(t => (
                <button key={t.id}
                  onClick={() => setBuildTool(t.id as BuildTool)}
                  className="w-full px-4 py-3 rounded-xl text-xs font-bold transition-all flex flex-col items-start gap-1"
                  style={buildTool === t.id
                    ? { background: "#1a1a2e", border: `1px solid ${themeColor}60`, color: "#e8e8f0" }
                    : { background: "#0f0f1a", border: "1px solid rgba(255,255,255,0.05)", color: "#6a6a8a" }
                  }
                >
                  <span style={buildTool === t.id ? { color: themeColor } : {}}>{t.label}</span>
                  <span className="text-[10px] font-normal" style={{ color: "#4a4a6a" }}>{t.desc}</span>
                </button>
              ))}
              <button onClick={clearGrid}
                className="w-full px-4 py-3 rounded-xl text-xs font-bold transition-colors mt-2"
                style={{ border: "1px solid rgba(241,91,181,0.3)", background: "rgba(241,91,181,0.05)", color: "#f15bb5" }}
              >
                Clear Entire Grid
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4 flex-shrink-0">

              {/* Origin / Target */}
              <div className="flex gap-2">
                {[
                  { phase: "origin", label: "Origin", value: startNode, active: "#00f5d4", activeBg: "rgba(0,245,212,0.08)" },
                  { phase: "target", label: "Target", value: targetNode, active: "#f15bb5", activeBg: "rgba(241,91,181,0.08)" },
                ].map(p => (
                  <button key={p.phase}
                    onClick={() => setSelectionPhase(p.phase as SelectionPhase)}
                    className="flex-1 p-3 rounded-xl flex flex-col items-center transition-all"
                    style={selectionPhase === p.phase
                      ? { border: `1px solid ${p.active}60`, background: p.activeBg }
                      : { border: "1px solid rgba(255,255,255,0.06)", background: "#0f0f1a" }
                    }
                  >
                    <span className="text-[9px] uppercase font-bold tracking-widest mb-1"
                      style={{ color: selectionPhase === p.phase ? p.active : "#5a5a7a" }}>
                      {p.label}
                    </span>
                    <span className="text-lg font-mono" style={{ color: "#e8e8f0" }}>{p.value || "--"}</span>
                  </button>
                ))}
              </div>
              <p className="text-[10px] italic text-center" style={{ color: "#3a3a5a" }}>
                Select a block, then click a hub on the canvas.
              </p>

              {/* Algorithms */}
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#5a5a7a" }}>
                Routing Protocols
              </span>
              {[
                { id: "bfs",      label: "Radar Ping",    term: "Breadth-First Search", desc: "Searches equally in all directions like a ripple.", color: "#00f5d4" },
                { id: "dfs",      label: "Deep Dive",     term: "Depth-First Search",   desc: "Plunges down a single path until it hits a dead end.", color: "#f15bb5" },
                { id: "dijkstra", label: "Optimal Route", term: "Dijkstra's Algorithm", desc: "Calculates the absolute shortest weighted path.", color: "#fee440" },
              ].map(a => (
                <div key={a.id} className="relative group overflow-visible z-30 hover:z-50">
                  <button
                    onClick={() => { setAlgo(a.id as Algorithm); setIsRunning(false) }}
                    className="w-full px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between"
                    style={algo === a.id
                      ? { background: "#1a1a2e", border: `1px solid ${a.color}60`, color: a.color }
                      : { background: "#0f0f1a", border: "1px solid rgba(255,255,255,0.05)", color: "#6a6a8a" }
                    }
                  >
                    {a.label}
                  </button>
                  <div className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 w-56 p-3 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 text-xs text-left"
                    style={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.08)", color: "#a0a0c0" }}
                  >
                    <span className="font-bold block mb-1" style={{ color: "#e8e8f0" }}>{a.term}</span>
                    {a.desc}
                  </div>
                </div>
              ))}

              {/* Speed */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                  <span style={{ color: "#5a5a7a" }}>Packet Speed</span>
                  <span style={{ color: themeColor, fontFamily: "monospace" }}>Tier {speed}</span>
                </div>
                <input type="range" min="1" max="5" step="1" value={speed}
                  onChange={e => setSpeed(Number(e.target.value))}
                  className="w-full cursor-pointer" style={{ accentColor: themeColor }} />
              </div>

              {/* Execute */}
              <div className="flex gap-2">
                {isRunning ? (
                  <button onClick={() => setIsRunning(false)}
                    className="flex-1 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                    style={{ border: "1px solid rgba(241,91,181,0.4)", background: "rgba(241,91,181,0.08)", color: "#f15bb5" }}
                  >
                    {Icons.Stop} Abort
                  </button>
                ) : (
                  <button onClick={generateFrames}
                    disabled={!startNode || !targetNode}
                    className="flex-1 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ background: themeColor, color: "#0a0a0a", border: `1px solid ${themeColor}` }}
                  >
                    {Icons.Play} Execute Route
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        <p className="text-[9px] font-mono pt-4" style={{ color: "#2a2a4a", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
          NEXUS_GRID · GRAPH_TOPOLOGY_V2
        </p>
      </div>

      {/* CANVAS AREA */}
      <div className="flex-1 flex flex-col min-w-0 p-5 gap-4 overflow-hidden">

        {/* Info bar */}
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl flex-shrink-0"
          style={{ background: "#13131f", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <span className="p-1.5 rounded-lg" style={{ background: "#1a1a2e", color: "#a0a0c0" }}>
            {mode === "architect" ? Icons.Architect : Icons.Traversal}
          </span>
          <div>
            <span className="text-xs font-bold" style={{ color: "#e8e8f0" }}>
              {mode === "architect" ? "Architect Mode" : "Traversal Mode"}
            </span>
            <p className="text-xs" style={{ color: "#5a5a7a" }}>
              {mode === "architect"
                ? "Build network topologies. Drag hubs to reposition them."
                : <span>Visualizing <Explainer term="Pathfinding Algorithms" definition="Math sequences used by GPS and AI to find the most efficient way through a complex network." /> in real time.</span>
              }
            </p>
          </div>
        </div>

        {/* Canvas */}
        <div ref={containerRef}
          className="flex-1 relative rounded-2xl overflow-hidden"
          style={{ border: "1px solid rgba(255,255,255,0.06)", cursor: mode === "architect" && buildTool === "place" ? "crosshair" : mode === "architect" ? "default" : "pointer" }}
        >
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
          />
        </div>
      </div>
    </main>
  )
}