"use client"

import Image from "next/image"

export function About() {
  return (
    <section id="about" className="py-24 px-6">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-[family-name:var(--font-syne)] text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 text-center">
          About Me
        </h2>
        <p className="text-muted-foreground text-lg text-center mb-16 max-w-2xl mx-auto">
          Get to know me a little better.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Photo */}
          <div className="flex justify-center">
            <div className="relative w-72 h-72 md:w-96 md:h-96">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan/20 to-purple/20 blur-2xl" />
              <div className="relative w-full h-full rounded-2xl border border-border overflow-hidden bg-card">
                <Image
                  src="/images/avatar.jpg"
                  alt="Mark Joseph"
                  fill
                  className="object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none"
                  }}
                />
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="flex flex-col gap-6">
            {/* Pull quote */}
            <blockquote className="border-l-2 border-cyan pl-4">
              <p className="font-[family-name:var(--font-syne)] text-xl md:text-2xl font-bold text-foreground leading-snug">
                I build for the web.{" "}
                <span className="text-cyan">I ship things that work.</span>
              </p>
            </blockquote>

            <p className="text-foreground leading-relaxed">
              I&apos;m a Math and CS grad who builds and deploys{" "}
              <span className="text-cyan font-medium">production web applications</span> — from architecture to deployment. I work across the full stack using{" "}
              <span className="text-cyan font-medium">React, JavaScript, and REST APIs</span>, with real experience on Linux VPS infrastructure, database integration, and end-to-end deployment workflows.
            </p>

            <p className="text-muted-foreground leading-relaxed">
              I have a secondary edge in{" "}
              <span className="text-pink font-medium">instructional design</span> — which means I think about how people actually use what I build, not just whether it runs. Based in the Philippines, working with clients remotely.
            </p>

            {/* Quick facts */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-lg border border-border bg-card/50">
                <p className="text-2xl font-bold font-[family-name:var(--font-syne)] text-cyan">3+</p>
                <p className="text-xs text-muted-foreground mt-1">Years building for the web</p>
              </div>
              <div className="p-4 rounded-lg border border-border bg-card/50">
                <p className="text-2xl font-bold font-[family-name:var(--font-syne)] text-pink">4</p>
                <p className="text-xs text-muted-foreground mt-1">Projects shipped</p>
              </div>
              <div className="p-4 rounded-lg border border-border bg-card/50">
                <p className="text-2xl font-bold font-[family-name:var(--font-syne)] text-purple">2</p>
                <p className="text-xs text-muted-foreground mt-1">Live sites in production</p>
              </div>
              <div className="p-4 rounded-lg border border-border bg-card/50">
                <p className="text-2xl font-bold font-[family-name:var(--font-syne)] text-yellow">PH</p>
                <p className="text-xs text-muted-foreground mt-1">Based · Remote-ready</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}