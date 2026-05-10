"use client"

import { useEffect, useRef } from "react"

export function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const setSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    setSize()

    const stars = Array.from({ length: 300 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5,
      o: Math.random() * 0.8 + 0.2,
    }))

    // slight delay to ensure DOM is ready

    // slight delay to ensure DOM is ready
    const timeout = setTimeout(() => {
      setSize()
    }, 100)

    type ShootingStar = {
      x: number
      y: number
      len: number
      speed: number
      opacity: number
      active: boolean
    }

    const shootingStars: ShootingStar[] = Array.from({ length: 6 }, () => ({
      x: 0,
      y: 0,
      len: Math.random() * 150 + 80,
      speed: Math.random() * 6 + 4,
      opacity: 0,
      active: false,
    }))

    const resetShootingStar = (s: ShootingStar) => {
      s.x = Math.random() * canvas.width * 0.7
      s.y = Math.random() * canvas.height * 0.5
      s.opacity = 1
      s.active = true
    }

    shootingStars.forEach((s, i) => {
      setTimeout(() => resetShootingStar(s), i * 2000)
    })

    let animId: number

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      stars.forEach((s) => {
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${s.o})`
        ctx.fill()
      })

      shootingStars.forEach((s) => {
        if (!s.active) return
        ctx.beginPath()
        ctx.moveTo(s.x, s.y)
        ctx.lineTo(s.x - s.len, s.y - s.len * 0.4)
        const grad = ctx.createLinearGradient(s.x, s.y, s.x - s.len, s.y - s.len * 0.4)
        grad.addColorStop(0, `rgba(0,245,212,${s.opacity})`)
        grad.addColorStop(1, "rgba(0,245,212,0)")
        ctx.strokeStyle = grad
        ctx.lineWidth = 1.5
        ctx.stroke()

        s.x += s.speed
        s.y += s.speed * 0.4
        s.opacity -= 0.012

        if (s.opacity <= 0) {
          s.active = false
          setTimeout(() => resetShootingStar(s), Math.random() * 4000 + 1000)
        }
      })

      animId = requestAnimationFrame(draw)
    }

    draw()

    const handleResize = () => setSize()
    window.addEventListener("resize", handleResize)

    return () => {
      cancelAnimationFrame(animId)
      clearTimeout(timeout)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 9999, border: "0px solid red", width: "100%", height: "100%" }}
    />
  )
}