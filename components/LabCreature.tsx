"use client"

import { useEffect, useRef, useState } from "react"

export type CreatureMood = "idle" | "excited" | "panic" | "focus" | "terror"

interface LabCreatureProps {
  mood?: CreatureMood
}

export function LabCreature({ mood = "idle" }: LabCreatureProps) {
  const cursorRef = useRef({ x: typeof window !== "undefined" ? window.innerWidth - 80 : 400, y: typeof window !== "undefined" ? window.innerHeight - 80 : 400 })
  const posRef = useRef({ x: typeof window !== "undefined" ? window.innerWidth - 80 : 400, y: typeof window !== "undefined" ? window.innerHeight - 80 : 400 })
  const [pos, setPos] = useState({ x: typeof window !== "undefined" ? window.innerWidth - 80 : 400, y: typeof window !== "undefined" ? window.innerHeight - 80 : 400 })
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 })
  const [patHappy, setPatHappy] = useState(false)
  const [nearHappy, setNearHappy] = useState(false)
  const [bob, setBob] = useState(0)
  const draggingRef = useRef(false)
  const dragOffset = useRef({ x: 0, y: 0 })
  const patTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      cursorRef.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener("mousemove", onMove)
    return () => window.removeEventListener("mousemove", onMove)
  }, [])

  useEffect(() => {
    let frame: number
    let t = 0
    const animate = () => {
      t += 0.04
      setBob(Math.sin(t) * 3)
      if (!draggingRef.current) {
        const cur = posRef.current
        const cursor = cursorRef.current
        const dx = cursor.x - cur.x
        const dy = cursor.y - cur.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist > 60) {
          const speed = mood === "terror" ? 2.5 : mood === "panic" ? 1.5 : mood === "excited" ? 0.8 : 0.4
          const newX = cur.x + (dx / dist) * speed
          const newY = cur.y + (dy / dist) * speed
          posRef.current = { x: newX, y: newY }
          setPos({ x: newX, y: newY })
        }
        const maxOff = 3
        const norm = Math.min(dist, 150) / 150
        setEyeOffset({
          x: (dx / (dist || 1)) * maxOff * norm,
          y: (dy / (dist || 1)) * maxOff * norm,
        })
        if (mood === "idle") setNearHappy(dist < 80)
      }
      frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [mood])

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    draggingRef.current = true
    dragOffset.current = {
      x: e.clientX - posRef.current.x,
      y: e.clientY - posRef.current.y,
    }
  }

  const onMouseUp = (e: React.MouseEvent) => {
    const dx = e.clientX - (posRef.current.x + dragOffset.current.x)
    const dy = e.clientY - (posRef.current.y + dragOffset.current.y)
    const moved = Math.sqrt(dx * dx + dy * dy)
    if (moved < 5) {
      setPatHappy(true)
      if (patTimeout.current) clearTimeout(patTimeout.current)
      patTimeout.current = setTimeout(() => {
        setPatHappy(false)
        patTimeout.current = null
      }, 1200)
    }
    draggingRef.current = false
  }

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!draggingRef.current) return
      const newX = e.clientX - dragOffset.current.x
      const newY = e.clientY - dragOffset.current.y
      posRef.current = { x: newX, y: newY }
      setPos({ x: newX, y: newY })
    }
    const onUp = () => { draggingRef.current = false }
    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", onUp)
    return () => {
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onUp)
    }
  }, [])

  const resolvedMood: CreatureMood = patHappy
    ? "excited"
    : mood !== "idle"
    ? mood
    : nearHappy
    ? "excited"
    : "idle"

  const isTerror = resolvedMood === "terror"
  const isPanic  = resolvedMood === "panic"
  const isFocus  = resolvedMood === "focus"
  const isHappy  = resolvedMood === "excited"

  const bodyColor   = isTerror ? "#cc2200" : isPanic ? "#ff8800" : isFocus ? "#9b5de5" : "#00f5d4"
  const darkerColor = isTerror ? "#991a00" : isPanic ? "#cc6600" : isFocus ? "#7a3fbf" : "#00c4a9"

  const S = 7

  const body: [number, number][] = [
    [3,0],[4,0],[5,0],[6,0],[7,0],[8,0],[9,0],[10,0],
    [1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1],[8,1],[9,1],[10,1],[11,1],[12,1],
    [0,2],[1,2],[2,2],[3,2],[4,2],[5,2],[6,2],[7,2],[8,2],[9,2],[10,2],[11,2],[12,2],[13,2],
    [0,3],[1,3],[2,3],[3,3],[4,3],[5,3],[6,3],[7,3],[8,3],[9,3],[10,3],[11,3],[12,3],[13,3],
    [0,4],[1,4],[2,4],[3,4],[4,4],[5,4],[6,4],[7,4],[8,4],[9,4],[10,4],[11,4],[12,4],[13,4],
    [0,5],[1,5],[2,5],[3,5],[4,5],[5,5],[6,5],[7,5],[8,5],[9,5],[10,5],[11,5],[12,5],[13,5],
    [0,6],[1,6],[2,6],[3,6],[4,6],[5,6],[6,6],[7,6],[8,6],[9,6],[10,6],[11,6],[12,6],[13,6],
    [1,7],[2,7],[3,7],[4,7],[5,7],[6,7],[7,7],[8,7],[9,7],[10,7],[11,7],[12,7],
    [3,8],[4,8],[5,8],[6,8],[7,8],[8,8],[9,8],[10,8],
    [4,9],[5,9],[6,9],[7,9],[8,9],
  ]

  const highlight: [number, number][] = [
    [9,0],[10,0],[10,1],[11,1],[11,2],
  ]

  const dark: [number, number][] = [
    [3,8],[4,8],[5,8],[6,8],[7,8],[8,8],[9,8],[10,8],
    [4,9],[5,9],[6,9],[7,9],[8,9],
  ]

  const terrorPixels: [number, number][] = [
    [4,0],[5,0],[6,0],[7,0],[8,0],[9,0],
    [3,1],[4,1],[5,1],[6,1],[7,1],[8,1],[9,1],[10,1],
  ]

  const W = 14 * S
  const H = 10 * S
  const leftEye  = { cx: 4 * S + S, cy: 4 * S }
  const rightEye = { cx: 9 * S + S, cy: 4 * S }

  return (
    <div
      className="fixed select-none"
      style={{
        left: pos.x,
        top: pos.y + bob,
        transform: "translate(-50%, -50%)",
        zIndex: 9990,
        cursor: "grab",
        filter: `drop-shadow(0 4px 14px ${bodyColor}66)`,
      }}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
    >
      <svg
        width={W + 4}
        height={H + 4}
        viewBox={`-2 -2 ${W + 4} ${H + 4}`}
        xmlns="http://www.w3.org/2000/svg"
        shapeRendering="crispEdges"
      >
        {/* Body */}
        {body.map(([px, py]) => (
          <rect key={`b-${px}-${py}`} x={px*S-1} y={py*S-1} width={S+2} height={S+2} fill={bodyColor} />
        ))}

        {/* Dark underside */}
        {dark.map(([px, py]) => (
          <rect key={`d-${px}-${py}`} x={px*S} y={py*S} width={S} height={S} fill={darkerColor} />
        ))}

        {/* Highlight */}
        {highlight.map(([px, py]) => (
          <rect key={`h-${px}-${py}`} x={px*S} y={py*S} width={S} height={S} fill="white" opacity={0.5} />
        ))}

        {/* Terror blue head pixels — rendered on top of body */}
        {isTerror && terrorPixels.map(([px, py]) => (
          <rect key={`t-${px}-${py}`} x={px*S} y={py*S} width={S} height={S} fill="#4fc3f7" opacity={0.9} />
        ))}

        {/* Left eye */}
        {isTerror ? (
          // × eye
          <>
            <line x1={leftEye.cx-4} y1={leftEye.cy-4} x2={leftEye.cx+4} y2={leftEye.cy+4} stroke="black" strokeWidth="2.5" strokeLinecap="square"/>
            <line x1={leftEye.cx+4} y1={leftEye.cy-4} x2={leftEye.cx-4} y2={leftEye.cy+4} stroke="black" strokeWidth="2.5" strokeLinecap="square"/>
          </>
        ) : isPanic ? (
          // Wide open, pupil shifted up — worried
          <>
            <rect x={leftEye.cx-S*.8} y={leftEye.cy-S*.8} width={S*1.6} height={S*1.6} fill="white"/>
            <rect x={leftEye.cx-S*.3} y={leftEye.cy-S*.7} width={S*.6} height={S*.6} fill="black"/>
          </>
        ) : isHappy ? (
          <path d={`M ${leftEye.cx-5} ${leftEye.cy+3} Q ${leftEye.cx} ${leftEye.cy-4} ${leftEye.cx+5} ${leftEye.cy+3}`} stroke="black" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        ) : isFocus ? (
          <rect x={leftEye.cx-5} y={leftEye.cy-1} width={10} height={3} fill="black"/>
        ) : (
          <>
            <rect x={leftEye.cx-S*.7} y={leftEye.cy-S*.7} width={S*1.4} height={S*1.4} fill="black"/>
            <rect x={leftEye.cx-S*.3+eyeOffset.x} y={leftEye.cy-S*.3+eyeOffset.y} width={S*.6} height={S*.6} fill="white"/>
          </>
        )}

        {/* Right eye */}
        {isTerror ? (
          <>
            <line x1={rightEye.cx-4} y1={rightEye.cy-4} x2={rightEye.cx+4} y2={rightEye.cy+4} stroke="black" strokeWidth="2.5" strokeLinecap="square"/>
            <line x1={rightEye.cx+4} y1={rightEye.cy-4} x2={rightEye.cx-4} y2={rightEye.cy+4} stroke="black" strokeWidth="2.5" strokeLinecap="square"/>
          </>
        ) : isPanic ? (
          <>
            <rect x={rightEye.cx-S*.8} y={rightEye.cy-S*.8} width={S*1.6} height={S*1.6} fill="white"/>
            <rect x={rightEye.cx-S*.3} y={rightEye.cy-S*.7} width={S*.6} height={S*.6} fill="black"/>
          </>
        ) : isHappy ? (
          <path d={`M ${rightEye.cx-5} ${rightEye.cy+3} Q ${rightEye.cx} ${rightEye.cy-4} ${rightEye.cx+5} ${rightEye.cy+3}`} stroke="black" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        ) : isFocus ? (
          <rect x={rightEye.cx-5} y={rightEye.cy-1} width={10} height={3} fill="black"/>
        ) : (
          <>
            <rect x={rightEye.cx-S*.7} y={rightEye.cy-S*.7} width={S*1.4} height={S*1.4} fill="black"/>
            <rect x={rightEye.cx-S*.3+eyeOffset.x} y={rightEye.cy-S*.3+eyeOffset.y} width={S*.6} height={S*.6} fill="white"/>
          </>
        )}

        {/* Mouth */}
        {isTerror ? (
          // Big screaming oval
          <ellipse cx={7*S} cy={6*S+2} rx={S*.9} ry={S*.7} fill="black"/>
        ) : isPanic ? (
          // Small worried oval
          <ellipse cx={7*S} cy={6*S+4} rx={S*.5} ry={S*.4} fill="black"/>
        ) : isHappy ? (
          <path d={`M ${5*S} ${6*S} Q ${7*S} ${7*S+4} ${9*S} ${6*S}`} stroke="black" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        ) : isFocus ? (
          <path d={`M ${5*S+4} ${6*S+2} Q ${7*S} ${6*S+2} ${9*S-4} ${6*S+2}`} stroke="black" strokeWidth="2" fill="none" strokeLinecap="round"/>
        ) : (
          <path d={`M ${5*S+4} ${6*S+2} Q ${7*S} ${6*S+8} ${9*S-4} ${6*S+2}`} stroke="black" strokeWidth="2" fill="none" strokeLinecap="round"/>
        )}

        {/* Happy blush */}
        {isHappy && (
          <>
            <rect x={1*S} y={5*S} width={S*1.5} height={S*.6} fill="#f15bb5" opacity={0.35} rx="2"/>
            <rect x={11*S} y={5*S} width={S*1.5} height={S*.6} fill="#f15bb5" opacity={0.35} rx="2"/>
          </>
        )}
      </svg>
    </div>
  )
}