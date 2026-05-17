"use client"

import Link from "next/link"
import { useReveal } from "@/hooks/useReveal"

// Updated to prioritize hard dev skills while retaining LX as a unique value proposition
const techStack = [
  "React", 
  "JavaScript", 
  "Python",
  "C#",
  "Docker",
  "MySQL",
  "REST APIs",
  "Git/GitHub",
  "UI/UX Design",
  "LX Architecture"
]

export function Hero() {
  const { ref, revealed } = useReveal()

  return (
    <section className="relative min-h-screen flex items-center justify-center">
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple/20 rounded-full blur-[150px] translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan/15 rounded-full blur-[150px] -translate-x-1/3 translate-y-1/3" />
      </div>

      <div
        ref={ref}
        className={`reveal ${revealed ? "revealed" : ""} relative z-10 mx-auto max-w-4xl px-6 py-24 text-center`}
      >
        {/* Availability & Credential Badges */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan/30 bg-cyan/5">
            <span className="w-2 h-2 rounded-full bg-cyan animate-pulse" />
            <span className="text-sm text-cyan font-medium">Available for work</span>
          </div>
        </div>

        {/* Name */}
        <h1 className="font-[family-name:var(--font-playfair)] text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-foreground mb-6 tracking-tight text-balance">
          Joseph Santos
        </h1>

        {/* Subtitle - Shifted focus to Dev, ID reframed as LX */}
        <p className="font-[family-name:var(--font-syne)] text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-6">
          Full-Stack Web Developer <span className="text-pink">&</span> LX Specialist
        </p>

        {/* Tagline - Merging the Math/CS background with user-centric development */}
        <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed text-pretty">
          Building high-performance web applications with a foundation in Mathematics and Computer Science. I engineer complex logic into intuitive user experiences.
        </p>

        {/* Tech Stack Pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {techStack.map((tech) => (
            <span
              key={tech}
              className="px-4 py-2 text-sm font-medium rounded-full bg-yellow/10 text-yellow border border-yellow/20 hover:bg-yellow/20 transition-colors"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* CTA Button */}
        <Link
          href="#work"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-cyan text-background font-semibold text-lg hover:bg-cyan/90 transition-all hover:scale-105 active:scale-100"
        >
          View My Work
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
          </svg>
        </Link>
      </div>
    </section>
  )
}