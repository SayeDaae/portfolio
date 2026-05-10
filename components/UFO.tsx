"use client"

import { useEffect, useRef, useState } from "react"

type Laser = {
  id: number
  x: number
  y: number
  tx: number
  ty: number
  progress: number
}

export function UFO() {
  const [pos, setPos] = useState({ x: 300, y: 200 })
  const [dragging, setDragging] = useState(false)
  const [lasers, setLasers] = useState<Laser[]>([])
  const [floating, setFloating] = useState(0)
  const [tilt, setTilt] = useState(0)
  const cursorRef = useRef({ x: 0, y: 0 })
  const posRef = useRef({ x: 300, y: 200 })
  const dragOffset = useRef({ x: 0, y: 0 })
  const laserIdRef = useRef(0)
  const draggingRef = useRef(false)

  // Track cursor
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      cursorRef.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener("mousemove", onMove)
    return () => window.removeEventListener("mousemove", onMove)
  }, [])

  // UFO movement — runs away from cursor
    useEffect(() => {
    let frame: number
    let t = 0
    let targetX = Math.random() * window.innerWidth
    let targetY = Math.random() * window.innerHeight

    const animate = () => {
        t += 0.02
        setFloating(Math.sin(t) * 6)

        if (!draggingRef.current) {
        const cursor = cursorRef.current
        const ufo = posRef.current
        const dx = ufo.x - cursor.x
        const dy = ufo.y - cursor.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < 200) {
            // Run away from cursor
            const speed = Math.max(0.5, (200 - dist) / 200) * 2
            const nx = dx / dist
            const ny = dy / dist
            const newX = Math.max(40, Math.min(window.innerWidth - 40, ufo.x + nx * speed))
            const newY = Math.max(40, Math.min(window.innerHeight - 40, ufo.y + ny * speed))
            posRef.current = { x: newX, y: newY }
            setPos({ x: newX, y: newY })
            setTilt(nx > 0 ? -10 : 10)
        } else {
            // Drift toward random target
            const tdx = targetX - ufo.x
            const tdy = targetY - ufo.y
            const tdist = Math.sqrt(tdx * tdx + tdy * tdy)

            if (tdist < 50) {
            // Pick new target
            targetX = Math.random() * (window.innerWidth - 80) + 40
            targetY = Math.random() * (window.innerHeight - 80) + 40
            }

            const speed = 1.0
            const newX = ufo.x + (tdx / tdist) * speed
            const newY = ufo.y + (tdy / tdist) * speed
            posRef.current = { x: newX, y: newY }
            setPos({ x: newX, y: newY })
            setTilt(tdx > 0 ? 8 : -8)
        }
        }

        frame = requestAnimationFrame(animate)
    }

    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
    }, [])

  // Shoot lasers at cursor
  useEffect(() => {
    const shoot = () => {
      const ufo = posRef.current
      const cursor = cursorRef.current
      const dist = Math.sqrt(
        Math.pow(ufo.x - cursor.x, 2) + Math.pow(ufo.y - cursor.y, 2)
      )

      if (dist < 350 && !draggingRef.current) {
        const id = laserIdRef.current++
        setLasers((prev) => [
          ...prev,
          { id, x: ufo.x, y: ufo.y, tx: cursor.x, ty: cursor.y, progress: 0 },
        ])
        setTimeout(() => {
          setLasers((prev) => prev.filter((l) => l.id !== id))
        }, 400)
      }
    }

    const interval = setInterval(shoot, 600)
    return () => clearInterval(interval)
  }, [])

  // Animate lasers
  useEffect(() => {
    let frame: number
    const animate = () => {
      setLasers((prev) =>
        prev.map((l) => ({ ...l, progress: Math.min(1, l.progress + 0.08) }))
      )
      frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [])

  // Drag
  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    draggingRef.current = true
    setDragging(true)
    dragOffset.current = {
      x: e.clientX - posRef.current.x,
      y: e.clientY - posRef.current.y,
    }
  }

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!draggingRef.current) return
      const newX = e.clientX - dragOffset.current.x
      const newY = e.clientY - dragOffset.current.y
      posRef.current = { x: newX, y: newY }
      setPos({ x: newX, y: newY })
    }
    const onMouseUp = () => {
      draggingRef.current = false
      setDragging(false)
    }
    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", onMouseUp)
    return () => {
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onMouseUp)
    }
  }, [])

  return (
    <>
      {/* Lasers */}
      {lasers.map((laser) => {
        const x = laser.x + (laser.tx - laser.x) * laser.progress
        const y = laser.y + (laser.ty - laser.y) * laser.progress
        const angle = Math.atan2(laser.ty - laser.y, laser.tx - laser.x) * (180 / Math.PI)
        return (
          <div
            key={laser.id}
            className="fixed pointer-events-none"
            style={{
              left: x,
              top: y,
              zIndex: 9997,
              transform: `translate(-50%, -50%) rotate(${angle}deg)`,
            }}
          >
            <div
              style={{
                width: "20px",
                height: "3px",
                background: "linear-gradient(90deg, #00f5d4, #f15bb5)",
                borderRadius: "2px",
                boxShadow: "0 0 6px #00f5d4, 0 0 12px #f15bb5",
                opacity: 1 - laser.progress * 0.3,
              }}
            />
          </div>
        )
      })}

      {/* UFO */}
      <div
        onMouseDown={onMouseDown}
        className="fixed select-none"
        style={{
          left: pos.x,
          top: pos.y + floating,
          zIndex: 9998,
          cursor: dragging ? "grabbing" : "grab",
          transform: `translate(-50%, -50%) rotate(${tilt}deg)`,
          transition: dragging ? "none" : "transform 0.3s ease",
        }}
      >
        <svg width="120" height="75" viewBox="0 0 80 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Glow underneath */}
          <ellipse cx="40" cy="44" rx="22" ry="5" fill="#00f5d4" opacity="0.15" />

          {/* Beam */}
          <path
            d="M28 32 L20 48 L60 48 L52 32 Z"
            fill="url(#beamGrad)"
            opacity="0.12"
          />

          {/* Body bottom */}
          <ellipse cx="40" cy="32" rx="28" ry="8" fill="#1a1a1a" stroke="#00f5d4" strokeWidth="1.2" />

          {/* Body top dome */}
          <ellipse cx="40" cy="22" rx="16" ry="12" fill="#1a1a1a" stroke="#00f5d4" strokeWidth="1.2" />

          {/* Dome glass */}
          <ellipse cx="40" cy="21" rx="12" ry="9" fill="#00f5d4" opacity="0.08" />
          <ellipse cx="36" cy="18" rx="4" ry="3" fill="#ffffff" opacity="0.06" />

          {/* Lights */}
          <circle cx="20" cy="32" r="3" fill="#fee440" opacity="0.9">
            <animate attributeName="opacity" values="0.9;0.3;0.9" dur="1.2s" repeatCount="indefinite" />
          </circle>
          <circle cx="30" cy="36" r="3" fill="#f15bb5" opacity="0.9">
            <animate attributeName="opacity" values="0.9;0.3;0.9" dur="0.8s" repeatCount="indefinite" />
          </circle>
          <circle cx="40" cy="38" r="3" fill="#00f5d4" opacity="0.9">
            <animate attributeName="opacity" values="0.9;0.3;0.9" dur="1s" repeatCount="indefinite" />
          </circle>
          <circle cx="50" cy="36" r="3" fill="#9b5de5" opacity="0.9">
            <animate attributeName="opacity" values="0.9;0.3;0.9" dur="1.4s" repeatCount="indefinite" />
          </circle>
          <circle cx="60" cy="32" r="3" fill="#fee440" opacity="0.9">
            <animate attributeName="opacity" values="0.9;0.3;0.9" dur="0.9s" repeatCount="indefinite" />
          </circle>

          <defs>
            <linearGradient id="beamGrad" x1="40" y1="32" x2="40" y2="48" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#00f5d4" />
              <stop offset="100%" stopColor="#00f5d4" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </>
  )
}