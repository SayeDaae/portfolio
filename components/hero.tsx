import Link from "next/link"

const techStack = ["Frontend", "Backend", "UI/UX", "Instructional Design", "E-Learning"]

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center">
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple/20 rounded-full blur-[150px] translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan/15 rounded-full blur-[150px] -translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-24 text-center">
        {/* Availability Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan/30 bg-cyan/5 mb-8">
          <span className="w-2 h-2 rounded-full bg-cyan animate-pulse" />
          <span className="text-sm text-cyan font-medium">Available for work</span>
        </div>

        {/* Name */}
        <h1 className="font-[family-name:var(--font-playfair)] text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-foreground mb-6 tracking-tight text-balance">
          Mark Joseph
        </h1>

        {/* Subtitle */}
        <p className="font-[family-name:var(--font-syne)] text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-6">
          Web Developer <span className="text-pink">&</span> Instructional Designer
        </p>

        {/* Tagline */}
        <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed text-pretty">
          I build web experiences and learning platforms that are fast, functional, and worth remembering.
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
