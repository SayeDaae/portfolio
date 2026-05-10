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
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
                </div>
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="flex flex-col gap-6">
            {/* Pull quote */}
            <blockquote className="border-l-2 border-cyan pl-4">
              <p className="font-[family-name:var(--font-syne)] text-xl md:text-2xl font-bold text-foreground leading-snug">
                I build for the web.{" "}
                <span className="text-cyan">I design for people.</span>
              </p>
            </blockquote>

            <p className="text-foreground leading-relaxed">
              I&apos;m a Math and CS grad who landed at the intersection of{" "}
              <span className="text-cyan font-medium">web development</span> and{" "}
              <span className="text-pink font-medium">instructional design</span> — not by accident, but because the overlap is where the interesting work lives. Understanding how people learn makes me a better UI designer. Knowing how to build makes my designs actually ship.
            </p>

            <p className="text-muted-foreground leading-relaxed">
              I care about the details that most people skip — the ones that make something feel considered rather than just functional. Based in the Philippines, working with clients remotely across the globe.
            </p>

            {/* Quick facts */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-lg border border-border bg-card/50">
                <p className="text-2xl font-bold font-[family-name:var(--font-syne)] text-cyan">2+</p>
                <p className="text-xs text-muted-foreground mt-1">Years building for the web</p>
              </div>
              <div className="p-4 rounded-lg border border-border bg-card/50">
                <p className="text-2xl font-bold font-[family-name:var(--font-syne)] text-pink">3+</p>
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