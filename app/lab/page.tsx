"use client"

import { useEffect } from "react"
import Link from "next/link"

const visualizers = [
  {
    title: "Double Pendulum",
    description: "Two pendulums, one chaotic system. Tiny differences in starting position diverge into wildly different paths — chaos theory made visible.",
    tags: ["Physics", "Chaos Theory", "Canvas API"],
    href: "/lab/double-pendulum",
    color: "pink",
    icon: "◎",
  },
  {
    title: "Actuarial Sandbox",
    description: "Mortality models, life tables, insurance valuations, and net premium reserves. De Moivre to Makeham — all four models, live.",
    tags: ["Actuarial Math", "Survival Models", "React"],
    href: "/lab/actuarial",
    color: "purple",
    icon: "∫",
  },
  {
    title: "Graph Theory",
    description: "Drag nodes, draw edges, and run Dijkstra, BFS, or DFS on your own graph. Traversal animates in real time.",
    tags: ["Algorithms", "D3.js", "React"],
    href: "/lab/graph",
    color: "pink",
    icon: "⬡",
  },
  {
    title: "Linear Algebra",
    description: "Input a 2×2 matrix and watch the coordinate grid warp live. Eigenvectors, determinants, and 2D linear transformations.",
    tags: ["Canvas API", "Linear Maps", "React"],
    href: "/lab/linear-algebra",
    color: "yellow",
    icon: "▦",
  },
  {
    title: "Probability Simulations",
    description: "Coin flips, dice rolls, Monty Hall, birthday paradox — run thousands of trials and watch distributions emerge in real time.",
    tags: ["Statistics", "Simulation", "D3.js"],
    href: "/lab/probability",
    color: "cyan",
    icon: "∼",
  },
  {
    title: "Sorting Algorithms",
    description: "Bubble, merge, quick, and heap sort animated frame by frame. Adjust speed, array size, and step through manually.",
    tags: ["Algorithms", "Canvas API", "React"],
    href: "/lab/sorting",
    color: "purple",
    icon: "≋",
  },
]


const colorMap: Record<string, {
  border: string
  hover: string
  text: string
  iconBg: string
  iconText: string
}> = {
  cyan:   { border: "border-black/8",  hover: "hover:border-cyan/30   hover:shadow-[0_0_16px_rgba(0,245,212,0.06)]",   text: "group-hover:text-cyan",   iconBg: "bg-cyan/8",   iconText: "text-cyan/60"   },
  purple: { border: "border-black/8",  hover: "hover:border-purple/30 hover:shadow-[0_0_16px_rgba(155,93,229,0.06)]", text: "group-hover:text-purple", iconBg: "bg-purple/8", iconText: "text-purple/60" },
  pink:   { border: "border-black/8",  hover: "hover:border-pink/30   hover:shadow-[0_0_16px_rgba(241,91,181,0.06)]",   text: "group-hover:text-pink",   iconBg: "bg-pink/8",   iconText: "text-pink/60"   },
  yellow: { border: "border-black/8",  hover: "hover:border-yellow/30 hover:shadow-[0_0_16px_rgba(254,228,64,0.06)]", text: "group-hover:text-yellow", iconBg: "bg-yellow/8", iconText: "text-yellow/60" },
}

export default function LabPage() {
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("lab-mood", { detail: "idle" }))
  }, [])

  return (
    <main
      className="min-h-screen relative overflow-hidden"
      style={{ background: "var(--lab-bg, #f7f4ef)" }}
    >
      {/* Background — warm dot grid */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.08) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      {/* Subtle warm vignette */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 0%, rgba(254,228,64,0.06) 0%, transparent 60%), radial-gradient(ellipse at 100% 100%, rgba(0,245,212,0.05) 0%, transparent 50%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6 py-16 flex flex-col min-h-screen">

        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-black/40 hover:text-black/70 transition-colors mb-12 w-fit"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to portfolio
        </Link>

        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-black/10 bg-black/5 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-black/30" />
            <span className="text-xs text-black/50 font-medium tracking-wide uppercase">Interactive Math Experiments</span>
          </div>
          <h1
            className="text-5xl sm:text-6xl font-bold text-black/80 mb-3 tracking-tight"
            style={{ fontFamily: "var(--font-syne), 'Syne', sans-serif" }}
          >
            The Lab
          </h1>
          <p className="text-black/50 text-base max-w-xl leading-relaxed">
            Six visualizers. Pick one, break something, learn something.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 flex-1">
          {visualizers.map((v) => {
            const c = colorMap[v.color]
            return (
              <Link
                key={v.title}
                href={v.href}
                className={`group relative p-5 rounded-2xl border ${c.border} ${c.hover} bg-white/60 backdrop-blur-sm transition-all duration-200 flex flex-col justify-between`}
                style={{ minHeight: "180px" }}
              >
                <div>
                {/* Icon + title row */}
                <div className="flex items-start gap-3 mb-3">
                  <span
                    className={`text-xl leading-none ${c.iconBg} ${c.iconText} w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-mono`}
                  >
                    {v.icon}
                  </span>
                  <h2
                    className={`text-base font-bold text-black/70 ${c.text} transition-colors duration-200 leading-snug mt-1`}
                    style={{ fontFamily: "var(--font-syne), 'Syne', sans-serif" }}
                  >
                    {v.title}
                  </h2>
                </div>

                <p className="text-xs text-black/45 leading-relaxed">
                  {v.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 mt-4">
                {v.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-0.5 rounded-full bg-black/6 text-black/35 border border-black/8 font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Hover arrow */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-black/30">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                </svg>
              </div>
              </Link>
            )
          })}
        </div>

        {/* Footer note */}
        <p className="text-center text-black/25 text-xs mt-8 tracking-wide">
          jesu.dev / lab
        </p>

      </div>
    </main>
  )
}